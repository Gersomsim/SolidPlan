import { DatePipe } from '@angular/common'
import { Component, computed, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

import { Badge, Card, EmptyState, Icon, Modal, StatCard } from '@org/ui'

import { MOCK_ACTIVITY_STATES, MockActivityState, STATE_PRESET_COLORS } from './mock-activity-states'

@Component({
	selector: 'app-activity-states-page',
	standalone: true,
	imports: [DatePipe, ReactiveFormsModule, Badge, Card, EmptyState, Icon, Modal, StatCard],
	templateUrl: './activity-states-page.html',
})
export class ActivityStatesPage {

	// ── Live data ─────────────────────────────────────────────────
	readonly states = signal([...MOCK_ACTIVITY_STATES])

	// ── Search ────────────────────────────────────────────────────
	readonly searchQuery = signal('')

	// ── Form modal (create / edit) ────────────────────────────────
	readonly formState = signal<MockActivityState | null>(null)
	readonly formOpen = signal(false)
	readonly formMode = computed<'create' | 'edit'>(() => this.formState() ? 'edit' : 'create')
	readonly formSaving = signal(false)
	readonly formSavedOk = signal(false)

	readonly form = new FormGroup({
		name:      new FormControl('', Validators.required),
		color:     new FormControl('#64748B', Validators.required),
		isFinal:   new FormControl(false),
		isDefault: new FormControl(false),
	})

	// ── Delete confirm ────────────────────────────────────────────
	readonly deleteCandidate = signal<MockActivityState | null>(null)
	readonly deleteOpen = computed(() => this.deleteCandidate() !== null)
	readonly deleting = signal(false)

	// ── Preset colors ─────────────────────────────────────────────
	readonly presetColors = STATE_PRESET_COLORS

	// ── Stats ─────────────────────────────────────────────────────
	readonly stats = computed(() => {
		const all = this.states()
		const def = all.find(s => s.isDefault)
		return {
			total:       all.length,
			finals:      all.filter(s => s.isFinal).length,
			inUse:       all.filter(s => s.usageCount > 0).length,
			defaultName: def?.name ?? '—',
			defaultColor: def?.color ?? '#9CA3AF',
		}
	})

	// ── Filtered + sorted list ────────────────────────────────────
	readonly filteredStates = computed(() => {
		const q = this.searchQuery().toLowerCase().trim()
		return [...this.states()]
			.filter(s => !q || s.name.toLowerCase().includes(q))
			.sort((a, b) => a.order - b.order)
	})

	// ── Create / Edit ─────────────────────────────────────────────
	openCreate(): void {
		this.form.reset({ name: '', color: '#64748B', isFinal: false, isDefault: false })
		this.formState.set(null)
		this.formOpen.set(true)
	}

	openEdit(s: MockActivityState, event: Event): void {
		event.stopPropagation()
		this.form.patchValue({ name: s.name, color: s.color, isFinal: s.isFinal, isDefault: s.isDefault })
		this.formState.set(s)
		this.formOpen.set(true)
	}

	closeForm(): void {
		this.formOpen.set(false)
		this.formState.set(null)
	}

	onFormSubmit(): void {
		this.form.markAllAsTouched()
		if (this.form.invalid) return

		const { name, color, isFinal, isDefault } = this.form.value
		const newId = `as${Date.now()}`
		this.formSaving.set(true)

		setTimeout(() => {
			const target = this.formState()

			this.states.update(list => {
				let updated: MockActivityState[]

				if (target) {
					updated = list.map(s =>
						s.id === target.id
							? { ...s, name: name!, color: color!, isFinal: !!isFinal, isDefault: !!isDefault, updatedAt: new Date() }
							: s,
					)
				} else {
					const newState: MockActivityState = {
						id: newId,
						name: name!,
						color: color!,
						order: Math.max(0, ...list.map(s => s.order)) + 1,
						isFinal: !!isFinal,
						isDefault: !!isDefault,
						usageCount: 0,
						createdAt: new Date(),
						updatedAt: new Date(),
					}
					updated = [...list, newState]
				}

				// Enforce single default
				if (isDefault) {
					const changedId = target?.id ?? newId
					updated = updated.map(s => ({ ...s, isDefault: s.id === changedId }))
				}

				return updated
			})

			this.formSaving.set(false)
			this.formSavedOk.set(true)
			setTimeout(() => {
				this.formSavedOk.set(false)
				this.closeForm()
			}, 700)
		}, 800)
	}

	// ── Delete ────────────────────────────────────────────────────
	openDelete(s: MockActivityState, event: Event): void {
		event.stopPropagation()
		this.deleteCandidate.set(s)
	}

	closeDelete(): void {
		this.deleteCandidate.set(null)
	}

	confirmDelete(): void {
		const target = this.deleteCandidate()
		if (!target) return

		this.deleting.set(true)
		setTimeout(() => {
			this.states.update(list => list.filter(s => s.id !== target.id))
			this.deleting.set(false)
			this.deleteCandidate.set(null)
		}, 600)
	}

	// ── Reorder ───────────────────────────────────────────────────
	moveUp(s: MockActivityState, event: Event): void {
		event.stopPropagation()
		const sorted = this.filteredStates()
		const idx = sorted.findIndex(x => x.id === s.id)
		if (idx <= 0) return
		const prev = sorted[idx - 1]
		this.states.update(list => list.map(x =>
			x.id === s.id    ? { ...x, order: prev.order } :
			x.id === prev.id ? { ...x, order: s.order }   : x,
		))
	}

	moveDown(s: MockActivityState, event: Event): void {
		event.stopPropagation()
		const sorted = this.filteredStates()
		const idx = sorted.findIndex(x => x.id === s.id)
		if (idx >= sorted.length - 1) return
		const next = sorted[idx + 1]
		this.states.update(list => list.map(x =>
			x.id === s.id    ? { ...x, order: next.order } :
			x.id === next.id ? { ...x, order: s.order }   : x,
		))
	}

	// ── Search helper ─────────────────────────────────────────────
	onSearch(event: Event): void {
		this.searchQuery.set((event.target as HTMLInputElement).value)
	}
}
