import { DatePipe } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { Badge, BadgeVariant, Card, EmptyState, Icon, IconType, Modal, Select, SelectOption, StatCard } from '@org/ui'
import { ProjectMemberRole } from '@org/util'

import { MOCK_AVAILABLE_USERS, MOCK_PROJECT_MEMBERS, MockProjectMember } from './mock-members'

export type RoleFilter = ProjectMemberRole | 'ALL'

const ROLE_OPTIONS: SelectOption[] = [
	{ label: 'Administrador', value: 'ADMIN' },
	{ label: 'Supervisor', value: 'SUPERVISOR' },
	{ label: 'Residente', value: 'RESIDENT' },
	{ label: 'Espectador', value: 'VIEWER' },
]

@Component({
	selector: 'app-project-members',
	standalone: true,
	imports: [DatePipe, ReactiveFormsModule, Badge, Card, EmptyState, Icon, Modal, Select, StatCard],
	templateUrl: './project-members.html',
})
export class ProjectMembers {
	private readonly route = inject(ActivatedRoute)

	readonly projectId = computed(() => this.route.snapshot.parent?.params?.['id'] ?? '')

	// ── Live data (mutable for mock interactions) ─────────────────
	readonly members = signal([...MOCK_PROJECT_MEMBERS])
	readonly availableUsers = signal([...MOCK_AVAILABLE_USERS])

	// ── Filters ───────────────────────────────────────────────────
	readonly searchQuery = signal('')
	readonly roleFilter = signal<RoleFilter>('ALL')

	// ── Add modal ─────────────────────────────────────────────────
	readonly addOpen = signal(false)
	readonly addSaving = signal(false)
	readonly addSavedOk = signal(false)

	readonly addForm = new FormGroup({
		userId: new FormControl('', Validators.required),
		role: new FormControl<ProjectMemberRole>('VIEWER', Validators.required),
	})

	// ── Edit role modal ───────────────────────────────────────────
	readonly editMember = signal<MockProjectMember | null>(null)
	readonly editOpen = computed(() => this.editMember() !== null)
	readonly editSaving = signal(false)

	readonly editForm = new FormGroup({
		role: new FormControl<ProjectMemberRole>('VIEWER', Validators.required),
	})

	// ── Remove confirmation ───────────────────────────────────────
	readonly removeCandidate = signal<MockProjectMember | null>(null)
	readonly removeOpen = computed(() => this.removeCandidate() !== null)
	readonly removing = signal(false)

	// ── Options ───────────────────────────────────────────────────
	readonly roleOptions = ROLE_OPTIONS

	readonly userOptions = computed<SelectOption[]>(() =>
		this.availableUsers().map(u => ({ label: `${u.name} — ${u.email}`, value: u.id })),
	)

	// ── Stats ─────────────────────────────────────────────────────
	readonly stats = computed(() => {
		const all = this.members()
		return {
			total: all.length,
			adminCount: all.filter(m => m.role === 'ADMIN').length,
			fieldCount: all.filter(m => m.role === 'SUPERVISOR' || m.role === 'RESIDENT').length,
			viewerCount: all.filter(m => m.role === 'VIEWER').length,
			availableCount: this.availableUsers().length,
		}
	})

	// ── Filtered list ─────────────────────────────────────────────
	readonly filteredMembers = computed(() => {
		const q = this.searchQuery().toLowerCase().trim()
		const rf = this.roleFilter()
		return this.members().filter(m => {
			if (rf !== 'ALL' && m.role !== rf) return false
			if (q) {
				const hay = `${m.user.name} ${m.user.email}`.toLowerCase()
				if (!hay.includes(q)) return false
			}
			return true
		})
	})

	// ── Actions ───────────────────────────────────────────────────
	onSearch(event: Event): void {
		this.searchQuery.set((event.target as HTMLInputElement).value)
	}

	openAdd(): void {
		this.addForm.reset({ userId: '', role: 'VIEWER' })
		this.addOpen.set(true)
	}

	closeAdd(): void {
		this.addOpen.set(false)
	}

	onAddSubmit(): void {
		this.addForm.markAllAsTouched()
		if (this.addForm.invalid) return

		const { userId, role } = this.addForm.value
		const user = this.availableUsers().find(u => u.id === userId)
		if (!user) return

		this.addSaving.set(true)
		setTimeout(() => {
			const newMember: MockProjectMember = {
				id: `pm${Date.now()}`,
				projectId: this.projectId(),
				userId: user.id,
				user,
				role: role as ProjectMemberRole,
				assignedAt: new Date(),
				assignedByName: 'Tú',
			}
			this.members.update(list => [...list, newMember])
			this.availableUsers.update(list => list.filter(u => u.id !== userId))
			this.addSaving.set(false)
			this.addSavedOk.set(true)
			setTimeout(() => {
				this.addSavedOk.set(false)
				this.addOpen.set(false)
			}, 700)
		}, 800)
	}

	openEditRole(member: MockProjectMember, event: Event): void {
		event.stopPropagation()
		this.editForm.patchValue({ role: member.role })
		this.editMember.set(member)
	}

	closeEdit(): void {
		this.editMember.set(null)
	}

	onEditSubmit(): void {
		this.editForm.markAllAsTouched()
		if (this.editForm.invalid) return

		const role = this.editForm.value.role as ProjectMemberRole
		const target = this.editMember()
		if (!target) return

		this.editSaving.set(true)
		setTimeout(() => {
			this.members.update(list => list.map(m => (m.id === target.id ? { ...m, role } : m)))
			this.editSaving.set(false)
			this.editMember.set(null)
		}, 600)
	}

	openConfirmRemove(member: MockProjectMember, event: Event): void {
		event.stopPropagation()
		this.removeCandidate.set(member)
	}

	closeConfirmRemove(): void {
		this.removeCandidate.set(null)
	}

	confirmRemove(): void {
		const target = this.removeCandidate()
		if (!target) return

		this.removing.set(true)
		setTimeout(() => {
			this.members.update(list => list.filter(m => m.id !== target.id))
			this.availableUsers.update(list => [...list, target.user])
			this.removing.set(false)
			this.removeCandidate.set(null)
		}, 600)
	}

	// ── Helpers ───────────────────────────────────────────────────
	roleLabel(role: ProjectMemberRole | string): string {
		const map: Record<string, string> = {
			ADMIN: 'Administrador',
			SUPERVISOR: 'Supervisor',
			RESIDENT: 'Residente',
			VIEWER: 'Espectador',
		}
		return map[role] ?? role
	}

	roleDescription(role: ProjectMemberRole | string | unknown): string {
		if (role === '' || role === null || role === undefined) return ''
		const map: Record<string, string> = {
			ADMIN: 'Control total del proyecto',
			SUPERVISOR: 'Gestiona actividades y aprueba bitácoras',
			RESIDENT: 'Crea bitácoras y registra avances',
			VIEWER: 'Solo lectura',
		}
		return map[role as string] ?? ''
	}

	roleBadgeVariant(role: ProjectMemberRole | string): BadgeVariant {
		const map: Record<string, BadgeVariant> = {
			ADMIN: 'delayed',
			SUPERVISOR: 'in-progress',
			RESIDENT: 'planning',
			VIEWER: 'custom',
		}
		return (map[role] as BadgeVariant) ?? 'custom'
	}

	roleIcon(role: ProjectMemberRole | string | unknown): IconType {
		if (!role || role === '') return 'user'
		const map: Record<string, IconType> = {
			ADMIN: 'shield-check',
			SUPERVISOR: 'eye',
			RESIDENT: 'user',
			VIEWER: 'eye-closed',
		}
		return map[role as string] ?? 'user'
	}

	rolePillClass(value: RoleFilter): string {
		const base =
			'px-3 py-1.5 rounded-input text-small font-medium transition-colors cursor-pointer border whitespace-nowrap'
		const active =
			'bg-primary text-white border-primary dark:bg-primary-light dark:text-dark-background dark:border-primary-light'
		const inactive =
			'bg-surface text-text-secondary border-border hover:border-primary/50 hover:text-text-primary dark:bg-dark-surface dark:border-dark-border dark:text-dark-text/60'
		return `${base} ${this.roleFilter() === value ? active : inactive}`
	}
}
