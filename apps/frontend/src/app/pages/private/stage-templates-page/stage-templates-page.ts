import { DatePipe } from '@angular/common'
import { Component, computed, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

import { Badge, Card, EmptyState, Icon, Modal, StatCard } from '@org/ui'

import { MOCK_STAGE_TEMPLATES, MockStageTemplate, PRESET_COLORS } from './mock-stage-templates'

type ViewFilter = 'ACTIVE' | 'ARCHIVED' | 'ALL'

@Component({
	selector: 'app-stage-templates-page',
	standalone: true,
	imports: [DatePipe, ReactiveFormsModule, Badge, Card, EmptyState, Icon, Modal, StatCard],
	templateUrl: './stage-templates-page.html',
})
export class StageTemplatesPage {

	// ── Live data ─────────────────────────────────────────────────
	readonly templates = signal([...MOCK_STAGE_TEMPLATES])

	// ── Filters ───────────────────────────────────────────────────
	readonly searchQuery = signal('')
	readonly viewFilter = signal<ViewFilter>('ACTIVE')

	// ── Form modal (create / edit) ────────────────────────────────
	readonly formTemplate = signal<MockStageTemplate | null>(null)
	readonly formOpen = signal(false)
	readonly formMode = computed<'create' | 'edit'>(() => this.formTemplate() ? 'edit' : 'create')
	readonly formSaving = signal(false)
	readonly formSavedOk = signal(false)

	readonly form = new FormGroup({
		name:        new FormControl('', Validators.required),
		description: new FormControl(''),
		color:       new FormControl('#64748B', Validators.required),
	})

	// ── Archive confirm ───────────────────────────────────────────
	readonly archiveCandidate = signal<MockStageTemplate | null>(null)
	readonly archiveOpen = computed(() => this.archiveCandidate() !== null)
	readonly archiving = signal(false)

	// ── Delete confirm ────────────────────────────────────────────
	readonly deleteCandidate = signal<MockStageTemplate | null>(null)
	readonly deleteOpen = computed(() => this.deleteCandidate() !== null)
	readonly deleting = signal(false)

	// ── Preset colors ─────────────────────────────────────────────
	readonly presetColors = PRESET_COLORS

	// ── Stats ─────────────────────────────────────────────────────
	readonly stats = computed(() => {
		const all = this.templates()
		return {
			total:    all.length,
			active:   all.filter(t => !t.isArchived).length,
			archived: all.filter(t => t.isArchived).length,
			inUse:    all.filter(t => t.usageCount > 0 && !t.isArchived).length,
		}
	})

	// ── Filtered list ─────────────────────────────────────────────
	readonly filteredTemplates = computed(() => {
		const q  = this.searchQuery().toLowerCase().trim()
		const vf = this.viewFilter()

		return this.templates().filter(t => {
			if (vf === 'ACTIVE'   && t.isArchived)  return false
			if (vf === 'ARCHIVED' && !t.isArchived) return false
			if (q) {
				const hay = `${t.name} ${t.description ?? ''}`.toLowerCase()
				if (!hay.includes(q)) return false
			}
			return true
		})
	})

	// ── Create / Edit ─────────────────────────────────────────────
	openCreate(): void {
		this.form.reset({ name: '', description: '', color: '#64748B' })
		this.formTemplate.set(null)
		this.formOpen.set(true)
	}

	openEdit(t: MockStageTemplate, event: Event): void {
		event.stopPropagation()
		this.form.patchValue({ name: t.name, description: t.description ?? '', color: t.color })
		this.formTemplate.set(t)
		this.formOpen.set(true)
	}

	closeForm(): void {
		this.formOpen.set(false)
		this.formTemplate.set(null)
	}

	onFormSubmit(): void {
		this.form.markAllAsTouched()
		if (this.form.invalid) return

		const { name, description, color } = this.form.value
		this.formSaving.set(true)

		setTimeout(() => {
			const target = this.formTemplate()
			if (target) {
				this.templates.update(list => list.map(t =>
					t.id === target.id
						? { ...t, name: name!, description: description || undefined, color: color!, updatedAt: new Date() }
						: t,
				))
			} else {
				const newTemplate: MockStageTemplate = {
					id: `st${Date.now()}`,
					name: name!,
					description: description || undefined,
					color: color!,
					isArchived: false,
					usageCount: 0,
					createdAt: new Date(),
					updatedAt: new Date(),
				}
				this.templates.update(list => [...list, newTemplate])
			}
			this.formSaving.set(false)
			this.formSavedOk.set(true)
			setTimeout(() => {
				this.formSavedOk.set(false)
				this.closeForm()
			}, 700)
		}, 800)
	}

	// ── Archive / Unarchive ───────────────────────────────────────
	openArchive(t: MockStageTemplate, event: Event): void {
		event.stopPropagation()
		this.archiveCandidate.set(t)
	}

	closeArchive(): void {
		this.archiveCandidate.set(null)
	}

	confirmArchive(): void {
		const target = this.archiveCandidate()
		if (!target) return

		this.archiving.set(true)
		setTimeout(() => {
			this.templates.update(list => list.map(t =>
				t.id === target.id ? { ...t, isArchived: !t.isArchived, updatedAt: new Date() } : t,
			))
			this.archiving.set(false)
			this.archiveCandidate.set(null)
		}, 600)
	}

	// ── Delete ────────────────────────────────────────────────────
	openDelete(t: MockStageTemplate, event: Event): void {
		event.stopPropagation()
		this.deleteCandidate.set(t)
	}

	closeDelete(): void {
		this.deleteCandidate.set(null)
	}

	confirmDelete(): void {
		const target = this.deleteCandidate()
		if (!target) return

		this.deleting.set(true)
		setTimeout(() => {
			this.templates.update(list => list.filter(t => t.id !== target.id))
			this.deleting.set(false)
			this.deleteCandidate.set(null)
		}, 600)
	}

	// ── Filter helpers ────────────────────────────────────────────
	onSearch(event: Event): void {
		this.searchQuery.set((event.target as HTMLInputElement).value)
	}

	filterPillClass(value: ViewFilter): string {
		const base = 'px-3 py-1.5 rounded-input text-small font-medium transition-colors cursor-pointer border whitespace-nowrap'
		const active = 'bg-primary text-white border-primary dark:bg-primary-light dark:text-dark-background dark:border-primary-light'
		const inactive = 'bg-surface text-text-secondary border-border hover:border-primary/50 hover:text-text-primary dark:bg-dark-surface dark:border-dark-border dark:text-dark-text/60'
		return `${base} ${this.viewFilter() === value ? active : inactive}`
	}
}
