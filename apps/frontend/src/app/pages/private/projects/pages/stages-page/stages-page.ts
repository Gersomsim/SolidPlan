import { DatePipe } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'

import { Badge, BadgeVariant, EmptyState, Icon, Modal, ProgressBar } from '@org/ui'
import { ActivityStatus, ProjectStageStatus } from '@org/util'

import { MOCK_STAGE_TEMPLATES } from '../../../stage-templates-page/mock-stage-templates'
import { MOCK_ACTIVITIES } from '../activities-page/mock-activities'
import { MOCK_PROJECT_STAGES, MockProjectStage, STAGE_PRESET_COLORS } from './mock-stages'

@Component({
	selector: 'app-stages-page',
	standalone: true,
	imports: [DatePipe, ReactiveFormsModule, RouterLink, Badge, EmptyState, Icon, Modal, ProgressBar],
	templateUrl: './stages-page.html',
})
export class StagesPage {
	private readonly route = inject(ActivatedRoute)
	readonly projectId = this.route.snapshot.parent?.params?.['id'] ?? ''

	readonly stages = signal([...MOCK_PROJECT_STAGES])
	readonly expandedStages = signal<Set<string>>(new Set())

	toggleActivities(stageId: string): void {
		this.expandedStages.update(set => {
			const next = new Set(set)
			next.has(stageId) ? next.delete(stageId) : next.add(stageId)
			return next
		})
	}

	isExpanded(stageId: string): boolean {
		return this.expandedStages().has(stageId)
	}
	readonly presetColors = STAGE_PRESET_COLORS
	readonly templates = MOCK_STAGE_TEMPLATES.filter(t => !t.isArchived)

	// ── Form modal ────────────────────────────────────────────────
	readonly formStage = signal<MockProjectStage | null>(null)
	readonly formOpen = signal(false)
	readonly formMode = computed<'create' | 'edit'>(() => (this.formStage() ? 'edit' : 'create'))
	readonly formSaving = signal(false)
	readonly formSavedOk = signal(false)
	readonly formColor = signal('#F59E0B')
	readonly formSource = signal<'template' | 'custom'>('template')

	readonly form = new FormGroup({
		name:             new FormControl('', Validators.required),
		description:      new FormControl(''),
		plannedStartDate: new FormControl(''),
		plannedEndDate:   new FormControl(''),
		templateId:       new FormControl(''),
	})

	// ── Stats ─────────────────────────────────────────────────────
	readonly stats = computed(() => {
		const all = this.stages()
		return {
			total:      all.length,
			completed:  all.filter(s => s.status === 'COMPLETED').length,
			inProgress: all.filter(s => s.status === 'IN_PROGRESS').length,
			pending:    all.filter(s => s.status === 'PENDING').length,
		}
	})

	// ── Sorted stages ─────────────────────────────────────────────
	readonly sortedStages = computed(() =>
		[...this.stages()].sort((a, b) => a.order - b.order),
	)

	// ── Open / close ──────────────────────────────────────────────
	openCreate(): void {
		this.formSource.set('template')
		this.formColor.set('#F59E0B')
		this.form.reset({ name: '', description: '', plannedStartDate: '', plannedEndDate: '', templateId: this.templates[0]?.id ?? '' })
		this.formStage.set(null)
		this.formOpen.set(true)
	}

	openEdit(stage: MockProjectStage): void {
		this.formSource.set('custom')
		this.formColor.set(stage.info.color)
		this.form.reset({
			name: stage.info.name,
			description: stage.info.description ?? '',
			plannedStartDate: stage.dates.plannedStartDate ? this.toInputDate(stage.dates.plannedStartDate) : '',
			plannedEndDate:   stage.dates.plannedEndDate   ? this.toInputDate(stage.dates.plannedEndDate)   : '',
			templateId: '',
		})
		this.formStage.set(stage)
		this.formOpen.set(true)
	}

	closeForm(): void {
		this.formOpen.set(false)
		this.formStage.set(null)
	}

	onSourceChange(source: 'template' | 'custom'): void {
		this.formSource.set(source)
		if (source === 'template') {
			const tpl = this.templates.find(t => t.id === this.form.value.templateId) ?? this.templates[0]
			if (tpl) {
				this.form.patchValue({ name: tpl.name, description: tpl.description ?? '' })
				this.formColor.set(tpl.color)
			}
		}
	}

	onTemplateChange(id: string): void {
		const tpl = this.templates.find(t => t.id === id)
		if (tpl && this.formSource() === 'template') {
			this.form.patchValue({ name: tpl.name, description: tpl.description ?? '' })
			this.formColor.set(tpl.color)
		}
	}

	onFormSubmit(): void {
		this.form.markAllAsTouched()
		if (this.form.invalid) return

		const v = this.form.value
		this.formSaving.set(true)

		setTimeout(() => {
			const target = this.formStage()

			const patch = {
				info: {
					name:        v.name!,
					description: v.description || undefined,
					color:       this.formColor(),
				},
				dates: {
					...(target?.dates ?? {}),
					plannedStartDate: v.plannedStartDate ? new Date(v.plannedStartDate) : undefined,
					plannedEndDate:   v.plannedEndDate   ? new Date(v.plannedEndDate)   : undefined,
				},
				templateId: this.formSource() === 'template' ? (v.templateId || undefined) : undefined,
				updatedAt: new Date(),
			}

			if (target) {
				this.stages.update(list => list.map(s => s.id === target.id ? { ...s, ...patch } : s))
			} else {
				const sorted = this.sortedStages()
				const newStage: MockProjectStage = {
					id: `s-${Date.now()}`,
					projectId: '1',
					order: sorted.length + 1,
					status: 'PENDING',
					activityCount: 0,
					completedActivityCount: 0,
					createdAt: new Date(),
					...patch,
				}
				this.stages.update(list => [...list, newStage])
			}

			this.formSaving.set(false)
			this.formSavedOk.set(true)
			setTimeout(() => { this.formSavedOk.set(false); this.closeForm() }, 700)
		}, 800)
	}

	// ── Reorder ───────────────────────────────────────────────────
	moveUp(stage: MockProjectStage): void {
		const sorted = this.sortedStages()
		const idx = sorted.findIndex(s => s.id === stage.id)
		if (idx <= 0) return
		const prev = sorted[idx - 1]
		this.stages.update(list => list.map(s => {
			if (s.id === stage.id) return { ...s, order: prev.order }
			if (s.id === prev.id) return { ...s, order: stage.order }
			return s
		}))
	}

	moveDown(stage: MockProjectStage): void {
		const sorted = this.sortedStages()
		const idx = sorted.findIndex(s => s.id === stage.id)
		if (idx < 0 || idx >= sorted.length - 1) return
		const next = sorted[idx + 1]
		this.stages.update(list => list.map(s => {
			if (s.id === stage.id) return { ...s, order: next.order }
			if (s.id === next.id) return { ...s, order: stage.order }
			return s
		}))
	}

	// ── Status cycle ──────────────────────────────────────────────
	cycleStatus(stage: MockProjectStage): void {
		const next: Record<ProjectStageStatus, ProjectStageStatus> = {
			PENDING:     'IN_PROGRESS',
			IN_PROGRESS: 'COMPLETED',
			COMPLETED:   'PENDING',
			SKIPPED:     'PENDING',
		}
		this.stages.update(list => list.map(s =>
			s.id === stage.id ? { ...s, status: next[s.status], updatedAt: new Date() } : s,
		))
	}

	// ── Helpers ───────────────────────────────────────────────────
	stageActivities(stageId: string) {
		return MOCK_ACTIVITIES.filter(a => a.stageId === stageId)
	}

	progressPct(stage: MockProjectStage): number {
		const linked = this.stageActivities(stage.id)
		if (linked.length === 0) return stage.status === 'COMPLETED' ? 100 : 0
		const completed = linked.filter(a => a.status === 'COMPLETED').length
		return Math.round((completed / linked.length) * 100)
	}

	activityCountFor(stageId: string): number {
		return this.stageActivities(stageId).length
	}

	completedCountFor(stageId: string): number {
		return this.stageActivities(stageId).filter(a => a.status === 'COMPLETED').length
	}

	statusLabel(status: ProjectStageStatus): string {
		return { PENDING: 'Pendiente', IN_PROGRESS: 'En curso', COMPLETED: 'Completada', SKIPPED: 'Omitida' }[status]
	}

	statusBadgeVariant(status: ProjectStageStatus): BadgeVariant {
		const map: Record<ProjectStageStatus, BadgeVariant> = {
			PENDING: 'planning', IN_PROGRESS: 'in-progress', COMPLETED: 'completed', SKIPPED: 'custom',
		}
		return map[status]
	}

	durationDays(stage: MockProjectStage): number | null {
		const s = stage.dates.plannedStartDate
		const e = stage.dates.plannedEndDate
		if (!s || !e) return null
		return Math.round((e.getTime() - s.getTime()) / 86400000)
	}

	isFirst(stage: MockProjectStage): boolean {
		return this.sortedStages()[0]?.id === stage.id
	}

	isLast(stage: MockProjectStage): boolean {
		const s = this.sortedStages()
		return s[s.length - 1]?.id === stage.id
	}

	activityStatusLabel(status: ActivityStatus): string {
		const map: Record<ActivityStatus, string> = {
			COMPLETED: 'Completada', IN_PROGRESS: 'En progreso', PENDING: 'Pendiente',
			BLOCKED: 'Bloqueada', CANCELLED: 'Cancelada', DELAYED: 'Retrasada',
		}
		return map[status] ?? status
	}

	activityStatusClass(status: ActivityStatus): string {
		const map: Record<ActivityStatus, string> = {
			COMPLETED:   'text-success',
			IN_PROGRESS: 'text-primary dark:text-primary-light',
			PENDING:     'text-text-muted dark:text-dark-text/40',
			BLOCKED:     'text-danger',
			DELAYED:     'text-danger',
			CANCELLED:   'text-text-muted dark:text-dark-text/40',
		}
		return map[status] ?? ''
	}

	private toInputDate(d: Date): string {
		return d.toISOString().split('T')[0]
	}
}
