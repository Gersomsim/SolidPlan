import { DatePipe } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Card, EmptyState, Icon, Modal, ProgressBar, StatCard } from '@org/ui'
import { ActivityProgressType, ActivityStatus, ProjectStageStatus } from '@org/util'

import { MOCK_ACTIVITIES, MockActivity, buildActivityTree } from '../activities-page/mock-activities'
import { MOCK_PROJECT_STAGES, MockProjectStage } from '../stages-page/mock-stages'

interface FlatRow extends MockActivity {
	depth: number
	hasChildren: boolean
}

const CATEGORY_OPTIONS = [
	{ label: 'Diseño',        color: '#3B82F6' },
	{ label: 'Topografía',    color: '#8B5CF6' },
	{ label: 'Estructura',    color: '#F59E0B' },
	{ label: 'Albañilería',   color: '#92400E' },
	{ label: 'Instalaciones', color: '#10B981' },
	{ label: 'Acabados',      color: '#EC4899' },
	{ label: 'Obra Civil',    color: '#64748B' },
]

const ROLE_OPTIONS = [
	{ value: 'ADMIN',      label: 'Administrador', description: 'Gestión total de la actividad' },
	{ value: 'SUPERVISOR', label: 'Supervisor',     description: 'Supervisión y seguimiento en campo' },
	{ value: 'RESIDENT',   label: 'Residente',      description: 'Ejecución directa en campo' },
	{ value: 'VIEWER',     label: 'Espectador',     description: 'Solo lectura, sin acciones' },
]

@Component({
	selector: 'app-stage-detail-page',
	standalone: true,
	imports: [DatePipe, ReactiveFormsModule, RouterLink, Badge, Card, EmptyState, Icon, Modal, ProgressBar, StatCard],
	templateUrl: './stage-detail-page.html',
})
export class StageDetailPage {
	private readonly route = inject(ActivatedRoute)

	readonly projectId = this.route.snapshot.parent?.params?.['id'] ?? ''
	readonly stageId   = this.route.snapshot.params['stageId'] ?? ''

	readonly stage = computed<MockProjectStage | null>(
		() => MOCK_PROJECT_STAGES.find(s => s.id === this.stageId) ?? null,
	)

	// ── Live activity data ────────────────────────────────────────
	readonly activities = signal(
		MOCK_ACTIVITIES.filter(a => a.stageId === this.stageId),
	)

	// ── Search + expand ───────────────────────────────────────────
	readonly searchQuery  = signal('')
	readonly expandedIds  = signal<Set<string>>(new Set(
		MOCK_ACTIVITIES.filter(a => a.stageId === this.stageId && !a.parentId).map(a => a.id),
	))

	// ── Stats ─────────────────────────────────────────────────────
	readonly stats = computed(() => {
		const all   = this.activities()
		const today = Date.now()

		const completed  = all.filter(a => a.status === 'COMPLETED').length
		const inProgress = all.filter(a => a.status === 'IN_PROGRESS').length
		const pending    = all.filter(a => a.status === 'PENDING').length
		const blocked    = all.filter(a => a.status === 'BLOCKED').length

		// "on time" = IN_PROGRESS with endDate >= today
		const onTime   = all.filter(a => a.status === 'IN_PROGRESS' && a.endDate.getTime() >= today).length
		// "delayed"  = DELAYED status, or IN_PROGRESS past endDate, or PENDING past startDate
		const delayed  = all.filter(a =>
			a.status === 'DELAYED' ||
			(a.status === 'IN_PROGRESS' && a.endDate.getTime() < today) ||
			(a.status === 'PENDING'     && a.startDate.getTime() < today),
		).length

		const total    = all.length
		const avgPct   = total === 0 ? 0 : Math.round(all.reduce((s, a) => s + a.progress, 0) / total)

		return { total, completed, inProgress, pending, blocked, onTime, delayed, avgPct }
	})

	// ── Activity tree ─────────────────────────────────────────────
	private readonly activityTree = computed(() => buildActivityTree(this.activities()))

	readonly visibleRows = computed<FlatRow[]>(() => {
		const q       = this.searchQuery().toLowerCase().trim()
		const expanded = this.expandedIds()
		const rows: FlatRow[] = []

		const addRows = (acts: (MockActivity & { children: MockActivity[] })[], depth: number) => {
			for (const act of acts) {
				const hasChildren = act.children.length > 0
				const matches = !q || act.name.toLowerCase().includes(q) || act.code.toLowerCase().includes(q)
				if (matches) rows.push({ ...act, depth, hasChildren })
				if (hasChildren && expanded.has(act.id)) {
					addRows(act.children as (MockActivity & { children: MockActivity[] })[], depth + 1)
				}
			}
		}

		addRows(this.activityTree() as (MockActivity & { children: MockActivity[] })[], 0)
		return rows
	})

	// ── Create modal ──────────────────────────────────────────────
	readonly createOpen    = signal(false)
	readonly createSaving  = signal(false)
	readonly createSavedOk = signal(false)

	readonly categoryOptions = CATEGORY_OPTIONS
	readonly roleOptions     = ROLE_OPTIONS

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

	// Only root-level activities of this stage are valid parents
	readonly parentOptions = computed(() =>
		this.activities()
			.filter(a => !a.parentId)
			.map(a => ({ id: a.id, label: `[${a.code}] ${a.name}` })),
	)

	openCreate(): void {
		this.createForm.reset({
			name: '', parentId: '', category: 'Diseño', assignedRole: 'SUPERVISOR',
			startDate: '', endDate: '', progressType: 'PERCENTAGE', isCriticalPath: false, description: '',
		})
		this.createOpen.set(true)
	}

	closeCreate(): void {
		this.createOpen.set(false)
	}

	onCreateSubmit(): void {
		this.createForm.markAllAsTouched()
		if (this.createForm.invalid) return

		const v = this.createForm.value
		this.createSaving.set(true)

		setTimeout(() => {
			const catOption = this.categoryOptions.find(c => c.label === v.category) ?? this.categoryOptions[0]
			const start     = new Date(v.startDate!)
			const end       = new Date(v.endDate!)
			const dur       = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000))

			const parentId  = v.parentId || undefined
			const all       = this.activities()
			const siblings  = all.filter(a => a.parentId === parentId)
			const parentAct = parentId ? all.find(a => a.id === parentId) : null
			const baseCode  = parentAct ? parentAct.code : this.stage()?.info.name?.toUpperCase().slice(0, 3) ?? 'STG'
			const code      = parentAct
				? `${baseCode}-${String(siblings.length + 1).padStart(2, '0')}`
				: `${baseCode}-${String(all.filter(a => !a.parentId).length + 1).padStart(2, '0')}`

			const newActivity: MockActivity = {
				id:             `act-${Date.now()}`,
				parentId,
				stageId:        this.stageId,
				stageName:      this.stage()?.info.name,
				code,
				name:           v.name!,
				description:    v.description || undefined,
				category:       catOption.label,
				categoryColor:  catOption.color,
				assignedRole:   v.assignedRole!,
				startDate:      start,
				endDate:        end,
				durationDays:   dur,
				progressType:   v.progressType as ActivityProgressType,
				progress:       0,
				status:         'PENDING',
				isCriticalPath: !!v.isCriticalPath,
			}

			this.activities.update(list => [...list, newActivity])

			if (parentId) {
				this.expandedIds.update(set => new Set([...set, parentId]))
			}

			this.createSaving.set(false)
			this.createSavedOk.set(true)
			setTimeout(() => { this.createSavedOk.set(false); this.closeCreate() }, 700)
		}, 800)
	}

	// ── Helpers ───────────────────────────────────────────────────
	onSearch(e: Event): void {
		this.searchQuery.set((e.target as HTMLInputElement).value)
	}

	toggleExpand(id: string, e: Event): void {
		e.stopPropagation()
		this.expandedIds.update(set => {
			const next = new Set(set)
			next.has(id) ? next.delete(id) : next.add(id)
			return next
		})
	}

	isExpanded(id: string): boolean {
		return this.expandedIds().has(id)
	}

	statusBadgeVariant(status: ActivityStatus): BadgeVariant {
		const map: Record<ActivityStatus, BadgeVariant> = {
			COMPLETED: 'completed', IN_PROGRESS: 'in-progress', PENDING: 'planning',
			BLOCKED: 'delayed', CANCELLED: 'custom', DELAYED: 'delayed',
		}
		return map[status]
	}

	statusLabel(status: ActivityStatus): string {
		const map: Record<ActivityStatus, string> = {
			COMPLETED: 'Completada', IN_PROGRESS: 'En progreso', PENDING: 'Pendiente',
			BLOCKED: 'Bloqueada', CANCELLED: 'Cancelada', DELAYED: 'Retrasada',
		}
		return map[status]
	}

	stageBadgeVariant(status: ProjectStageStatus): BadgeVariant {
		const map: Record<ProjectStageStatus, BadgeVariant> = {
			PENDING: 'planning', IN_PROGRESS: 'in-progress', COMPLETED: 'completed', SKIPPED: 'custom',
		}
		return map[status]
	}

	stageStatusLabel(status: ProjectStageStatus): string {
		return { PENDING: 'Pendiente', IN_PROGRESS: 'En curso', COMPLETED: 'Completada', SKIPPED: 'Omitida' }[status]
	}

	rowDepthPadding(depth: number): string {
		return ['pl-3', 'pl-8', 'pl-14', 'pl-20'][Math.min(depth, 3)]
	}

	expandIconClass(expanded: boolean): string {
		return `transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`
	}

	formatDate(d: Date): string {
		return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
	}
}
