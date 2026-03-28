import { Component, computed, ElementRef, input, signal, viewChild } from '@angular/core'
import { DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Icon, ProgressBar } from '@org/ui'
import { ActivityStatus } from '@org/util'

import { getChildActivities, MockActivity } from '../../mock-activities'
import { getLogsByActivityId } from '../../../daily-logs-page/mock-daily-logs'

export type DetailLayout = 'modal' | 'page'

@Component({
	selector: 'app-activity-detail-view',
	standalone: true,
	imports: [Badge, Icon, ProgressBar, DatePipe, RouterLink],
	templateUrl: './activity-detail-view.html',
})
export class ActivityDetailView {
	readonly activity = input.required<MockActivity>()
	readonly layout   = input<DetailLayout>('modal')
	readonly projectId = input<string>('')

	readonly children    = computed(() => getChildActivities(this.activity().id))
	readonly isPage      = computed(() => this.layout() === 'page')
	readonly relatedLogs = computed(() => getLogsByActivityId(this.activity().id))

	// ── Add sub-activity ─────────────────────────────────────
	readonly addingChild  = signal(false)
	readonly newChildTitle = signal('')
	private readonly titleInput = viewChild<ElementRef<HTMLInputElement>>('titleInput')

	startAdding(): void {
		this.addingChild.set(true)
		this.newChildTitle.set('')
		// Focus after render
		setTimeout(() => this.titleInput()?.nativeElement.focus(), 0)
	}

	cancelAdding(): void {
		this.addingChild.set(false)
		this.newChildTitle.set('')
	}

	confirmAdding(): void {
		const title = this.newChildTitle().trim()
		if (!title) return
		// TODO: dispatch to store/service — for now just reset
		console.log('Nueva sub-actividad:', title, 'parent:', this.activity().id)
		this.cancelAdding()
	}

	onTitleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') this.confirmAdding()
		if (event.key === 'Escape') this.cancelAdding()
	}

	readonly statusBadgeVariant = computed<BadgeVariant>(() => {
		const map: Record<ActivityStatus, BadgeVariant> = {
			COMPLETED:   'completed',
			IN_PROGRESS: 'in-progress',
			PENDING:     'planning',
			BLOCKED:     'delayed',
		}
		return map[this.activity().status]
	})

	readonly statusLabel = computed(() => {
		const map: Record<ActivityStatus, string> = {
			COMPLETED:   'Completado',
			IN_PROGRESS: 'En progreso',
			PENDING:     'Pendiente',
			BLOCKED:     'Bloqueado',
		}
		return map[this.activity().status]
	})

	readonly progressPercent = computed(() => {
		if (this.activity().progressType === 'PERCENTAGE') return this.activity().progress
		return this.activity().status === 'COMPLETED' ? 100 : 0
	})

	childStatusVariant(status: ActivityStatus): BadgeVariant {
		const map: Record<ActivityStatus, BadgeVariant> = {
			COMPLETED:   'completed',
			IN_PROGRESS: 'in-progress',
			PENDING:     'planning',
			BLOCKED:     'delayed',
		}
		return map[status]
	}

	childStatusLabel(status: ActivityStatus): string {
		const map: Record<ActivityStatus, string> = {
			COMPLETED:   'Completado',
			IN_PROGRESS: 'En progreso',
			PENDING:     'Pendiente',
			BLOCKED:     'Bloqueado',
		}
		return map[status]
	}
}
