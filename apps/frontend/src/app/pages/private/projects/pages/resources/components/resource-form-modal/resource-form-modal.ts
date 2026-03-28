import { DecimalPipe } from '@angular/common'
import { Component, OnInit, computed, input, output, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

import { Icon, Input, Select, SelectOption, Textarea } from '@org/ui'

import { MOCK_CLASSIFICATIONS, MOCK_RESOURCES, MockProjectResource } from '../../mock-resources'

const STATUS_OPTIONS: SelectOption[] = [
	{ label: 'Planificado', value: 'PLANNED' },
	{ label: 'Solicitado', value: 'ORDERED' },
	{ label: 'En uso', value: 'IN_USE' },
	{ label: 'Completado', value: 'COMPLETED' },
	{ label: 'Cancelado', value: 'CANCELLED' },
]

const CURRENCY_OPTIONS: SelectOption[] = [
	{ label: 'MXN — Peso mexicano', value: 'MXN' },
	{ label: 'USD — Dólar americano', value: 'USD' },
]

const STAGE_OPTIONS: SelectOption[] = [
	{ label: '— Sin etapa específica —', value: '' },
	{ label: 'Cimientos', value: 'cim' },
	{ label: 'Estructura', value: 'est' },
	{ label: 'Instalaciones', value: 'ins' },
	{ label: 'Muros y divisiones', value: 'mur' },
	{ label: 'Acabados', value: 'aca' },
	{ label: 'Entrega', value: 'ent' },
]

@Component({
	selector: 'app-resource-form-modal',
	standalone: true,
	imports: [ReactiveFormsModule, DecimalPipe, Icon, Input, Select, Textarea],
	templateUrl: './resource-form-modal.html',
})
export class ResourceFormModal implements OnInit {
	readonly mode = input<'create' | 'edit'>('create')
	readonly projectResource = input<MockProjectResource | null>(null)

	readonly saved = output<void>()
	readonly canceled = output<void>()

	readonly saving = signal(false)
	readonly savedOk = signal(false)

	readonly isEdit = computed(() => this.mode() === 'edit')

	// Tenant resource options
	readonly resourceOptions = computed<SelectOption[]>(() =>
		MOCK_RESOURCES.map(r => ({
			label: `${r.identification.sku} — ${r.identification.name}`,
			value: r.id,
		})),
	)

	readonly classificationOptions = computed<SelectOption[]>(() =>
		MOCK_CLASSIFICATIONS.map(c => ({
			label: `${c.name} (${c.type}) — ${c.unitOfMeasure}`,
			value: c.id,
		})),
	)

	readonly statusOptions = STATUS_OPTIONS
	readonly currencyOptions = CURRENCY_OPTIONS
	readonly stageOptions = STAGE_OPTIONS

	// Derived info about the selected resource
	readonly selectedResourceInfo = computed(() => {
		const id = this.form.get('resourceId')?.value
		return MOCK_RESOURCES.find(r => r.id === id) ?? null
	})

	readonly showInventory = computed(() => this.selectedResourceInfo()?.classification.type === 'MATERIAL')

	readonly unitOfMeasure = computed(() => this.selectedResourceInfo()?.classification.unitOfMeasure ?? '—')

	readonly form = new FormGroup({
		resourceId: new FormControl('', Validators.required),
		stageId: new FormControl(''),
		plannedQuantity: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
		usedQuantity: new FormControl<number | null>(0, [Validators.min(0)]),
		reservedQuantity: new FormControl<number | null>(0, [Validators.min(0)]),
		overrideCost: new FormControl(false),
		unitCostOverride: new FormControl<number | null>(null, [Validators.min(0)]),
		currencyOverride: new FormControl('MXN'),
		status: new FormControl('PLANNED', Validators.required),
		requestedAt: new FormControl(''),
		deliveredAt: new FormControl(''),
		notes: new FormControl(''),
	})

	ngOnInit(): void {
		const pr = this.projectResource()
		if (!pr) return

		const hasOverride = !!pr.costingOverride
		this.form.patchValue({
			resourceId: pr.resourceId,
			stageId: pr.stageId ?? '',
			plannedQuantity: pr.allocation.plannedQuantity,
			usedQuantity: pr.allocation.usedQuantity,
			reservedQuantity: pr.allocation.reservedQuantity,
			overrideCost: hasOverride,
			unitCostOverride: pr.costingOverride?.unitCost ?? null,
			currencyOverride: pr.costingOverride?.currency ?? 'MXN',
			status: pr.status,
			requestedAt: pr.requestedAt ? pr.requestedAt.toISOString().split('T')[0] : '',
			deliveredAt: pr.deliveredAt ? pr.deliveredAt.toISOString().split('T')[0] : '',
			notes: pr.notes ?? '',
		})
	}

	get showCostOverride(): boolean {
		return !!this.form.get('overrideCost')?.value
	}

	// Cost preview
	get previewPlannedCost(): number {
		const qty = this.form.get('plannedQuantity')?.value ?? 0
		const cost = this.showCostOverride
			? (this.form.get('unitCostOverride')?.value ?? 0)
			: (this.selectedResourceInfo()?.costing.unitCost ?? 0)
		return (qty ?? 0) * (cost ?? 0)
	}

	get previewCurrency(): string {
		return this.showCostOverride
			? (this.form.get('currencyOverride')?.value ?? 'MXN')
			: (this.selectedResourceInfo()?.costing.currency ?? 'MXN')
	}

	formatCurrency(amount: number, currency: string): string {
		return new Intl.NumberFormat('es-MX', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
	}

	onSubmit(): void {
		this.form.markAllAsTouched()
		if (this.form.invalid) return

		this.saving.set(true)
		setTimeout(() => {
			this.saving.set(false)
			this.savedOk.set(true)
			setTimeout(() => {
				this.savedOk.set(false)
				this.saved.emit()
			}, 800)
		}, 900)
	}
}
