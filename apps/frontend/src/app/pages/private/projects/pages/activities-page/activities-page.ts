import { Component, computed, signal } from '@angular/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { inject } from '@angular/core'

import { Badge, BadgeVariant, Card, EmptyState, Icon, Modal, ProgressBar, StatCard } from '@org/ui'
import { ActivityStatus } from '@org/util'

import { ActivityDetailView } from './components/activity-detail-view/activity-detail-view'
import {
	buildActivityTree,
	MOCK_ACTIVITIES,
	MockActivity,
} from './mock-activities'

export type ActivityStatusFilter = 'ALL' | ActivityStatus

interface FlatRow extends MockActivity {
	depth: number
	hasChildren: boolean
}

@Component({
	selector: 'app-activities-page',
	standalone: true,
	imports: [Badge, Card, EmptyState, Icon, Modal, ProgressBar, RouterLink, StatCard, DatePipe, ActivityDetailView],
	templateUrl: './activities-page.html',
})
export class ActivitiesPage {
	private readonly route = inject(ActivatedRoute)

	readonly searchQuery  = signal('')
	readonly statusFilter = signal<ActivityStatusFilter>('ALL')
	readonly expandedIds  = signal<Set<string>>(new Set(['arq', 'est', 'ins']))

	// Modal state
	readonly selectedActivity = signal<MockActivity | null>(null)
	readonly modalOpen        = computed(() => this.selectedActivity() !== null)

	readonly projectId = computed(() => {
		return this.route.snapshot.parent?.params?.['id'] ?? ''
	})

	private readonly activityTree = buildActivityTree(MOCK_ACTIVITIES)

	readonly stats = computed(() => {
		const all = MOCK_ACTIVITIES
		return {
			total:       all.length,
			completed:   all.filter(a => a.status === 'COMPLETED').length,
			inProgress:  all.filter(a => a.status === 'IN_PROGRESS').length,
			blocked:     all.filter(a => a.status === 'BLOCKED').length,
			pending:     all.filter(a => a.status === 'PENDING').length,
			criticalPath: all.filter(a => a.isCriticalPath).length,
		}
	})

	readonly visibleRows = computed<FlatRow[]>(() => {
		const q       = this.searchQuery().toLowerCase().trim()
		const statusF = this.statusFilter()
		const expanded = this.expandedIds()

		const rows: FlatRow[] = []

		const addRows = (
			activities: (MockActivity & { children: MockActivity[] })[],
			depth: number,
		) => {
			for (const act of activities) {
				const hasChildren   = act.children.length > 0
				const matchesStatus = statusF === 'ALL' || act.status === statusF
				const matchesSearch = !q || act.name.toLowerCase().includes(q) || act.code.toLowerCase().includes(q)

				if (matchesStatus && matchesSearch) {
					rows.push({ ...act, depth, hasChildren })
				}

				if (hasChildren && expanded.has(act.id)) {
					addRows(act.children as (MockActivity & { children: MockActivity[] })[], depth + 1)
				}
			}
		}

		addRows(this.activityTree as (MockActivity & { children: MockActivity[] })[], 0)
		return rows
	})

	// ── Handlers ──────────────────────────────────────────────
	onSearch(event: Event): void {
		this.searchQuery.set((event.target as HTMLInputElement).value)
	}

	toggleExpand(id: string, event: Event): void {
		event.stopPropagation()
		this.expandedIds.update(set => {
			const next = new Set(set)
			next.has(id) ? next.delete(id) : next.add(id)
			return next
		})
	}

	openActivity(row: FlatRow): void {
		this.selectedActivity.set(row)
	}

	closeModal(): void {
		this.selectedActivity.set(null)
	}

	// ── Helpers ───────────────────────────────────────────────
	isExpanded(id: string): boolean {
		return this.expandedIds().has(id)
	}

	statusBadgeVariant(status: ActivityStatus): BadgeVariant {
		const map: Record<ActivityStatus, BadgeVariant> = {
			COMPLETED:   'completed',
			IN_PROGRESS: 'in-progress',
			PENDING:     'planning',
			BLOCKED:     'delayed',
		}
		return map[status]
	}

	statusLabel(status: ActivityStatus): string {
		const map: Record<ActivityStatus, string> = {
			COMPLETED:   'Completado',
			IN_PROGRESS: 'En progreso',
			PENDING:     'Pendiente',
			BLOCKED:     'Bloqueado',
		}
		return map[status]
	}

	statusFilterPillClass(value: ActivityStatusFilter): string {
		const base     = 'px-3 py-1.5 rounded-input text-small font-medium transition-colors cursor-pointer border'
		const active   = 'bg-primary text-white border-primary dark:bg-primary-light dark:text-dark-background dark:border-primary-light'
		const inactive = 'bg-surface text-text-secondary border-border hover:border-primary/50 hover:text-text-primary dark:bg-dark-surface dark:border-dark-border dark:text-dark-text/60'
		return `${base} ${this.statusFilter() === value ? active : inactive}`
	}

	rowDepthPadding(depth: number): string {
		return ['pl-3', 'pl-8', 'pl-14', 'pl-20'][Math.min(depth, 3)]
	}

	expandIconClass(isExpanded: boolean): string {
		return `transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`
	}
}
