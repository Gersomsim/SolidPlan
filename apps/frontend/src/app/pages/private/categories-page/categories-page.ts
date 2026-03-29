import { DatePipe } from '@angular/common'
import { Component, computed, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

import { Badge, Card, EmptyState, Icon, Modal, StatCard } from '@org/ui'

import { MOCK_CATEGORIES, MockCategory } from './mock-categories'

type ViewFilter = 'ACTIVE' | 'ARCHIVED' | 'ALL'

@Component({
	selector: 'app-categories-page',
	standalone: true,
	imports: [DatePipe, ReactiveFormsModule, Badge, Card, EmptyState, Icon, Modal, StatCard],
	templateUrl: './categories-page.html',
})
export class CategoriesPage {

	// ── Live data ─────────────────────────────────────────────────
	readonly categories = signal([...MOCK_CATEGORIES])

	// ── Filters ───────────────────────────────────────────────────
	readonly searchQuery = signal('')
	readonly viewFilter = signal<ViewFilter>('ACTIVE')

	// ── Form modal (create / edit) ────────────────────────────────
	readonly formCategory = signal<MockCategory | null>(null)
	readonly formOpen = signal(false)
	readonly formMode = computed<'create' | 'edit'>(() => this.formCategory() ? 'edit' : 'create')
	readonly formSaving = signal(false)
	readonly formSavedOk = signal(false)

	readonly form = new FormGroup({
		name:        new FormControl('', Validators.required),
		description: new FormControl(''),
	})

	// ── Archive confirm ───────────────────────────────────────────
	readonly archiveCandidate = signal<MockCategory | null>(null)
	readonly archiveOpen = computed(() => this.archiveCandidate() !== null)
	readonly archiving = signal(false)

	// ── Delete confirm ────────────────────────────────────────────
	readonly deleteCandidate = signal<MockCategory | null>(null)
	readonly deleteOpen = computed(() => this.deleteCandidate() !== null)
	readonly deleting = signal(false)

	// ── Stats ─────────────────────────────────────────────────────
	readonly stats = computed(() => {
		const all = this.categories()
		return {
			total:    all.length,
			active:   all.filter(c => !c.isArchived).length,
			archived: all.filter(c => c.isArchived).length,
			inUse:    all.filter(c => c.usageCount > 0 && !c.isArchived).length,
		}
	})

	// ── Filtered list ─────────────────────────────────────────────
	readonly filteredCategories = computed(() => {
		const q  = this.searchQuery().toLowerCase().trim()
		const vf = this.viewFilter()

		return this.categories().filter(c => {
			if (vf === 'ACTIVE'   && c.isArchived)  return false
			if (vf === 'ARCHIVED' && !c.isArchived) return false
			if (q) {
				const hay = `${c.name} ${c.description ?? ''}`.toLowerCase()
				if (!hay.includes(q)) return false
			}
			return true
		})
	})

	// ── Create / Edit ─────────────────────────────────────────────
	openCreate(): void {
		this.form.reset({ name: '', description: '' })
		this.formCategory.set(null)
		this.formOpen.set(true)
	}

	openEdit(c: MockCategory, event: Event): void {
		event.stopPropagation()
		this.form.patchValue({ name: c.name, description: c.description ?? '' })
		this.formCategory.set(c)
		this.formOpen.set(true)
	}

	closeForm(): void {
		this.formOpen.set(false)
		this.formCategory.set(null)
	}

	onFormSubmit(): void {
		this.form.markAllAsTouched()
		if (this.form.invalid) return

		const { name, description } = this.form.value
		this.formSaving.set(true)

		setTimeout(() => {
			const target = this.formCategory()
			if (target) {
				this.categories.update(list => list.map(c =>
					c.id === target.id
						? { ...c, name: name!, description: description || undefined, updatedAt: new Date() }
						: c,
				))
			} else {
				const newCategory: MockCategory = {
					id: `cat${Date.now()}`,
					name: name!,
					description: description || undefined,
					isArchived: false,
					usageCount: 0,
					createdAt: new Date(),
					updatedAt: new Date(),
				}
				this.categories.update(list => [...list, newCategory])
			}
			this.formSaving.set(false)
			this.formSavedOk.set(true)
			setTimeout(() => {
				this.formSavedOk.set(false)
				this.closeForm()
			}, 700)
		}, 800)
	}

	// ── Archive / Restore ─────────────────────────────────────────
	openArchive(c: MockCategory, event: Event): void {
		event.stopPropagation()
		this.archiveCandidate.set(c)
	}

	closeArchive(): void {
		this.archiveCandidate.set(null)
	}

	confirmArchive(): void {
		const target = this.archiveCandidate()
		if (!target) return

		this.archiving.set(true)
		setTimeout(() => {
			this.categories.update(list => list.map(c =>
				c.id === target.id ? { ...c, isArchived: !c.isArchived, updatedAt: new Date() } : c,
			))
			this.archiving.set(false)
			this.archiveCandidate.set(null)
		}, 600)
	}

	// ── Delete ────────────────────────────────────────────────────
	openDelete(c: MockCategory, event: Event): void {
		event.stopPropagation()
		this.deleteCandidate.set(c)
	}

	closeDelete(): void {
		this.deleteCandidate.set(null)
	}

	confirmDelete(): void {
		const target = this.deleteCandidate()
		if (!target) return

		this.deleting.set(true)
		setTimeout(() => {
			this.categories.update(list => list.filter(c => c.id !== target.id))
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
