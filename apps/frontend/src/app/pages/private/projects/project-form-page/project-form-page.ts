import { Component, computed, signal, OnInit } from '@angular/core'
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'
import { RouterLink, Router, ActivatedRoute } from '@angular/router'
import { inject } from '@angular/core'

import { Badge, BadgeVariant, Card, Checkbox, Icon, Input, Select, Textarea } from '@org/ui'
import { ProjectStatus } from '@org/util'
import { SelectOption } from '@org/ui'

interface StageRow {
	uid: string
	name: string
	order: number
}

const STATUS_OPTIONS: SelectOption[] = [
	{ label: 'Planificación', value: 'PLANNING' },
	{ label: 'En progreso', value: 'IN_PROGRESS' },
	{ label: 'Retrasado', value: 'DELAYED' },
	{ label: 'Detenido', value: 'HALTED' },
	{ label: 'Completado', value: 'COMPLETED' },
	{ label: 'Archivado', value: 'ARCHIVED' },
]

const CURRENCY_OPTIONS: SelectOption[] = [
	{ label: 'MXN — Peso mexicano', value: 'MXN' },
	{ label: 'USD — Dólar americano', value: 'USD' },
	{ label: 'EUR — Euro', value: 'EUR' },
]

const ROLE_OPTIONS: SelectOption[] = [
	{ label: 'Sin asignar', value: '' },
	{ label: 'Admin', value: 'ADMIN' },
	{ label: 'Supervisor', value: 'SUPERVISOR' },
	{ label: 'Residente', value: 'RESIDENT' },
]

let uidCounter = 0
function uid(): string {
	return `stage-${++uidCounter}`
}

@Component({
	selector: 'app-project-form-page',
	standalone: true,
	imports: [ReactiveFormsModule, RouterLink, Badge, Card, Checkbox, Icon, Input, Select, Textarea],
	templateUrl: './project-form-page.html',
})
export class ProjectFormPage implements OnInit {
	private readonly route  = inject(ActivatedRoute)
	private readonly router = inject(Router)

	readonly projectId = computed(() => this.route.snapshot.params['id'] ?? null)
	readonly isEdit    = computed(() => !!this.projectId())

	readonly saving = signal(false)
	readonly saved  = signal(false)

	readonly stages = signal<StageRow[]>([
		{ uid: uid(), name: 'Cimientos', order: 1 },
		{ uid: uid(), name: 'Estructura', order: 2 },
	])

	readonly statusOptions   = STATUS_OPTIONS
	readonly currencyOptions = CURRENCY_OPTIONS
	readonly roleOptions     = ROLE_OPTIONS

	readonly form = new FormGroup({
		// Identidad
		code:        new FormControl('', Validators.required),
		name:        new FormControl('', Validators.required),
		description: new FormControl(''),

		// Ubicación
		street:     new FormControl(''),
		commune:    new FormControl(''),
		city:       new FormControl(''),
		country:    new FormControl('México'),
		postalCode: new FormControl(''),
		lat:        new FormControl<number | null>(null),
		lon:        new FormControl<number | null>(null),

		// Cronograma
		estimatedStartDate: new FormControl(''),
		estimatedEndDate:   new FormControl(''),
		actualStartDate:    new FormControl(''),
		actualEndDate:      new FormControl(''),

		// Presupuesto
		budgetAmount:   new FormControl<number | null>(null),
		budgetCurrency: new FormControl('MXN'),

		// Metadata
		totalArea: new FormControl<number | null>(null),
		tags:      new FormControl(''),

		// Stakeholders
		ownerId:   new FormControl(''),
		managerId: new FormControl(''),

		// Estado (edit only)
		status: new FormControl<ProjectStatus>('PLANNING'),
	})

	ngOnInit(): void {
		if (this.isEdit()) {
			// In real implementation would fetch by projectId()
			// Pre-fill with mock data for demonstration
			this.form.patchValue({
				code:               'OBR-2024-001',
				name:               'Torre Residencial El Pinar',
				description:        'Edificio residencial de 15 niveles con 120 departamentos en zona norte de Monterrey.',
				street:             'Av. Constitución 1234',
				commune:            'San Pedro Garza García',
				city:               'Monterrey',
				country:            'México',
				postalCode:         '66220',
				estimatedStartDate: '2024-03-15',
				estimatedEndDate:   '2026-08-15',
				actualStartDate:    '2024-03-15',
				budgetAmount:       45000000,
				budgetCurrency:     'MXN',
				totalArea:          4200,
				tags:               'residencial, torre',
				status:             'IN_PROGRESS',
			})
		}
	}

	addStage(): void {
		const nextOrder = this.stages().length + 1
		this.stages.update(rows => [
			...rows,
			{ uid: uid(), name: '', order: nextOrder },
		])
	}

	removeStage(stageUid: string): void {
		this.stages.update(rows =>
			rows
				.filter(r => r.uid !== stageUid)
				.map((r, i) => ({ ...r, order: i + 1 })),
		)
	}

	updateStageName(stageUid: string, name: string): void {
		this.stages.update(rows =>
			rows.map(r => r.uid === stageUid ? { ...r, name } : r),
		)
	}

	moveStage(stageUid: string, direction: 'up' | 'down'): void {
		this.stages.update(rows => {
			const idx  = rows.findIndex(r => r.uid === stageUid)
			const next = direction === 'up' ? idx - 1 : idx + 1
			if (next < 0 || next >= rows.length) return rows
			const updated = [...rows]
			;[updated[idx], updated[next]] = [updated[next], updated[idx]]
			return updated.map((r, i) => ({ ...r, order: i + 1 }))
		})
	}

	onSave(): void {
		this.form.markAllAsTouched()
		if (this.form.invalid) return

		this.saving.set(true)
		setTimeout(() => {
			this.saving.set(false)
			this.saved.set(true)
			setTimeout(() => {
				this.saved.set(false)
				this.router.navigate(['/system/projects'])
			}, 1200)
		}, 1000)
	}

	statusBadgeVariant(status: ProjectStatus): BadgeVariant {
		const map: Record<ProjectStatus, BadgeVariant> = {
			PLANNING:    'planning',
			IN_PROGRESS: 'in-progress',
			DELAYED:     'delayed',
			HALTED:      'custom',
			COMPLETED:   'completed',
			ARCHIVED:    'custom',
		}
		return map[status]
	}
}
