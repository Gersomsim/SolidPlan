import { DatePipe } from '@angular/common'
import { Component, computed, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Card, EmptyState, Icon, IconType, Modal, StatCard } from '@org/ui'
import { UserTenantRole } from '@org/util'

import { MOCK_TENANT_USERS, MockTenantUser, UserStatus } from './mock-tenant-members'

export type RoleFilter = UserTenantRole | 'ALL'
export type StatusFilter = UserStatus | 'ALL'

const ROLE_OPTIONS: { label: string; value: UserTenantRole }[] = [
	{ label: 'Administrador del tenant', value: 'TENANT_ADMIN' },
	{ label: 'Miembro',                  value: 'MEMBER' },
]

@Component({
	selector: 'app-members-page',
	standalone: true,
	imports: [DatePipe, ReactiveFormsModule, RouterLink, Badge, Card, EmptyState, Icon, Modal, StatCard],
	templateUrl: './members-page.html',
})
export class MembersPage {

	// ── Live data ─────────────────────────────────────────────────
	readonly users = signal([...MOCK_TENANT_USERS])

	// ── Filters ───────────────────────────────────────────────────
	readonly searchQuery = signal('')
	readonly roleFilter = signal<RoleFilter>('ALL')
	readonly statusFilter = signal<StatusFilter>('ALL')

	// ── Invite modal ──────────────────────────────────────────────
	readonly inviteOpen = signal(false)
	readonly inviteSaving = signal(false)
	readonly inviteSavedOk = signal(false)

	readonly inviteForm = new FormGroup({
		email:    new FormControl('', [Validators.required, Validators.email]),
		jobTitle: new FormControl(''),
		role:     new FormControl<UserTenantRole>('MEMBER', Validators.required),
	})

	// ── Edit user modal ───────────────────────────────────────────
	readonly editUser = signal<MockTenantUser | null>(null)
	readonly editOpen = computed(() => this.editUser() !== null)
	readonly editSaving = signal(false)

	readonly editForm = new FormGroup({
		jobTitle: new FormControl('', Validators.required),
		role:     new FormControl<UserTenantRole>('MEMBER', Validators.required),
	})

	// ── Block / Unblock confirmation ──────────────────────────────
	readonly blockCandidate = signal<MockTenantUser | null>(null)
	readonly blockOpen = computed(() => this.blockCandidate() !== null)
	readonly blocking = signal(false)

	// ── Deactivate confirmation ───────────────────────────────────
	readonly deactivateCandidate = signal<MockTenantUser | null>(null)
	readonly deactivateOpen = computed(() => this.deactivateCandidate() !== null)
	readonly deactivating = signal(false)

	// ── Role options ──────────────────────────────────────────────
	readonly roleOptions = ROLE_OPTIONS

	// ── Stats ─────────────────────────────────────────────────────
	readonly stats = computed(() => {
		const all = this.users()
		return {
			total:   all.length,
			active:  all.filter(u => u.status === 'ACTIVE').length,
			pending: all.filter(u => u.status === 'PENDING_INVITE').length,
			inactive: all.filter(u => u.status === 'INACTIVE').length,
			admins:  all.filter(u => u.tenantRole === 'TENANT_ADMIN').length,
		}
	})

	// ── Filtered list ─────────────────────────────────────────────
	readonly filteredUsers = computed(() => {
		const q   = this.searchQuery().toLowerCase().trim()
		const rf  = this.roleFilter()
		const sf  = this.statusFilter()

		return this.users().filter(u => {
			if (rf !== 'ALL' && u.tenantRole !== rf) return false
			if (sf !== 'ALL' && u.status !== sf) return false
			if (q) {
				const hay = [u.profile.firstName, u.profile.lastName, u.auth.email, u.profile.jobTitle].join(' ').toLowerCase()
				if (!hay.includes(q)) return false
			}
			return true
		})
	})

	get initials(): (u: MockTenantUser) => string {
		return u => (u.profile.firstName[0] + u.profile.lastName[0]).toUpperCase()
	}

	get fullName(): (u: MockTenantUser) => string {
		return u => `${u.profile.firstName} ${u.profile.lastName}`
	}

	// ── Invite ────────────────────────────────────────────────────
	openInvite(): void {
		this.inviteForm.reset({ email: '', jobTitle: '', role: 'MEMBER' })
		this.inviteOpen.set(true)
	}

	closeInvite(): void {
		this.inviteOpen.set(false)
	}

	onInviteSubmit(): void {
		this.inviteForm.markAllAsTouched()
		if (this.inviteForm.invalid) return

		const { email, jobTitle, role } = this.inviteForm.value
		this.inviteSaving.set(true)
		setTimeout(() => {
			const [first, ...rest] = (email ?? '').split('@')[0].split('.')
			const newUser: MockTenantUser = {
				id: `u${Date.now()}`,
				tenantRole: role as UserTenantRole,
				status: 'PENDING_INVITE',
				profile: {
					firstName: this.capitalize(first ?? 'Usuario'),
					lastName:  this.capitalize(rest[0] ?? ''),
					jobTitle:  jobTitle ?? '',
					avatarBg:  '#94A3B8',
				},
				auth: { email: email ?? '' },
				projectCount: 0,
				createdAt: new Date(),
				invitedAt: new Date(),
			}
			this.users.update(list => [...list, newUser])
			this.inviteSaving.set(false)
			this.inviteSavedOk.set(true)
			setTimeout(() => {
				this.inviteSavedOk.set(false)
				this.inviteOpen.set(false)
			}, 700)
		}, 900)
	}

	// ── Edit ──────────────────────────────────────────────────────
	openEdit(user: MockTenantUser, event: Event): void {
		event.stopPropagation()
		this.editForm.patchValue({ jobTitle: user.profile.jobTitle, role: user.tenantRole })
		this.editUser.set(user)
	}

	closeEdit(): void {
		this.editUser.set(null)
	}

	onEditSubmit(): void {
		this.editForm.markAllAsTouched()
		if (this.editForm.invalid) return

		const { jobTitle, role } = this.editForm.value
		const target = this.editUser()
		if (!target) return

		this.editSaving.set(true)
		setTimeout(() => {
			this.users.update(list => list.map(u =>
				u.id === target.id
					? { ...u, tenantRole: role as UserTenantRole, profile: { ...u.profile, jobTitle: jobTitle ?? u.profile.jobTitle } }
					: u,
			))
			this.editSaving.set(false)
			this.editUser.set(null)
		}, 600)
	}

	// ── Block / Unblock ───────────────────────────────────────────
	openBlock(user: MockTenantUser, event: Event): void {
		event.stopPropagation()
		this.blockCandidate.set(user)
	}

	closeBlock(): void {
		this.blockCandidate.set(null)
	}

	confirmBlock(): void {
		const target = this.blockCandidate()
		if (!target) return

		this.blocking.set(true)
		setTimeout(() => {
			const newStatus: UserStatus = target.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
			this.users.update(list => list.map(u => u.id === target.id ? { ...u, status: newStatus } : u))
			this.blocking.set(false)
			this.blockCandidate.set(null)
		}, 600)
	}

	// ── Deactivate ────────────────────────────────────────────────
	openDeactivate(user: MockTenantUser, event: Event): void {
		event.stopPropagation()
		this.deactivateCandidate.set(user)
	}

	closeDeactivate(): void {
		this.deactivateCandidate.set(null)
	}

	confirmDeactivate(): void {
		const target = this.deactivateCandidate()
		if (!target) return

		this.deactivating.set(true)
		setTimeout(() => {
			this.users.update(list => list.filter(u => u.id !== target.id))
			this.deactivating.set(false)
			this.deactivateCandidate.set(null)
		}, 600)
	}

	// ── Filter helpers ────────────────────────────────────────────
	onSearch(event: Event): void {
		this.searchQuery.set((event.target as HTMLInputElement).value)
	}

	filterPillClass(current: unknown, value: unknown): string {
		const base = 'px-3 py-1.5 rounded-input text-small font-medium transition-colors cursor-pointer border whitespace-nowrap'
		const active = 'bg-primary text-white border-primary dark:bg-primary-light dark:text-dark-background dark:border-primary-light'
		const inactive = 'bg-surface text-text-secondary border-border hover:border-primary/50 hover:text-text-primary dark:bg-dark-surface dark:border-dark-border dark:text-dark-text/60'
		return `${base} ${current === value ? active : inactive}`
	}

	// ── Label / style helpers ─────────────────────────────────────
	tenantRoleLabel(role: UserTenantRole | string): string {
		return role === 'TENANT_ADMIN' ? 'Administrador' : 'Miembro'
	}

	tenantRoleBadgeVariant(role: UserTenantRole | string): BadgeVariant {
		return role === 'TENANT_ADMIN' ? 'delayed' : 'custom'
	}

	tenantRoleIcon(role: UserTenantRole | string): IconType {
		return role === 'TENANT_ADMIN' ? 'shield-check' : 'user'
	}

	tenantRoleDescription(role: UserTenantRole | string): string {
		return role === 'TENANT_ADMIN'
			? 'Acceso total: gestiona usuarios, proyectos y configuración'
			: 'Acceso estándar — opera según su rol en cada proyecto'
	}

	statusLabel(status: UserStatus | string): string {
		const map: Record<string, string> = {
			ACTIVE:         'Activo',
			INACTIVE:       'Inactivo',
			PENDING_INVITE: 'Invitación pendiente',
		}
		return map[status] ?? status
	}

	statusBadgeVariant(status: UserStatus | string): BadgeVariant {
		const map: Record<string, BadgeVariant> = {
			ACTIVE:         'completed',
			INACTIVE:       'delayed',
			PENDING_INVITE: 'planning',
		}
		return (map[status] as BadgeVariant) ?? 'custom'
	}

	statusIcon(status: UserStatus | string): IconType {
		const map: Record<string, IconType> = {
			ACTIVE:         'circle-check',
			INACTIVE:       'ban',
			PENDING_INVITE: 'send',
		}
		return (map[status] as IconType) ?? 'user'
	}

	private capitalize(str: string): string {
		return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
	}
}
