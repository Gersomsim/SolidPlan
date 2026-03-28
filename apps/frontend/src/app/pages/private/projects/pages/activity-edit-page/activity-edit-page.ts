import { Component, computed, inject, OnInit, signal } from '@angular/core'
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms'
import { DecimalPipe } from '@angular/common'
import { Router, RouterLink, ActivatedRoute } from '@angular/router'

import {
	Badge,
	BadgeVariant,
	Card,
	Checkbox,
	Icon,
	Input,
	Radio,
	RadioGroup,
	Select,
	SelectOption,
	Textarea,
} from '@org/ui'
import { ActivityStatus } from '@org/util'

import { getActivityById, MOCK_ACTIVITIES } from '../activities-page/mock-activities'

interface DependencyRow {
	uid: string
	targetActivityId: string
	type: string
	lagDays: number
}

function toDateInput(date?: Date): string {
	return date ? date.toISOString().split('T')[0] : ''
}

function uid(): string {
	return Math.random().toString(36).slice(2)
}

@Component({
	selector: 'app-activity-edit-page',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		RouterLink,
		DecimalPipe,
		Badge, Card, Checkbox, Icon, Input, Radio, RadioGroup, Select, Textarea,
	],
	templateUrl: './activity-edit-page.html',
})
export class ActivityEditPage implements OnInit {
	private readonly route  = inject(ActivatedRoute)
	private readonly router = inject(Router)

	readonly activityId = computed(() => this.route.snapshot.params['activityId'] as string)
	readonly projectId  = computed(() => this.route.snapshot.parent?.parent?.params?.['id'] as string ?? '')
	readonly activity   = computed(() => getActivityById(this.activityId()))

	readonly saving = signal(false)
	readonly saved  = signal(false)

	readonly dependencies = signal<DependencyRow[]>([])

	// ── Options ───────────────────────────────────────────────
	readonly roleOptions: SelectOption[] = [
		{ value: 'ADMIN',      label: 'Administrador' },
		{ value: 'SUPERVISOR', label: 'Supervisor' },
		{ value: 'RESIDENT',   label: 'Residente de obra' },
		{ value: 'VIEWER',     label: 'Solo lectura' },
	]

	readonly statusOptions: SelectOption[] = [
		{ value: 'PENDING',     label: 'Pendiente' },
		{ value: 'IN_PROGRESS', label: 'En progreso' },
		{ value: 'BLOCKED',     label: 'Bloqueado' },
		{ value: 'COMPLETED',   label: 'Completado' },
	]

	readonly categoryOptions: SelectOption[] = [
		{ value: 'Diseño',         label: 'Diseño' },
		{ value: 'Topografía',     label: 'Topografía' },
		{ value: 'Obra civil',     label: 'Obra civil' },
		{ value: 'Estructural',    label: 'Estructural' },
		{ value: 'Eléctrico',      label: 'Eléctrico' },
		{ value: 'Hidráulico',     label: 'Hidráulico' },
		{ value: 'Instalaciones',  label: 'Instalaciones' },
		{ value: 'Documentación',  label: 'Documentación' },
	]

	readonly unitOptions: SelectOption[] = [
		{ value: 'm2',  label: 'm² — Metro cuadrado' },
		{ value: 'm3',  label: 'm³ — Metro cúbico' },
		{ value: 'ml',  label: 'ml — Metro lineal' },
		{ value: 'ton', label: 'ton — Tonelada' },
		{ value: 'pza', label: 'pza — Pieza' },
		{ value: 'kg',  label: 'kg — Kilogramo' },
		{ value: 'gl',  label: 'gl — Global' },
		{ value: 'hr',  label: 'hr — Hora' },
	]

	readonly dependencyTypeOptions: SelectOption[] = [
		{ value: 'FS', label: 'FS — Fin a Inicio (más común)' },
		{ value: 'SS', label: 'SS — Inicio a Inicio' },
		{ value: 'FF', label: 'FF — Fin a Fin' },
		{ value: 'SF', label: 'SF — Inicio a Fin' },
	]

	readonly activityOptions = computed<SelectOption[]>(() =>
		MOCK_ACTIVITIES
			.filter(a => a.id !== this.activityId())
			.map(a => ({ value: a.id, label: `${a.code} — ${a.name}` })),
	)

	readonly parentOptions = computed<SelectOption[]>(() => [
		{ value: '', label: 'Sin actividad padre (nivel raíz)' },
		...MOCK_ACTIVITIES
			.filter(a => a.id !== this.activityId())
			.map(a => ({ value: a.id, label: `${a.code} — ${a.name}` })),
	])

	// ── Form ──────────────────────────────────────────────────
	readonly form = new FormGroup({
		// Información general
		code:        new FormControl('', { nonNullable: true, validators: [Validators.required] }),
		name:        new FormControl('', { nonNullable: true, validators: [Validators.required] }),
		description: new FormControl('', { nonNullable: true }),
		category:    new FormControl('', { nonNullable: true }),

		// Asignación
		assignedRole: new FormControl('', { nonNullable: true }),
		parentId:     new FormControl('', { nonNullable: true }),

		// Cronograma
		startDate:      new FormControl('', { nonNullable: true }),
		endDate:        new FormControl('', { nonNullable: true }),
		durationDays:   new FormControl(0, { nonNullable: true }),
		actualStartDate: new FormControl('', { nonNullable: true }),
		actualEndDate:   new FormControl('', { nonNullable: true }),
		isCriticalPath:  new FormControl(false, { nonNullable: true }),

		// Estado y progreso
		status:          new FormControl('PENDING',     { nonNullable: true }),
		progressType:    new FormControl('PERCENTAGE',  { nonNullable: true }),
		progress:        new FormControl(0,  { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
		progressStateId: new FormControl('', { nonNullable: true }),

		// Medición
		unit:             new FormControl('m2', { nonNullable: true }),
		plannedQuantity:  new FormControl(0,    { nonNullable: true, validators: [Validators.min(0)] }),
		actualQuantity:   new FormControl(0,    { nonNullable: true, validators: [Validators.min(0)] }),
		unitPrice:        new FormControl(0,    { nonNullable: true, validators: [Validators.min(0)] }),
	})

	ngOnInit(): void {
		const act = this.activity()
		if (!act) return

		this.form.patchValue({
			code:         act.code,
			name:         act.name,
			description:  act.description ?? '',
			category:     act.category,
			assignedRole: act.assignedRole,
			parentId:     act.parentId ?? '',
			startDate:    toDateInput(act.startDate),
			endDate:      toDateInput(act.endDate),
			durationDays: act.durationDays,
			status:       act.status,
			progressType: act.progressType,
			progress:     act.progress,
			isCriticalPath: act.isCriticalPath,
		})
	}

	// ── Dependencies ──────────────────────────────────────────
	addDependency(): void {
		this.dependencies.update(rows => [
			...rows,
			{ uid: uid(), targetActivityId: '', type: 'FS', lagDays: 0 },
		])
	}

	removeDependency(uid: string): void {
		this.dependencies.update(rows => rows.filter(r => r.uid !== uid))
	}

	updateDependency(uid: string, field: keyof Omit<DependencyRow, 'uid'>, value: string | number): void {
		this.dependencies.update(rows =>
			rows.map(r => r.uid === uid ? { ...r, [field]: value } : r),
		)
	}

	// ── Submit ────────────────────────────────────────────────
	onSave(): void {
		this.form.markAllAsTouched()
		if (this.form.invalid) return

		this.saving.set(true)
		// Simulate API call
		setTimeout(() => {
			this.saving.set(false)
			this.saved.set(true)
			setTimeout(() => {
				this.router.navigate([
					'/system/projects', this.projectId(),
					'activities', this.activityId(),
				])
			}, 800)
		}, 1200)
	}

	onCancel(): void {
		this.router.navigate([
			'/system/projects', this.projectId(),
			'activities', this.activityId(),
		])
	}

	// ── Helpers ───────────────────────────────────────────────
	get progressType(): string {
		return this.form.get('progressType')!.value
	}

	statusBadgeVariant(status: string): BadgeVariant {
		const map: Record<ActivityStatus, BadgeVariant> = {
			COMPLETED:   'completed',
			IN_PROGRESS: 'in-progress',
			PENDING:     'planning',
			BLOCKED:     'delayed',
		}
		return map[status as ActivityStatus] ?? 'planning'
	}
}
