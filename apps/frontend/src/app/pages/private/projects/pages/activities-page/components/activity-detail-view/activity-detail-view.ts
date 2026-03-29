import { DatePipe } from '@angular/common'
import { Component, ElementRef, computed, input, signal, viewChild } from '@angular/core'
import { RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Icon, ProgressBar } from '@org/ui'
import { ActivityStatus } from '@org/util'

import { getLogsByActivityId } from '../../../daily-logs-page/mock-daily-logs'
import { MockActivity, getChildActivities } from '../../mock-activities'
import { MockComment, getCommentsByActivityId } from '../../mock-comments'

export type DetailLayout = 'modal' | 'page'

@Component({
	selector: 'app-activity-detail-view',
	standalone: true,
	imports: [Badge, Icon, ProgressBar, DatePipe, RouterLink],
	templateUrl: './activity-detail-view.html',
})
export class ActivityDetailView {
	readonly activity = input.required<MockActivity>()
	readonly layout = input<DetailLayout>('modal')
	readonly projectId = input<string>('')

	readonly children = computed(() => getChildActivities(this.activity().id))
	readonly isPage = computed(() => this.layout() === 'page')
	readonly relatedLogs = computed(() => getLogsByActivityId(this.activity().id))

	// ── Comments ──────────────────────────────────────────────
	private readonly baseComments = computed(() => getCommentsByActivityId(this.activity().id))
	readonly newComments = signal<MockComment[]>([])
	readonly comments = computed(() => [...this.baseComments(), ...this.newComments()])

	readonly commentText = signal('')
	readonly commentSending = signal(false)

	onCommentKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
			this.submitComment()
		}
	}

	submitComment(): void {
		const text = this.commentText().trim()
		if (!text) return

		this.commentSending.set(true)

		setTimeout(() => {
			const comment: MockComment = {
				id: `c-new-${Date.now()}`,
				activityId: this.activity().id,
				author: { userId: 'u1', name: 'Carlos Mendoza', initials: 'CM', avatarBg: '#1E3A5F' },
				content: text,
				createdAt: new Date(),
			}
			this.newComments.update(list => [...list, comment])
			this.commentText.set('')
			this.commentSending.set(false)
		}, 400)
	}

	// ── Add sub-activity ─────────────────────────────────────
	readonly addingChild = signal(false)
	readonly newChildTitle = signal('')
	private readonly titleInput = viewChild<ElementRef<HTMLInputElement>>('titleInput')

	startAdding(): void {
		this.addingChild.set(true)
		this.newChildTitle.set('')
		setTimeout(() => this.titleInput()?.nativeElement.focus(), 0)
	}

	cancelAdding(): void {
		this.addingChild.set(false)
		this.newChildTitle.set('')
	}

	confirmAdding(): void {
		const title = this.newChildTitle().trim()
		if (!title) return
		console.log('Nueva sub-actividad:', title, 'parent:', this.activity().id)
		this.cancelAdding()
	}

	onTitleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') this.confirmAdding()
		if (event.key === 'Escape') this.cancelAdding()
	}

	readonly statusBadgeVariant = computed<BadgeVariant>(() => {
		const map: Record<ActivityStatus, BadgeVariant> = {
			COMPLETED: 'completed',
			IN_PROGRESS: 'in-progress',
			PENDING: 'planning',
			BLOCKED: 'delayed',
			CANCELLED: 'custom',
			DELAYED: 'delayed',
		}
		return map[this.activity().status]
	})

	readonly statusLabel = computed(() => {
		const map: Record<ActivityStatus, string> = {
			COMPLETED: 'Completado',
			IN_PROGRESS: 'En progreso',
			PENDING: 'Pendiente',
			BLOCKED: 'Bloqueado',
			CANCELLED: 'Cancelado',
			DELAYED: 'Retrasado',
		}
		return map[this.activity().status]
	})

	readonly progressPercent = computed(() => {
		if (this.activity().progressType === 'PERCENTAGE') return this.activity().progress
		return this.activity().status === 'COMPLETED' ? 100 : 0
	})

	childStatusVariant(status: ActivityStatus): BadgeVariant {
		const map: Record<ActivityStatus, BadgeVariant> = {
			COMPLETED: 'completed',
			IN_PROGRESS: 'in-progress',
			PENDING: 'planning',
			BLOCKED: 'delayed',
			CANCELLED: 'custom',
			DELAYED: 'delayed',
		}
		return map[status]
	}

	childStatusLabel(status: ActivityStatus): string {
		const map: Record<ActivityStatus, string> = {
			COMPLETED: 'Completado',
			IN_PROGRESS: 'En progreso',
			PENDING: 'Pendiente',
			BLOCKED: 'Bloqueado',
			CANCELLED: 'Cancelado',
			DELAYED: 'Retrasado',
		}
		return map[status]
	}

	timeAgo(date: Date): string {
		const now = new Date()
		const diff = now.getTime() - date.getTime()
		const minutes = Math.floor(diff / 60000)
		const hours = Math.floor(diff / 3600000)
		const days = Math.floor(diff / 86400000)

		if (minutes < 2) return 'ahora'
		if (minutes < 60) return `hace ${minutes} min`
		if (hours < 24) return `hace ${hours}h`
		if (days < 7) return `hace ${days}d`
		return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
	}
}
