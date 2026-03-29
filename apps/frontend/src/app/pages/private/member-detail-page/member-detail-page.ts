import { DatePipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Card, EmptyState, Icon, StatCard } from '@org/ui'
import { ActivityStatus, ProjectMemberRole, UserTenantRole } from '@org/util'

import { MOCK_TENANT_USERS, MockTenantUser, UserStatus } from '../members-page/mock-tenant-members'
import { MOCK_MEMBER_DETAILS, MemberActivityItem, MemberDetailData } from './mock-member-detail'

@Component({
	selector: 'app-member-detail-page',
	standalone: true,
	imports: [DatePipe, RouterLink, Badge, Card, EmptyState, Icon, StatCard],
	templateUrl: './member-detail-page.html',
})
export class MemberDetailPage {
	private readonly route = inject(ActivatedRoute)
	private readonly router = inject(Router)

	readonly user = computed<MockTenantUser | null>(() => {
		const id = this.route.snapshot.paramMap.get('id')
		return MOCK_TENANT_USERS.find(u => u.id === id) ?? null
	})

	readonly detail = computed<MemberDetailData | null>(() => {
		const u = this.user()
		if (!u) return null
		return MOCK_MEMBER_DETAILS.find(d => d.userId === u.id) ?? null
	})

	readonly stats = computed(() => {
		const d = this.detail()
		if (!d) return { projects: 0, active: 0, completed: 0, logs: 0 }
		return {
			projects: d.projects.length,
			active: d.activeActivities.length,
			completed: d.completedActivities.length,
			logs: d.recentLogs.length,
		}
	})

	goBack(): void {
		this.router.navigate(['/system/members'])
	}

	// ── Label helpers ─────────────────────────────────────────────
	get initials(): string {
		const u = this.user()
		if (!u) return '?'
		return (u.profile.firstName[0] + u.profile.lastName[0]).toUpperCase()
	}

	get fullName(): string {
		const u = this.user()
		if (!u) return ''
		return `${u.profile.firstName} ${u.profile.lastName}`
	}

	tenantRoleLabel(role: UserTenantRole): string {
		return role === 'TENANT_ADMIN' ? 'Administrador' : 'Miembro'
	}

	tenantRoleBadgeVariant(role: UserTenantRole): BadgeVariant {
		return role === 'TENANT_ADMIN' ? 'delayed' : 'custom'
	}

	statusLabel(status: UserStatus): string {
		const map: Record<UserStatus, string> = {
			ACTIVE: 'Activo',
			INACTIVE: 'Inactivo',
			PENDING_INVITE: 'Invitación pendiente',
		}
		return map[status]
	}

	statusBadgeVariant(status: UserStatus): BadgeVariant {
		const map: Record<UserStatus, BadgeVariant> = {
			ACTIVE: 'completed',
			INACTIVE: 'delayed',
			PENDING_INVITE: 'planning',
		}
		return map[status]
	}

	activityStatusLabel(status: ActivityStatus): string {
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

	activityStatusBadgeVariant(status: ActivityStatus): BadgeVariant {
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

	projectStatusLabel(status: string): string {
		const map: Record<string, string> = {
			ACTIVE: 'Activo',
			COMPLETED: 'Completado',
			ON_HOLD: 'En pausa',
		}
		return map[status] ?? status
	}

	projectStatusBadgeVariant(status: string): BadgeVariant {
		const map: Record<string, BadgeVariant> = {
			ACTIVE: 'in-progress',
			COMPLETED: 'completed',
			ON_HOLD: 'delayed',
		}
		return (map[status] as BadgeVariant) ?? 'custom'
	}

	roleLabel(role: ProjectMemberRole): string {
		const map: Record<ProjectMemberRole, string> = {
			ADMIN: 'Admin',
			SUPERVISOR: 'Supervisor',
			RESIDENT: 'Residente',
			VIEWER: 'Espectador',
		}
		return map[role]
	}

	roleBadgeVariant(role: ProjectMemberRole): BadgeVariant {
		const map: Record<ProjectMemberRole, BadgeVariant> = {
			ADMIN: 'delayed',
			SUPERVISOR: 'in-progress',
			RESIDENT: 'planning',
			VIEWER: 'custom',
		}
		return map[role]
	}

	activityProgressColor(a: MemberActivityItem): string {
		if (a.status === 'COMPLETED') return 'var(--color-success)'
		if (a.status === 'BLOCKED') return 'var(--color-danger)'
		if (a.status === 'DELAYED') return 'var(--color-accent)'
		return 'var(--color-primary)'
	}
}
