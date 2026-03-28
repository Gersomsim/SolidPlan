import { Component, computed, inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Icon } from '@org/ui'
import { ActivityStatus } from '@org/util'

import { ActivityDetailView } from '../activities-page/components/activity-detail-view/activity-detail-view'
import { getActivityById } from '../activities-page/mock-activities'

@Component({
	selector: 'app-activity-detail-page',
	standalone: true,
	imports: [Badge, Icon, RouterLink, ActivityDetailView],
	templateUrl: './activity-detail-page.html',
})
export class ActivityDetailPage {
	private readonly route = inject(ActivatedRoute)

	readonly activityId = computed(() => this.route.snapshot.params['activityId'])
	readonly projectId  = computed(() => this.route.snapshot.parent?.parent?.params?.['id'] ?? '')

	readonly activity   = computed(() => getActivityById(this.activityId()))

	readonly statusBadgeVariant = computed<BadgeVariant>(() => {
		const status = this.activity()?.status
		if (!status) return 'planning'
		const map: Record<ActivityStatus, BadgeVariant> = {
			COMPLETED:   'completed',
			IN_PROGRESS: 'in-progress',
			PENDING:     'planning',
			BLOCKED:     'delayed',
		}
		return map[status]
	})

	readonly statusLabel = computed(() => {
		const map: Record<ActivityStatus, string> = {
			COMPLETED:   'Completado',
			IN_PROGRESS: 'En progreso',
			PENDING:     'Pendiente',
			BLOCKED:     'Bloqueado',
		}
		return map[this.activity()?.status ?? 'PENDING']
	})
}
