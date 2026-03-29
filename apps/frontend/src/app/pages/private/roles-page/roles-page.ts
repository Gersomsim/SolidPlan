import { Component, computed, signal } from '@angular/core'
import { RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Card, EmptyState, Icon, StatCard } from '@org/ui'

import { MOCK_ROLES, MockRole } from './mock-roles'

type ScopeFilter = 'ALL' | 'TENANT' | 'PROJECT'

@Component({
	selector: 'app-roles-page',
	standalone: true,
	imports: [RouterLink, Badge, Card, EmptyState, Icon, StatCard],
	templateUrl: './roles-page.html',
})
export class RolesPage {

	// ── Data ──────────────────────────────────────────────────────
	readonly roles = signal([...MOCK_ROLES])

	// ── Filters ───────────────────────────────────────────────────
	readonly searchQuery = signal('')
	readonly scopeFilter = signal<ScopeFilter>('ALL')

	// ── Stats ─────────────────────────────────────────────────────
	readonly stats = computed(() => {
		const all = this.roles()
		const uniqueUsers = new Set(all.flatMap(r => r.users.map(u => u.id)))
		return {
			total:         all.length,
			systemDefault: all.filter(r => r.isSystemDefault).length,
			custom:        all.filter(r => !r.isSystemDefault).length,
			totalUsers:    uniqueUsers.size,
		}
	})

	// ── Filtered list ─────────────────────────────────────────────
	readonly filteredRoles = computed(() => {
		const q  = this.searchQuery().toLowerCase().trim()
		const sf = this.scopeFilter()

		return this.roles().filter(r => {
			if (sf !== 'ALL' && r.scope !== sf) return false
			if (q) {
				const hay = [r.name, r.description ?? ''].join(' ').toLowerCase()
				if (!hay.includes(q)) return false
			}
			return true
		})
	})

	// ── Events ────────────────────────────────────────────────────
	onSearch(event: Event): void {
		this.searchQuery.set((event.target as HTMLInputElement).value)
	}

	// ── Helpers ───────────────────────────────────────────────────
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

	permissionSummary(role: MockRole): string {
		const count = role.permissions.length
		const resources = new Set(role.permissions.map(p => p.resource)).size
		if (count === 0) return 'Sin permisos'
		return `${count} permiso${count !== 1 ? 's' : ''} · ${resources} recurso${resources !== 1 ? 's' : ''}`
	}

	initials(u: { firstName: string; lastName: string }): string {
		return (u.firstName[0] + u.lastName[0]).toUpperCase()
	}

	filterPillClass(current: unknown, value: unknown): string {
		const base = 'px-3 py-1.5 rounded-input text-small font-medium transition-colors cursor-pointer border whitespace-nowrap'
		const active = 'bg-primary text-white border-primary dark:bg-primary-light dark:text-dark-background dark:border-primary-light'
		const inactive = 'bg-surface text-text-secondary border-border hover:border-primary/50 hover:text-text-primary dark:bg-dark-surface dark:border-dark-border dark:text-dark-text/60'
		return `${base} ${current === value ? active : inactive}`
	}
}
