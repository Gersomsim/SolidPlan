import { Component, computed, input } from '@angular/core'
import { RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Icon, ProgressBar } from '@org/ui'
import { Budget, ProjectStatus } from '@org/util'

export interface ProjectListItem {
	id: string
	code: string
	name: string
	city: string
	status: ProjectStatus
	currentStageName: string
	completedStages: number
	totalStages: number
	overallProgress: number
	budget: Budget
	estimatedEndDate: Date
	memberCount: number
	activityCount: number
	tags: string[]
}

@Component({
	selector: 'app-project-card',
	imports: [RouterLink, Badge, Icon, ProgressBar],
	templateUrl: './project-card.html',
})
export class ProjectCard {
	readonly project = input.required<ProjectListItem>()

	readonly statusTopColor = computed(() => {
		const map: Record<ProjectStatus, string> = {
			IN_PROGRESS: '#1E3A5F',
			DELAYED: '#C53030',
			PLANNING: '#718096',
			HALTED: '#F59E0B',
			COMPLETED: '#2F855A',
			ARCHIVED: '#CBD5E0',
		}
		return map[this.project().status]
	})

	readonly statusBadgeVariant = computed<BadgeVariant>(() => {
		const map: Record<ProjectStatus, BadgeVariant> = {
			PLANNING: 'planning',
			IN_PROGRESS: 'in-progress',
			DELAYED: 'delayed',
			HALTED: 'custom',
			COMPLETED: 'completed',
			ARCHIVED: 'custom',
		}
		return map[this.project().status]
	})

	readonly statusBadgeColor = computed(() => {
		const s = this.project().status
		if (s === 'HALTED') return '#D97706'
		if (s === 'ARCHIVED') return '#718096'
		return ''
	})

	readonly statusLabel = computed(() => {
		const map: Record<ProjectStatus, string> = {
			PLANNING: 'Planificación',
			IN_PROGRESS: 'En progreso',
			DELAYED: 'Retrasado',
			HALTED: 'Detenido',
			COMPLETED: 'Completado',
			ARCHIVED: 'Archivado',
		}
		return map[this.project().status]
	})

	readonly stageDisplay = computed(() => {
		const p = this.project()
		const current =
			p.status === 'COMPLETED' ? p.totalStages : Math.min(p.completedStages + 1, p.totalStages)
		return `${current}/${p.totalStages}`
	})

	readonly formattedBudget = computed(() => {
		const { amount, currency } = this.project().budget
		if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M ${currency}`
		return `$${(amount / 1_000).toFixed(0)}K ${currency}`
	})

	readonly formattedEndDate = computed(() =>
		new Intl.DateTimeFormat('es-MX', { month: 'short', year: 'numeric' }).format(
			this.project().estimatedEndDate,
		),
	)
}
