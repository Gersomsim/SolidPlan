import { DatePipe } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Card, EmptyState, Icon, Modal, ProgressBar, StatCard } from '@org/ui'
import { ActivityProgressType, ActivityStatus } from '@org/util'

import { ActivityDetailView } from './components/activity-detail-view/activity-detail-view'
import { MOCK_ACTIVITIES, MockActivity, buildActivityTree } from './mock-activities'

export type ActivityStatusFilter = 'ALL' | ActivityStatus

interface FlatRow extends MockActivity {
	depth: number
	hasChildren: boolean
}

const CATEGORY_OPTIONS = [
	{ label: 'Diseño',         color: '#3B82F6' },
	{ label: 'Topografía',     color: '#8B5CF6' },
	{ label: 'Estructura',     color: '#F59E0B' },
	{ label: 'Albañilería',    color: '#92400E' },
	{ label: 'Instalaciones',  color: '#10B981' },
	{ label: 'Acabados',       color: '#EC4899' },
	{ label: 'Obra Civil',     color: '#64748B' },
]

const ROLE_OPTIONS = [
	{ value: 'ADMIN',      label: 'Administrador', description: 'Gestión total de la actividad' },
	{ value: 'SUPERVISOR', label: 'Supervisor',     description: 'Supervisión y seguimiento en campo' },
	{ value: 'RESIDENT',   label: 'Residente',      description: 'Ejecución directa en campo' },
	{ value: 'VIEWER',     label: 'Espectador',     description: 'Solo lectura, sin acciones' },
]

@Component({
	selector: 'app-activities-page',
	standalone: true,
	imports: [Badge, Card, EmptyState, Icon, Modal, ProgressBar, RouterLink, StatCard, DatePipe, ActivityDetailView, ReactiveFormsModule],
	templateUrl: './activities-page.html',
})
export class ActivitiesPage {
	private readonly route = inject(ActivatedRoute)

	// ── Live data (reactive) ─────────────────────────────────────
	readonly activities = signal([...MOCK_ACTIVITIES])

	// ── Filters ───────────────────────────────────────────────────
	readonly searchQuery = signal('')
	readonly statusFilter = signal<ActivityStatusFilter>('ALL')
	readonly expandedIds = signal<Set<string>>(new Set(['arq', 'est', 'ins']))

	// ── Detail modal ──────────────────────────────────────────────
	readonly selectedActivity = signal<MockActivity | null>(null)
	readonly modalOpen = computed(() => this.selectedActivity() !== null)

	// ── Create modal ──────────────────────────────────────────────
	readonly createOpen = signal(false)
	readonly createSaving = signal(false)
	readonly createSavedOk = signal(false)

	readonly categoryOptions = CATEGORY_OPTIONS
	readonly roleOptions = ROLE_OPTIONS

	readonly createForm = new FormGroup({
		name:           new FormControl('', Validators.required),
		parentId:       new FormControl<string>(''),
		category:       new FormControl('Diseño', Validators.required),
		assignedRole:   new FormControl('SUPERVISOR', Validators.required),
		startDate:      new FormControl('', Validators.required),
		endDate:        new FormControl('', Validators.required),
		progressType:   new FormControl<ActivityProgressType>('PERCENTAGE', Validators.required),
		isCriticalPath: new FormControl(false),
		description:    new FormControl(''),
	})

	// ── Route ─────────────────────────────────────────────────────
	readonly projectId = computed(() => {
		return this.route.snapshot.parent?.params?.['id'] ?? ''
	})

	// ── Derived tree ──────────────────────────────────────────────
	private readonly activityTree = computed(() => buildActivityTree(this.activities()))

	// ── Stats ─────────────────────────────────────────────────────
	readonly stats = computed(() => {
		const all = this.activities()
		return {
			total:        all.length,
			completed:    all.filter(a => a.status === 'COMPLETED').length,
			inProgress:   all.filter(a => a.status === 'IN_PROGRESS').length,
			blocked:      all.filter(a => a.status === 'BLOCKED').length,
			pending:      all.filter(a => a.status === 'PENDING').length,
			criticalPath: all.filter(a => a.isCriticalPath).length,
		}
	})

	// ── Flat list for parent selector ─────────────────────────────
	readonly parentOptions = computed(() =>
		this.activities()
			.filter(a => !a.parentId)   // only top-level as potential parents
			.map(a => ({ id: a.id, label: `[${a.code}] ${a.name}` })),
	)

	// ── Visible rows ──────────────────────────────────────────────
	readonly visibleRows = computed<FlatRow[]>(() => {
		const q       = this.searchQuery().toLowerCase().trim()
		const statusF = this.statusFilter()
		const expanded = this.expandedIds()

		const rows: FlatRow[] = []

		const addRows = (activities: (MockActivity & { children: MockActivity[] })[], depth: number) => {
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

		addRows(this.activityTree() as (MockActivity & { children: MockActivity[] })[], 0)
		return rows
	})

	// ── Handlers ─────────────────────────────────────────────────
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

	// ── Create activity ───────────────────────────────────────────
	openCreateActivity(): void {
		this.createForm.reset({
			name: '', parentId: '', category: 'Diseño', assignedRole: 'SUPERVISOR',
			startDate: '', endDate: '', progressType: 'PERCENTAGE', isCriticalPath: false, description: '',
		})
		this.createOpen.set(true)
	}

	closeCreateActivity(): void {
		this.createOpen.set(false)
	}

	onCreateSubmit(): void {
		this.createForm.markAllAsTouched()
		if (this.createForm.invalid) return

		const v = this.createForm.value
		this.createSaving.set(true)

		setTimeout(() => {
			const catOption = this.categoryOptions.find(c => c.label === v.category) ?? this.categoryOptions[0]
			const start = new Date(v.startDate!)
			const end   = new Date(v.endDate!)
			const durationDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

			const parentId  = v.parentId || undefined
			const all       = this.activities()
			const siblings  = all.filter(a => a.parentId === parentId)
			const parentAct = parentId ? all.find(a => a.id === parentId) : null
			const baseCode  = parentAct ? parentAct.code : 'NEW'
			const code      = parentAct
				? `${baseCode}-${String(siblings.length + 1).padStart(2, '0')}`
				: `NEW-${String(all.filter(a => !a.parentId).length + 1).padStart(2, '0')}`

			const newActivity: MockActivity = {
				id:                `act-${Date.now()}`,
				parentId,
				code,
				name:              v.name!,
				description:       v.description || undefined,
				category:          catOption.label,
				categoryColor:     catOption.color,
				assignedRole:      v.assignedRole!,
				startDate:         start,
				endDate:           end,
				durationDays,
				progressType:      v.progressType as ActivityProgressType,
				progress:          0,
				status:            'PENDING',
				isCriticalPath:    !!v.isCriticalPath,
			}

			this.activities.update(list => [...list, newActivity])

			// Auto-expand parent if applicable
			if (parentId) {
				this.expandedIds.update(set => new Set([...set, parentId]))
			}

			this.createSaving.set(false)
			this.createSavedOk.set(true)
			setTimeout(() => {
				this.createSavedOk.set(false)
				this.closeCreateActivity()
			}, 700)
		}, 800)
	}

	// ── Helpers ───────────────────────────────────────────────────
	isExpanded(id: string): boolean {
		return this.expandedIds().has(id)
	}

	statusBadgeVariant(status: ActivityStatus): BadgeVariant {
		const map: Record<ActivityStatus, BadgeVariant> = {
			COMPLETED:   'completed',
			IN_PROGRESS: 'in-progress',
			PENDING:     'planning',
			BLOCKED:     'delayed',
			CANCELLED:   'custom',
			DELAYED:     'delayed',
		}
		return map[status]
	}

	statusLabel(status: ActivityStatus): string {
		const map: Record<ActivityStatus, string> = {
			COMPLETED:   'Completado',
			IN_PROGRESS: 'En progreso',
			PENDING:     'Pendiente',
			BLOCKED:     'Bloqueado',
			CANCELLED:   'Cancelado',
			DELAYED:     'Retrasado',
		}
		return map[status]
	}

	statusFilterPillClass(value: ActivityStatusFilter): string {
		const base = 'px-3 py-1.5 rounded-input text-small font-medium transition-colors cursor-pointer border'
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
