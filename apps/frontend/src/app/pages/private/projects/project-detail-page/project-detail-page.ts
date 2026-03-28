import { Component, computed } from '@angular/core'
import { inject } from '@angular/core'
import { DecimalPipe } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router'

import { Badge, BadgeVariant, Icon, Stepper, StepItem } from '@org/ui'
import { ProjectStageStatus, ProjectStatus } from '@org/util'

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

interface MockStage {
	id: string
	order: number
	name: string
	status: ProjectStageStatus
	plannedStartDate: Date
	plannedEndDate: Date
}

interface NavTab {
	label: string
	route: string
	icon: string
}

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

const MOCK_STAGES: MockStage[] = [
	{
		id: 's1',
		order: 1,
		name: 'Cimientos',
		status: 'COMPLETED',
		plannedStartDate: new Date('2024-03-15'),
		plannedEndDate: new Date('2024-06-30'),
	},
	{
		id: 's2',
		order: 2,
		name: 'Estructura',
		status: 'IN_PROGRESS',
		plannedStartDate: new Date('2024-07-01'),
		plannedEndDate: new Date('2025-06-30'),
	},
	{
		id: 's3',
		order: 3,
		name: 'Instalaciones',
		status: 'PENDING',
		plannedStartDate: new Date('2025-07-01'),
		plannedEndDate: new Date('2025-12-31'),
	},
	{
		id: 's4',
		order: 4,
		name: 'Muros y divisiones',
		status: 'PENDING',
		plannedStartDate: new Date('2026-01-01'),
		plannedEndDate: new Date('2026-04-30'),
	},
	{
		id: 's5',
		order: 5,
		name: 'Acabados',
		status: 'PENDING',
		plannedStartDate: new Date('2026-05-01'),
		plannedEndDate: new Date('2026-07-31'),
	},
	{
		id: 's6',
		order: 6,
		name: 'Entrega',
		status: 'PENDING',
		plannedStartDate: new Date('2026-08-01'),
		plannedEndDate: new Date('2026-08-15'),
	},
]

@Component({
	selector: 'app-project-detail-page',
	imports: [RouterLink, RouterLinkActive, RouterOutlet, Badge, Icon, Stepper, DecimalPipe],
	templateUrl: './project-detail-page.html',
})
export class ProjectDetailPage {
	private readonly route = inject(ActivatedRoute)

	readonly projectId = computed(() => this.route.snapshot.params['id'] ?? '')
	readonly project = MOCK_PROJECT

	readonly stageSteps = computed<StepItem[]>(() =>
		MOCK_STAGES.map(s => ({
			key: s.id,
			label: s.name,
			description: this.stageStatusLabel(s.status),
			status: this.stageToStepStatus(s.status),
		})),
	)

	readonly tabs: NavTab[] = [
		{ label: 'Resumen', route: 'overview', icon: 'house' },
		{ label: 'Actividades', route: 'activities', icon: 'chart-area' },
		{ label: 'Bitácoras', route: 'daily-logs', icon: 'calendar-days' },
		{ label: 'Recursos', route: 'resources', icon: 'file' },
		{ label: 'Equipo', route: 'members', icon: 'users' },
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

	get statusBadgeColor(): string {
		if (this.project.status === 'HALTED') return '#D97706'
		if (this.project.status === 'ARCHIVED') return '#718096'
		return ''
	}

	get statusLabel(): string {
		const map: Record<ProjectStatus, string> = {
			PLANNING: 'Planificación',
			IN_PROGRESS: 'En progreso',
			DELAYED: 'Retrasado',
			HALTED: 'Detenido',
			COMPLETED: 'Completado',
			ARCHIVED: 'Archivado',
		}
		return map[this.project.status]
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
		return new Intl.DateTimeFormat('es-MX', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}).format(date)
	}
}
