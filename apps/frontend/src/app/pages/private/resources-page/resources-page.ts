import { CommonModule, CurrencyPipe } from '@angular/common'
import { Component, computed, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'

import { Badge, BadgeVariant, Card, EmptyState, Icon, IconType, Modal, StatCard } from '@org/ui'
import { ClassificationType, ResourceStatus } from '@org/util'

import {
	MOCK_CLASSIFICATIONS,
	MOCK_RESOURCES,
	MockClassification,
	MockResource,
	resourceIsLowStock,
} from '../projects/pages/resources/mock-resources'

type TypeFilter = ClassificationType | 'ALL'
type StatusFilter = ResourceStatus | 'ALL'

@Component({
	selector: 'app-resources-page',
	standalone: true,
	imports: [CurrencyPipe, CommonModule, ReactiveFormsModule, RouterLink, Badge, Card, EmptyState, Icon, Modal, StatCard],
	templateUrl: './resources-page.html',
})
export class ResourcesPage {
	// ── Live data ─────────────────────────────────────────────────
	readonly resources = signal([...MOCK_RESOURCES])

	// ── Filters ───────────────────────────────────────────────────
	readonly searchQuery = signal('')
	readonly typeFilter = signal<TypeFilter>('ALL')
	readonly statusFilter = signal<StatusFilter>('ALL')

	// ── Form modal (create / edit) ────────────────────────────────
	readonly formResource = signal<MockResource | null>(null)
	readonly formOpen = signal(false)
	readonly formMode = computed<'create' | 'edit'>(() => (this.formResource() ? 'edit' : 'create'))
	readonly formSaving = signal(false)
	readonly formSavedOk = signal(false)

	// Selected type inside the form (to filter classification options)
	readonly formSelectedType = signal<ClassificationType>('MATERIAL')

	readonly form = new FormGroup({
		name: new FormControl('', Validators.required),
		sku: new FormControl('', Validators.required),
		description: new FormControl(''),
		classificationType: new FormControl<ClassificationType>('MATERIAL', Validators.required),
		classificationId: new FormControl('cls-1', Validators.required),
		unitCost: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
		currency: new FormControl('MXN', Validators.required),
		currentStock: new FormControl<number | null>(null),
		minimumStock: new FormControl<number | null>(null),
	})

	// ── All classifications (for selects) ─────────────────────────
	readonly allClassifications = MOCK_CLASSIFICATIONS

	readonly filteredClassifications = computed(() =>
		this.allClassifications.filter(c => c.type === this.formSelectedType()),
	)

	// ── Stats ─────────────────────────────────────────────────────
	readonly stats = computed(() => {
		const all = this.resources()
		return {
			total: all.length,
			materials: all.filter(r => r.classification.type === 'MATERIAL').length,
			equipment: all.filter(r => r.classification.type === 'EQUIPMENT').length,
			labor: all.filter(r => r.classification.type === 'LABOR').length,
			inUse: all.filter(r => r.status === 'IN_USE').length,
			lowStock: all.filter(r => resourceIsLowStock(r)).length,
		}
	})

	// ── Financial summary ─────────────────────────────────────────
	readonly financial = computed(() => {
		const all = this.resources()
		const currency = 'MXN'

		// Valor en inventario: unitCost × currentStock para cada MATERIAL
		const materialValue = all
			.filter(r => r.classification.type === 'MATERIAL' && r.inventory != null)
			.reduce((sum, r) => sum + r.costing.unitCost * (r.inventory?.currentStock ?? 0), 0)

		// Valor de equipos en catálogo: suma de costos unitarios (tarifa/día de referencia)
		const equipmentValue = all
			.filter(r => r.classification.type === 'EQUIPMENT')
			.reduce((sum, r) => sum + r.costing.unitCost, 0)

		// Tarifa de mano de obra de referencia (costo/jornal total del catálogo)
		const laborDailyRate = all
			.filter(r => r.classification.type === 'LABOR')
			.reduce((sum, r) => sum + r.costing.unitCost, 0)

		// Costo estimado para reponer materiales con stock bajo mínimo
		const replenishmentCost = all
			.filter(r => r.classification.type === 'MATERIAL' && resourceIsLowStock(r))
			.reduce((sum, r) => {
				const deficit = (r.inventory?.minimumStock ?? 0) - (r.inventory?.currentStock ?? 0)
				return sum + Math.max(0, deficit) * r.costing.unitCost
			}, 0)

		const totalInvested = materialValue + equipmentValue

		// Porcentaje de cada tipo sobre el total
		const materialPct = totalInvested > 0 ? (materialValue / totalInvested) * 100 : 0
		const equipmentPct = totalInvested > 0 ? (equipmentValue / totalInvested) * 100 : 0

		return { materialValue, equipmentValue, laborDailyRate, replenishmentCost, totalInvested, materialPct, equipmentPct, currency }
	})

	// ── Filtered list ─────────────────────────────────────────────
	readonly filteredResources = computed(() => {
		const q = this.searchQuery().toLowerCase().trim()
		const tf = this.typeFilter()
		const sf = this.statusFilter()

		return this.resources().filter(r => {
			if (tf !== 'ALL' && r.classification.type !== tf) return false
			if (sf !== 'ALL' && r.status !== sf) return false
			if (q) {
				const hay = [
					r.identification.name,
					r.identification.sku,
					r.identification.description ?? '',
					r.classification.name,
				]
					.join(' ')
					.toLowerCase()
				if (!hay.includes(q)) return false
			}
			return true
		})
	})

	// ── Create / Edit ─────────────────────────────────────────────
	openCreate(): void {
		this.formSelectedType.set('MATERIAL')
		this.form.reset({
			name: '',
			sku: '',
			description: '',
			classificationType: 'MATERIAL',
			classificationId: 'cls-1',
			unitCost: null,
			currency: 'MXN',
			currentStock: null,
			minimumStock: null,
		})
		this.formResource.set(null)
		this.formOpen.set(true)
	}

	openEdit(r: MockResource, event: Event): void {
		event.stopPropagation()
		const type = r.classification.type
		this.formSelectedType.set(type)
		this.form.reset({
			name: r.identification.name,
			sku: r.identification.sku,
			description: r.identification.description ?? '',
			classificationType: type,
			classificationId: r.classificationId,
			unitCost: r.costing.unitCost,
			currency: r.costing.currency,
			currentStock: r.inventory?.currentStock ?? null,
			minimumStock: r.inventory?.minimumStock ?? null,
		})
		this.formResource.set(r)
		this.formOpen.set(true)
	}

	closeForm(): void {
		this.formOpen.set(false)
		this.formResource.set(null)
	}

	onTypeChange(type: ClassificationType): void {
		this.formSelectedType.set(type)
		this.form.get('classificationType')?.setValue(type)
		// Reset classification to first of that type
		const first = this.allClassifications.find(c => c.type === type)
		this.form.get('classificationId')?.setValue(first?.id ?? '')
		// Clear inventory if not MATERIAL
		if (type !== 'MATERIAL') {
			this.form.get('currentStock')?.setValue(null)
			this.form.get('minimumStock')?.setValue(null)
		}
	}

	onFormSubmit(): void {
		this.form.markAllAsTouched()
		if (this.form.invalid) return

		const v = this.form.value
		const cls = this.allClassifications.find(c => c.id === v.classificationId) as MockClassification
		this.formSaving.set(true)

		setTimeout(() => {
			const target = this.formResource()

			const patch: Partial<MockResource> = {
				identification: {
					sku: v.sku!,
					name: v.name!,
					description: v.description || undefined,
				},
				classification: cls,
				classificationId: cls.id,
				costing: { unitCost: v.unitCost!, currency: v.currency! },
				inventory:
					v.classificationType === 'MATERIAL'
						? { currentStock: v.currentStock ?? 0, minimumStock: v.minimumStock ?? undefined }
						: undefined,
				updatedAt: new Date(),
			}

			if (target) {
				this.resources.update(list => list.map(r => (r.id === target.id ? { ...r, ...patch } : r)))
			} else {
				const newResource: MockResource = {
					id: `res-${Date.now()}`,
					tenantId: 't1',
					status: 'AVAILABLE',
					createdAt: new Date(),
					...patch,
				} as MockResource
				this.resources.update(list => [...list, newResource])
			}

			this.formSaving.set(false)
			this.formSavedOk.set(true)
			setTimeout(() => {
				this.formSavedOk.set(false)
				this.closeForm()
			}, 700)
		}, 800)
	}

	// ── Status change (inline) ────────────────────────────────────
	cycleStatus(r: MockResource, event: Event): void {
		event.stopPropagation()
		const next: Record<ResourceStatus, ResourceStatus> = {
			AVAILABLE: 'IN_USE',
			IN_USE: 'MAINTENANCE',
			MAINTENANCE: 'AVAILABLE',
			DEPLETED: 'AVAILABLE',
		}
		this.resources.update(list =>
			list.map(x => (x.id === r.id ? { ...x, status: next[x.status], updatedAt: new Date() } : x)),
		)
	}

	// ── Filter helpers ────────────────────────────────────────────
	onSearch(event: Event): void {
		this.searchQuery.set((event.target as HTMLInputElement).value)
	}

	typePillClass(value: TypeFilter): string {
		const base =
			'px-3 py-1.5 rounded-input text-small font-medium transition-colors cursor-pointer border whitespace-nowrap'
		const active =
			'bg-primary text-white border-primary dark:bg-primary-light dark:text-dark-background dark:border-primary-light'
		const inactive =
			'bg-surface text-text-secondary border-border hover:border-primary/50 hover:text-text-primary dark:bg-dark-surface dark:border-dark-border dark:text-dark-text/60'
		return `${base} ${this.typeFilter() === value ? active : inactive}`
	}

	// ── Label / style helpers ─────────────────────────────────────
	typeLabel(type: ClassificationType): string {
		return { MATERIAL: 'Material', EQUIPMENT: 'Equipo', LABOR: 'Mano de obra' }[type]
	}

	typeBadgeVariant(type: ClassificationType): BadgeVariant {
		return { MATERIAL: 'in-progress', EQUIPMENT: 'planning', LABOR: 'delayed' }[type] as BadgeVariant
	}

	typeIcon(type: ClassificationType): IconType {
		return { MATERIAL: 'shopping-basket', EQUIPMENT: 'zap', LABOR: 'users' }[type] as IconType
	}

	statusLabel(status: ResourceStatus): string {
		return { AVAILABLE: 'Disponible', IN_USE: 'En uso', MAINTENANCE: 'Mantenimiento', DEPLETED: 'Agotado' }[status]
	}

	statusBadgeVariant(status: ResourceStatus): BadgeVariant {
		const map: Record<ResourceStatus, BadgeVariant> = {
			AVAILABLE: 'completed',
			IN_USE: 'in-progress',
			MAINTENANCE: 'delayed',
			DEPLETED: 'custom',
		}
		return map[status]
	}

	isLowStock(r: MockResource): boolean {
		return resourceIsLowStock(r)
	}
}
