import { DatePipe } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { BadgeVariant, Card, EmptyState, Icon, IconType, Modal, StatCard } from '@org/ui'

import { MOCK_ACTIVITIES } from '../activities-page/mock-activities'
import { LogDetailView } from './components/log-detail-view/log-detail-view'
import { LogFormModal } from './components/log-form-modal/log-form-modal'
import { MOCK_DAILY_LOGS, MockDailyLog } from './mock-daily-logs'

export type LogStatusFilter = 'ALL' | 'LOCKED' | 'OPEN'

interface WeatherOption {
	value: string
	label: string
	icon: string
}

const WEATHER_OPTIONS: WeatherOption[] = [
	{ value: 'ALL', label: 'Todos', icon: 'sun' },
	{ value: 'CLEAR', label: 'Despejado', icon: 'sun' },
	{ value: 'OVERCAST', label: 'Nublado', icon: 'cloud' },
	{ value: 'RAIN', label: 'Lluvia', icon: 'cloud-rain' },
	{ value: 'EXTREME', label: 'Clima extremo', icon: 'triangle-alert' },
]

@Component({
	selector: 'app-daily-logs-page',
	imports: [DatePipe, Card, EmptyState, Icon, Modal, StatCard, LogDetailView, LogFormModal],
	templateUrl: './daily-logs-page.html',
	styleUrl: './daily-logs-page.css',
})
export class DailyLogsPage {
	private readonly route = inject(ActivatedRoute)

	readonly projectId = computed(() => this.route.snapshot.parent?.params?.['id'] ?? '')

	// ── Filters ──────────────────────────────────────────────────
	readonly searchQuery = signal('')
	readonly statusFilter = signal<LogStatusFilter>('ALL')
	readonly activityFilter = signal<string>('ALL')

	// ── Detail modal ──────────────────────────────────────────────
	readonly selectedLog = signal<MockDailyLog | null>(null)
	readonly modalOpen   = computed(() => this.selectedLog() !== null)

	// ── Form modal (create / edit) ────────────────────────────────
	readonly formModalOpen    = signal(false)
	readonly formModalLog     = signal<MockDailyLog | null>(null)
	readonly formModalMode    = computed(() => this.formModalLog() ? 'edit' : 'create')

	// ── Data ─────────────────────────────────────────────────────
	readonly activityOptions = computed(() => [
		{ value: 'ALL', label: 'Todas las actividades' },
		...MOCK_ACTIVITIES.map(a => ({ value: a.id, label: `${a.code} — ${a.name}` })),
	])

	readonly stats = computed(() => {
		const all = MOCK_DAILY_LOGS
		const withIncidents = all.filter(l => !!l.content.incidents)
		const totalMedias = all.reduce((acc, l) => acc + l.evidence.mediaIds.length, 0)
		const totalHours = all.reduce((acc, l) => acc + l.metrics.workingHours, 0)
		return {
			total: all.length,
			locked: all.filter(l => l.isLocked).length,
			withIncidents,
			totalMedia: totalMedias,
			totalHours,
		}
	})

	readonly filteredLogs = computed<MockDailyLog[]>(() => {
		const q = this.searchQuery().toLowerCase().trim()
		const status = this.statusFilter()
		const actId = this.activityFilter()

		return MOCK_DAILY_LOGS.filter(log => {
			if (status === 'LOCKED' && !log.isLocked) return false
			if (status === 'OPEN' && log.isLocked) return false
			if (actId !== 'ALL' && !log.activityIds.includes(actId)) return false
			if (q) {
				const haystack = [
					log.content.title,
					log.content.description,
					log.content.incidents ?? '',
					log.authorName,
				]
					.join(' ')
					.toLowerCase()
				if (!haystack.includes(q)) return false
			}
			return true
		})
	})

	// Group by date for timeline display
	readonly groupedLogs = computed(() => {
		const logs = this.filteredLogs()
		const map = new Map<string, MockDailyLog[]>()
		for (const log of logs) {
			const key = log.reportDate.toISOString().split('T')[0]
			if (!map.has(key)) map.set(key, [])
			map.get(key)!.push(log)
		}
		// Sort dates descending
		return Array.from(map.entries())
			.sort(([a], [b]) => b.localeCompare(a))
			.map(([date, items]) => ({ date: new Date(date + 'T12:00:00'), items }))
	})

	// ── Helpers ───────────────────────────────────────────────────
	readonly weatherOptions = WEATHER_OPTIONS

	weatherLabel(w: string): string {
		return WEATHER_OPTIONS.find(o => o.value === w)?.label ?? w
	}

	weatherIcon(w: string): IconType {
		const map: Record<string, IconType> = {
			CLEAR: 'sun',
			OVERCAST: 'cloud',
			RAIN: 'cloud-rain',
			EXTREME: 'triangle-alert',
		}
		return map[w] ?? 'sun'
	}

	weatherClass(w: string): string {
		const map: Record<string, string> = {
			CLEAR: 'text-accent',
			OVERCAST: 'text-text-secondary dark:text-dark-text/60',
			RAIN: 'text-primary dark:text-primary-light',
			EXTREME: 'text-danger',
		}
		return map[w] ?? ''
	}

	activityNames(activityIds: string[]): string[] {
		return activityIds
			.map(id => MOCK_ACTIVITIES.find(a => a.id === id))
			.filter(Boolean)
			.map(a => `${a!.code} ${a!.name}`)
	}

	statusPillClass(value: LogStatusFilter): string {
		const base = 'px-3 py-1.5 rounded-input text-small font-medium transition-colors cursor-pointer border'
		const active =
			'bg-primary text-white border-primary dark:bg-primary-light dark:text-dark-background dark:border-primary-light'
		const inactive =
			'bg-surface text-text-secondary border-border hover:border-primary/50 hover:text-text-primary dark:bg-dark-surface dark:border-dark-border dark:text-dark-text/60'
		return `${base} ${this.statusFilter() === value ? active : inactive}`
	}

	openLog(log: MockDailyLog): void {
		this.selectedLog.set(log)
	}

	closeModal(): void {
		this.selectedLog.set(null)
	}

	openCreateForm(): void {
		this.formModalLog.set(null)
		this.formModalOpen.set(true)
	}

	openEditForm(log: MockDailyLog, event: Event): void {
		event.stopPropagation()
		this.selectedLog.set(null)  // close detail modal if open
		this.formModalLog.set(log)
		this.formModalOpen.set(true)
	}

	closeFormModal(): void {
		this.formModalOpen.set(false)
		this.formModalLog.set(null)
	}

	onFormSaved(): void {
		this.closeFormModal()
	}

	onSearch(event: Event): void {
		this.searchQuery.set((event.target as HTMLInputElement).value)
	}

	roleLabel(role: string): string {
		const map: Record<string, string> = {
			ADMIN: 'Admin',
			SUPERVISOR: 'Supervisor',
			RESIDENT: 'Residente',
			VIEWER: 'Visor',
		}
		return map[role] ?? role
	}

	roleBadgeVariant(role: string): BadgeVariant {
		const map: Record<string, BadgeVariant> = {
			ADMIN: 'in-progress',
			SUPERVISOR: 'planning',
			RESIDENT: 'completed',
			VIEWER: 'custom',
		}
		return (map[role] as BadgeVariant) ?? 'custom'
	}
}
