import { DatePipe } from '@angular/common'
import { Component, computed, input } from '@angular/core'
import { RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Icon, IconType, ProgressBar } from '@org/ui'

import { MOCK_ACTIVITIES } from '../../../activities-page/mock-activities'
import { MockDailyLog } from '../../mock-daily-logs'

@Component({
	selector: 'app-log-detail-view',
	standalone: true,
	imports: [DatePipe, Badge, Icon, ProgressBar, RouterLink],
	templateUrl: './log-detail-view.html',
})
export class LogDetailView {
	readonly log = input.required<MockDailyLog>()
	readonly projectId = input<string>('')

	readonly linkedActivities = computed(
		() =>
			this.log()
				.activityIds.map(id => MOCK_ACTIVITIES.find(a => a.id === id))
				.filter(Boolean) as typeof MOCK_ACTIVITIES,
	)

	weatherLabel(w: string): string {
		const map: Record<string, string> = {
			CLEAR: 'Despejado',
			OVERCAST: 'Nublado',
			RAIN: 'Lluvia',
			EXTREME: 'Clima extremo',
		}
		return map[w] ?? w
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

	activityStatusBadge(status: string): BadgeVariant {
		const map: Record<string, BadgeVariant> = {
			COMPLETED: 'completed',
			IN_PROGRESS: 'in-progress',
			PENDING: 'planning',
			BLOCKED: 'delayed',
		}
		return (map[status] as BadgeVariant) ?? 'custom'
	}

	activityStatusLabel(status: string): string {
		const map: Record<string, string> = {
			COMPLETED: 'Completado',
			IN_PROGRESS: 'En progreso',
			PENDING: 'Pendiente',
			BLOCKED: 'Bloqueado',
		}
		return map[status] ?? status
	}
}
