import { Component, computed, inject, signal } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Card, EmptyState, Icon, IconType, Modal, StatCard } from '@org/ui'
import { PermissionAction as PermissionActionEnum, PermissionResource as PermissionResourceEnum } from '@org/util'

import { MOCK_ROLES, MockRole, MockRoleUser } from '../roles-page/mock-roles'

// ─── Type aliases ─────────────────────────────────────────────────────────────

type PermissionResource = keyof typeof PermissionResourceEnum
type PermissionAction   = keyof typeof PermissionActionEnum

// ─── Permission matrix config ─────────────────────────────────────────────────

export interface PermissionGroup {
	label: string
	icon: IconType
	resources: {
		key: PermissionResource
		label: string
	}[]
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
	{
		label: 'Proyectos',
		icon: 'building',
		resources: [
			{ key: 'PROJECTS',   label: 'Proyectos' },
			{ key: 'DAILY_LOGS', label: 'Bitácoras' },
			{ key: 'SCHEDULE',   label: 'Cronograma' },
		],
	},
	{
		label: 'Organización',
		icon: 'users',
		resources: [
			{ key: 'MEMBERS',         label: 'Miembros' },
			{ key: 'ROLES',           label: 'Roles' },
			{ key: 'STAGE_TEMPLATES', label: 'Plantillas de etapas' },
			{ key: 'CATEGORIES',      label: 'Categorías' },
			{ key: 'ACTIVITY_STATES', label: 'Estados de actividad' },
		],
	},
	{
		label: 'Recursos',
		icon: 'shopping-basket',
		resources: [
			{ key: 'RESOURCES', label: 'Recursos' },
		],
	},
	{
		label: 'Administración',
		icon: 'settings',
		resources: [
			{ key: 'SYSTEM_CONFIG', label: 'Configuración' },
			{ key: 'BILLING',       label: 'Facturación' },
			{ key: 'REPORTS',       label: 'Reportes' },
		],
	},
]

export const ACTIONS: { key: PermissionAction; label: string; short: string }[] = [
	{ key: 'READ',   label: 'Leer',    short: 'Leer' },
	{ key: 'CREATE', label: 'Crear',   short: 'Crear' },
	{ key: 'UPDATE', label: 'Editar',  short: 'Editar' },
	{ key: 'DELETE', label: 'Borrar',  short: 'Borrar' },
	{ key: 'MANAGE', label: 'Total',   short: 'Total' },
]

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
	selector: 'app-role-edit-page',
	standalone: true,
	imports: [RouterLink, Badge, Card, EmptyState, Icon, Modal, StatCard],
	templateUrl: './role-edit-page.html',
})
export class RoleEditPage {
	private readonly route  = inject(ActivatedRoute)
	private readonly router = inject(Router)

	// ── Role data ─────────────────────────────────────────────────
	readonly role = computed<MockRole | null>(() => {
		const id = this.route.snapshot.paramMap.get('id')
		return MOCK_ROLES.find(r => r.id === id) ?? null
	})

	// ── Local permissions state (mutable copy) ────────────────────
	readonly permissions = signal<{ resource: PermissionResource; action: PermissionAction }[]>([])

	// Flag to track init
	private initialized = false

	ngOnInit(): void {
		const role = this.role()
		if (role && !this.initialized) {
			this.permissions.set([...role.permissions])
			this.initialized = true
		}
	}

	// ── Remove user modal ─────────────────────────────────────────
	readonly removeCandidate = signal<MockRoleUser | null>(null)
	readonly removeOpen = computed(() => this.removeCandidate() !== null)
	readonly removing = signal(false)

	// ── Save state ────────────────────────────────────────────────
	readonly saving = signal(false)
	readonly savedOk = signal(false)

	// ── Matrix config ─────────────────────────────────────────────
	readonly groups = PERMISSION_GROUPS
	readonly actions = ACTIONS

	// ── Computed stats ────────────────────────────────────────────
	readonly permCount = computed(() => this.permissions().length)
	readonly resourceCount = computed(() => new Set(this.permissions().map(p => p.resource)).size)

	// ── Permission helpers ────────────────────────────────────────

	has(resource: PermissionResource, action: PermissionAction): boolean {
		const perms = this.permissions()
		// MANAGE implies all actions
		if (action !== 'MANAGE' && perms.some(p => p.resource === resource && p.action === 'MANAGE')) {
			return true
		}
		return perms.some(p => p.resource === resource && p.action === action)
	}

	/** Returns true only if MANAGE is explicitly set (for the MANAGE checkbox state). */
	hasExact(resource: PermissionResource, action: PermissionAction): boolean {
		return this.permissions().some(p => p.resource === resource && p.action === action)
	}

	/** True if cell is implied (READ/CREATE/UPDATE/DELETE implied by MANAGE). */
	isImplied(resource: PermissionResource, action: PermissionAction): boolean {
		if (action === 'MANAGE') return false
		return this.permissions().some(p => p.resource === resource && p.action === 'MANAGE')
	}

	toggle(resource: PermissionResource, action: PermissionAction): void {
		const current = this.permissions()

		if (this.hasExact(resource, action)) {
			// Remove
			if (action === 'MANAGE') {
				// When removing MANAGE, remove it alone (subordinate actions stay if they exist)
				this.permissions.set(current.filter(p => !(p.resource === resource && p.action === 'MANAGE')))
			} else {
				this.permissions.set(current.filter(p => !(p.resource === resource && p.action === action)))
			}
		} else {
			// Add
			if (action === 'MANAGE') {
				// Adding MANAGE — remove all subordinate perms for this resource (they're redundant)
				const without = current.filter(p => p.resource !== resource)
				this.permissions.set([...without, { resource, action: 'MANAGE' }])
			} else {
				this.permissions.set([...current, { resource, action }])
			}
		}
	}

	/** Toggle all actions for a resource row (select all / deselect all). */
	toggleRow(resource: PermissionResource): void {
		const hasManage = this.hasExact(resource, 'MANAGE')
		const hasSome   = this.permissions().some(p => p.resource === resource)

		if (hasManage || hasSome) {
			// Deselect all
			this.permissions.set(this.permissions().filter(p => p.resource !== resource))
		} else {
			// Select MANAGE (implies all)
			this.permissions.set([...this.permissions().filter(p => p.resource !== resource), { resource, action: 'MANAGE' }])
		}
	}

	rowHasAny(resource: PermissionResource): boolean {
		return this.permissions().some(p => p.resource === resource)
	}

	// ── Save ──────────────────────────────────────────────────────
	save(): void {
		this.saving.set(true)
		setTimeout(() => {
			this.saving.set(false)
			this.savedOk.set(true)
			setTimeout(() => this.savedOk.set(false), 2000)
		}, 800)
	}

	// ── Remove user from role ─────────────────────────────────────
	openRemove(user: MockRoleUser, event: Event): void {
		event.stopPropagation()
		this.removeCandidate.set(user)
	}

	closeRemove(): void {
		this.removeCandidate.set(null)
	}

	confirmRemove(): void {
		this.removing.set(true)
		setTimeout(() => {
			this.removing.set(false)
			this.removeCandidate.set(null)
		}, 600)
	}

	// ── Navigation ────────────────────────────────────────────────
	goBack(): void {
		this.router.navigate(['/system/roles'])
	}

	// ── Label helpers ─────────────────────────────────────────────
	scopeBadgeVariant(role: MockRole): BadgeVariant {
		if (role.scope === 'TENANT')  return 'delayed'
		if (role.scope === 'PROJECT') return 'planning'
		return 'custom'
	}

	scopeLabel(role: MockRole): string {
		if (role.scope === 'TENANT')  return 'TENANT'
		if (role.scope === 'PROJECT') return 'PROYECTO'
		return role.scope
	}

	initials(u: { firstName: string; lastName: string }): string {
		return (u.firstName[0] + u.lastName[0]).toUpperCase()
	}

	cellClass(resource: PermissionResource, action: PermissionAction): string {
		const implied = this.isImplied(resource, action)
		const exact   = this.hasExact(resource, action)
		const base    = 'w-full h-full flex items-center justify-center transition-colors rounded-default cursor-pointer'

		if (implied) {
			return `${base} bg-primary/8 dark:bg-primary-light/8 text-primary dark:text-primary-light`
		}
		if (exact) {
			if (action === 'MANAGE') {
				return `${base} bg-primary dark:bg-primary-light text-white`
			}
			return `${base} bg-primary/15 dark:bg-primary-light/15 text-primary dark:text-primary-light`
		}
		return `${base} hover:bg-secondary-bg dark:hover:bg-white/5 text-transparent hover:text-text-secondary`
	}
}
