import { Component, computed, signal } from '@angular/core'

import { Badge, BadgeVariant, EmptyState, Icon, StatCard } from '@org/ui'
import { ProjectStatus } from '@org/util'

import {
	ProjectCard,
	ProjectListItem,
} from './components/project-card/project-card'

type StatusFilter = ProjectStatus | 'ALL'

interface StatusFilterOption {
	value: StatusFilter
	label: string
}

const MOCK_PROJECTS: ProjectListItem[] = [
	{
		id: '1',
		code: 'OBR-2024-001',
		name: 'Torre Residencial El Pinar',
		city: 'Monterrey, NL',
		status: 'IN_PROGRESS',
		currentStageName: 'Estructura',
		completedStages: 2,
		totalStages: 6,
		overallProgress: 45,
		budget: { amount: 45000000, currency: 'MXN' },
		estimatedEndDate: new Date('2026-08-15'),
		memberCount: 8,
		activityCount: 64,
		tags: ['residencial', 'torre'],
	},
	{
		id: '2',
		code: 'OBR-2024-002',
		name: 'Centro Comercial Plaza Vallarta',
		city: 'Guadalajara, JAL',
		status: 'DELAYED',
		currentStageName: 'Cimientos',
		completedStages: 1,
		totalStages: 5,
		overallProgress: 22,
		budget: { amount: 120000000, currency: 'MXN' },
		estimatedEndDate: new Date('2026-05-01'),
		memberCount: 12,
		activityCount: 89,
		tags: ['comercial', 'plaza'],
	},
	{
		id: '3',
		code: 'OBR-2024-003',
		name: 'Complejo Industrial Norte',
		city: 'Saltillo, COA',
		status: 'IN_PROGRESS',
		currentStageName: 'Acabados',
		completedStages: 4,
		totalStages: 5,
		overallProgress: 78,
		budget: { amount: 28000000, currency: 'MXN' },
		estimatedEndDate: new Date('2026-04-30'),
		memberCount: 6,
		activityCount: 42,
		tags: ['industrial', 'nave'],
	},
	{
		id: '4',
		code: 'OBR-2024-004',
		name: 'Conjunto Habitacional Villas del Parque',
		city: 'CDMX',
		status: 'PLANNING',
		currentStageName: 'Planificación',
		completedStages: 0,
		totalStages: 7,
		overallProgress: 5,
		budget: { amount: 85000000, currency: 'MXN' },
		estimatedEndDate: new Date('2027-03-01'),
		memberCount: 4,
		activityCount: 0,
		tags: ['residencial', 'conjunto'],
	},
	{
		id: '5',
		code: 'OBR-2023-011',
		name: 'Nave Industrial Parque Logístico',
		city: 'Apodaca, NL',
		status: 'COMPLETED',
		currentStageName: 'Entrega',
		completedStages: 5,
		totalStages: 5,
		overallProgress: 100,
		budget: { amount: 18500000, currency: 'MXN' },
		estimatedEndDate: new Date('2025-11-30'),
		memberCount: 5,
		activityCount: 38,
		tags: ['industrial', 'logística'],
	},
	{
		id: '6',
		code: 'OBR-2025-002',
		name: 'Hospital Regional San Lucas',
		city: 'Monterrey, NL',
		status: 'HALTED',
		currentStageName: 'Estructura',
		completedStages: 2,
		totalStages: 8,
		overallProgress: 28,
		budget: { amount: 210000000, currency: 'MXN' },
		estimatedEndDate: new Date('2027-06-01'),
		memberCount: 15,
		activityCount: 120,
		tags: ['salud', 'hospital'],
	},
]

@Component({
	selector: 'app-project-list-page',
	imports: [Badge, EmptyState, Icon, ProjectCard, StatCard],
	templateUrl: './project-list-page.html',
})
export class ProjectListPage {
	readonly searchQuery = signal('')
	readonly statusFilter = signal<StatusFilter>('ALL')
	readonly viewMode = signal<'grid' | 'list'>('grid')

	readonly statusFilters: StatusFilterOption[] = [
		{ value: 'ALL', label: 'Todos' },
		{ value: 'PLANNING', label: 'Planificación' },
		{ value: 'IN_PROGRESS', label: 'En progreso' },
		{ value: 'DELAYED', label: 'Retrasado' },
		{ value: 'HALTED', label: 'Detenido' },
		{ value: 'COMPLETED', label: 'Completado' },
	]

	readonly filteredProjects = computed(() => {
		let list = MOCK_PROJECTS
		if (this.statusFilter() !== 'ALL') {
			list = list.filter(p => p.status === this.statusFilter())
		}
		const q = this.searchQuery().toLowerCase().trim()
		if (q) {
			list = list.filter(
				p =>
					p.name.toLowerCase().includes(q) ||
					p.code.toLowerCase().includes(q) ||
					p.city.toLowerCase().includes(q),
			)
		}
		return list
	})

	readonly stats = computed(() => ({
		total: MOCK_PROJECTS.length,
		active: MOCK_PROJECTS.filter(p => p.status === 'IN_PROGRESS').length,
		delayed: MOCK_PROJECTS.filter(p => p.status === 'DELAYED').length,
		completed: MOCK_PROJECTS.filter(p => p.status === 'COMPLETED').length,
	}))

	onSearch(event: Event): void {
		this.searchQuery.set((event.target as HTMLInputElement).value)
	}

	setFilter(value: StatusFilter): void {
		this.statusFilter.set(value)
	}

	setViewMode(mode: 'grid' | 'list'): void {
		this.viewMode.set(mode)
	}

	statusBadgeVariant(status: ProjectStatus): BadgeVariant {
		const map: Record<ProjectStatus, BadgeVariant> = {
			PLANNING: 'planning',
			IN_PROGRESS: 'in-progress',
			DELAYED: 'delayed',
			HALTED: 'custom',
			COMPLETED: 'completed',
			ARCHIVED: 'custom',
		}
		return map[status]
	}

	statusBadgeColor(status: ProjectStatus): string {
		if (status === 'HALTED') return '#D97706'
		if (status === 'ARCHIVED') return '#718096'
		return ''
	}

	statusLabel(status: ProjectStatus): string {
		const map: Record<ProjectStatus, string> = {
			PLANNING: 'Planificación',
			IN_PROGRESS: 'En progreso',
			DELAYED: 'Retrasado',
			HALTED: 'Detenido',
			COMPLETED: 'Completado',
			ARCHIVED: 'Archivado',
		}
		return map[status]
	}

	formatBudget(amount: number, currency: string): string {
		if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M ${currency}`
		return `$${(amount / 1_000).toFixed(0)}K ${currency}`
	}

	formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-MX', { month: 'short', year: 'numeric' }).format(date)
	}

	filterPillClass(value: StatusFilter): string {
		const active = this.statusFilter() === value
		return active
			? 'px-3 py-1.5 rounded-input text-label font-medium bg-primary text-white transition-colors duration-150 shrink-0'
			: 'px-3 py-1.5 rounded-input text-label font-medium bg-secondary-bg dark:bg-white/10 text-text-secondary dark:text-dark-text/70 hover:bg-border dark:hover:bg-white/15 hover:text-text-primary dark:hover:text-dark-text transition-colors duration-150 shrink-0'
	}

	viewToggleClass(mode: 'grid' | 'list'): string {
		const active = this.viewMode() === mode
		return active
			? 'p-1.5 rounded-input bg-primary text-white transition-colors duration-150'
			: 'p-1.5 rounded-input text-text-secondary dark:text-dark-text/60 hover:text-text-primary dark:hover:text-dark-text hover:bg-secondary-bg dark:hover:bg-white/10 transition-colors duration-150'
	}
}
