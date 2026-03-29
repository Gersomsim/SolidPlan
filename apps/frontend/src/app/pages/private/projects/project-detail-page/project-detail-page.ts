import { DecimalPipe } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

import { Badge, BadgeVariant, Icon, Modal, StepItem, Stepper } from '@org/ui'
import { ActivityStatus, ProjectStageStatus, ProjectStatus } from '@org/util'

import { MOCK_ACTIVITIES, MockActivity } from '../pages/activities-page/mock-activities'
import { MOCK_PROJECT_STAGES } from '../pages/stages-page/mock-stages'

interface ProjectDetail {
	id: string
	code: string
	name: string
	description: string
	city: string
	status: ProjectStatus
	budget: { amount: number; currency: string }
	estimatedStartDate: Date
	estimatedEndDate: Date
	actualStartDate: Date
	totalAreaM2: number
	memberCount: number
	activityCount: number
	overallProgress: number
}


interface NavTab {
	label: string
	route: string
	icon: string
}

interface GanttRow {
	id: string
	code: string
	name: string
	depth: number
	isGroup: boolean
	status: ActivityStatus
	isCriticalPath: boolean
	progress: number
	leftPx: number
	widthPx: number
}

interface GanttMonth {
	label: string
	widthPx: number
	leftPx: number
}

interface GanttData {
	totalWidth: number
	months: GanttMonth[]
	rows: GanttRow[]
	todayPx: number
}

const PX_PER_DAY = 6
const MIN_BAR_PX = 16

const MOCK_PROJECT: ProjectDetail = {
	id: '1',
	code: 'OBR-2024-001',
	name: 'Torre Residencial El Pinar',
	description:
		'Edificio residencial de 15 niveles con 120 departamentos en zona norte de Monterrey. Incluye amenidades como alberca, gimnasio y áreas comunes en planta baja.',
	city: 'Monterrey, NL, México',
	status: 'IN_PROGRESS',
	budget: { amount: 45000000, currency: 'MXN' },
	estimatedStartDate: new Date('2024-03-15'),
	estimatedEndDate: new Date('2026-08-15'),
	actualStartDate: new Date('2024-03-15'),
	totalAreaM2: 4200,
	memberCount: 8,
	activityCount: 64,
	overallProgress: 45,
}


@Component({
	selector: 'app-project-detail-page',
	imports: [RouterLink, RouterLinkActive, RouterOutlet, Badge, Icon, Modal, Stepper, DecimalPipe],
	templateUrl: './project-detail-page.html',
})
export class ProjectDetailPage {
	private readonly route = inject(ActivatedRoute)

	readonly projectId = computed(() => this.route.snapshot.params['id'] ?? '')
	readonly project = MOCK_PROJECT

	// ── Gantt ─────────────────────────────────────────────────────
	readonly ganttOpen = signal(false)

	readonly ganttData = computed<GanttData>(() => {
		const activities = MOCK_ACTIVITIES

		// Date range
		const minTime = Math.min(...activities.map(a => a.startDate.getTime()))
		const maxTime = Math.max(...activities.map(a => a.endDate.getTime()))

		const firstDate = new Date(minTime)
		const ganttStart = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1)

		const lastDate = new Date(maxTime)
		const ganttEnd = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0)

		const totalDays = Math.ceil((ganttEnd.getTime() - ganttStart.getTime()) / 86400000) + 1
		const totalWidth = totalDays * PX_PER_DAY

		// Generate months
		const months: GanttMonth[] = []
		const cur = new Date(ganttStart)
		let accLeft = 0
		while (cur <= ganttEnd) {
			const monthStart = new Date(cur.getFullYear(), cur.getMonth(), 1)
			const monthEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0)
			const effectiveEnd = monthEnd < ganttEnd ? monthEnd : ganttEnd
			const days = Math.ceil((effectiveEnd.getTime() - monthStart.getTime()) / 86400000) + 1
			const widthPx = days * PX_PER_DAY
			months.push({
				label: new Intl.DateTimeFormat('es-MX', { month: 'short', year: '2-digit' }).format(monthStart),
				widthPx,
				leftPx: accLeft,
			})
			accLeft += widthPx
			cur.setMonth(cur.getMonth() + 1)
			cur.setDate(1)
		}

		// Build tree order
		const childMap = new Map<string, MockActivity[]>()
		const roots: MockActivity[] = []
		for (const a of activities) {
			if (!a.parentId) {
				roots.push(a)
			} else {
				const arr = childMap.get(a.parentId) ?? []
				arr.push(a)
				childMap.set(a.parentId, arr)
			}
		}

		const rows: GanttRow[] = []
		const addRow = (activity: MockActivity, depth: number) => {
			const children = childMap.get(activity.id) ?? []
			const dayOffset = Math.floor((activity.startDate.getTime() - ganttStart.getTime()) / 86400000)
			rows.push({
				id: activity.id,
				code: activity.code,
				name: activity.name,
				depth,
				isGroup: children.length > 0,
				status: activity.status,
				isCriticalPath: activity.isCriticalPath,
				progress: activity.progress,
				leftPx: Math.max(0, dayOffset * PX_PER_DAY),
				widthPx: Math.max(MIN_BAR_PX, activity.durationDays * PX_PER_DAY),
			})
			for (const child of children) addRow(child, depth + 1)
		}

		for (const root of roots) addRow(root, 0)

		// Today line
		const todayOffset = Math.floor((Date.now() - ganttStart.getTime()) / 86400000)
		const todayPx = todayOffset >= 0 && todayOffset <= totalDays ? todayOffset * PX_PER_DAY : -1

		return { totalWidth, months, rows, todayPx }
	})

	barColor(status: ActivityStatus, isCriticalPath: boolean): string {
		if (isCriticalPath && status === 'IN_PROGRESS') return 'var(--color-danger)'
		const map: Partial<Record<ActivityStatus, string>> = {
			COMPLETED: 'var(--color-success)',
			IN_PROGRESS: 'var(--color-primary)',
			DELAYED: 'var(--color-danger)',
			BLOCKED: 'var(--color-accent)',
			CANCELLED: 'var(--color-text-secondary)',
			PENDING: 'var(--color-border)',
		}
		return map[status] ?? 'var(--color-primary)'
	}

	statusLabel(status: ActivityStatus): string {
		const map: Partial<Record<ActivityStatus, string>> = {
			COMPLETED: 'Completada',
			IN_PROGRESS: 'En progreso',
			DELAYED: 'Retrasada',
			PENDING: 'Pendiente',
			BLOCKED: 'Bloqueada',
			CANCELLED: 'Cancelada',
		}
		return map[status] ?? status
	}

	// ── Stage stepper ─────────────────────────────────────────────
	readonly stageSteps = computed<StepItem[]>(() =>
		[...MOCK_PROJECT_STAGES]
			.sort((a, b) => a.order - b.order)
			.map(s => ({
				key: s.id,
				label: s.info.name,
				description: this.stageStatusLabel(s.status),
				status: this.stageToStepStatus(s.status),
			})),
	)

	readonly tabs: NavTab[] = [
		{ label: 'Resumen',     route: 'overview',   icon: 'house' },
		{ label: 'Etapas',      route: 'stages',     icon: 'landmark' },
		{ label: 'Actividades', route: 'activities', icon: 'chart-area' },
		{ label: 'Bitácoras',   route: 'daily-logs', icon: 'calendar-days' },
		{ label: 'Recursos',    route: 'resources',  icon: 'file' },
		{ label: 'Equipo',      route: 'members',    icon: 'users' },
	]

	private stageToStepStatus(status: ProjectStageStatus): StepItem['status'] {
		const map: Record<ProjectStageStatus, StepItem['status']> = {
			COMPLETED: 'completed',
			IN_PROGRESS: 'active',
			PENDING: 'pending',
			SKIPPED: 'error',
		}
		return map[status]
	}

	private stageStatusLabel(status: ProjectStageStatus): string {
		const map: Record<ProjectStageStatus, string> = {
			COMPLETED: 'Completada',
			IN_PROGRESS: 'En curso',
			PENDING: 'Pendiente',
			SKIPPED: 'Omitida',
		}
		return map[status]
	}

	get statusBadgeVariant(): BadgeVariant {
		const map: Record<ProjectStatus, BadgeVariant> = {
			PLANNING: 'planning',
			IN_PROGRESS: 'in-progress',
			DELAYED: 'delayed',
			HALTED: 'custom',
			COMPLETED: 'completed',
			ARCHIVED: 'custom',
		}
		return map[this.project.status]
	}
	get StatusLabel(): string {
		const map: Record<ProjectStatus, string> = {
			PLANNING: 'Planeación',
			IN_PROGRESS: 'En progreso',
			DELAYED: 'Retrasado',
			HALTED: 'Detenido',
			COMPLETED: 'Completado',
			ARCHIVED: 'Archivado',
		}
		return map[this.project.status]
	}

	get statusBadgeColor(): string {
		if (this.project.status === 'HALTED') return '#D97706'
		if (this.project.status === 'ARCHIVED') return '#718096'
		return ''
	}

	tabClass(isActive: boolean): string {
		const base =
			'flex items-center gap-2 px-4 py-3.5 text-small border-b-2 -mb-px transition-colors duration-150 whitespace-nowrap font-medium no-underline cursor-pointer'
		return isActive
			? `${base} border-primary text-primary dark:text-primary-light dark:border-primary-light`
			: `${base} border-transparent text-text-secondary dark:text-dark-text/60 hover:text-text-primary dark:hover:text-dark-text`
	}

	formatBudget(): string {
		const { amount, currency } = this.project.budget
		return `$${(amount / 1_000_000).toFixed(1)}M ${currency}`
	}

	formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
	}
}
