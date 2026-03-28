import { DatePipe, DecimalPipe } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import {
	Badge,
	BadgeVariant,
	Card,
	EmptyState,
	Icon,
	IconType,
	Modal,
	ProgressBar,
	ProgressBarColor,
	StatCard,
} from '@org/ui'
import { ClassificationType, ProjectResourceStatus } from '@org/util'

import { ResourceFormModal } from './components/resource-form-modal/resource-form-modal'
import {
	MOCK_PROJECT_RESOURCES,
	MockProjectResource,
	actualCost,
	consumptionPercent,
	effectiveCurrency,
	effectiveUnitCost,
	plannedCost,
	resourceIsLowStock,
} from './mock-resources'

export type TypeFilter = ClassificationType | 'ALL'
export type StatusFilter = ProjectResourceStatus | 'ALL'

@Component({
	selector: 'app-resources',
	standalone: true,
	imports: [DatePipe, DecimalPipe, Badge, Card, EmptyState, Icon, Modal, ProgressBar, StatCard, ResourceFormModal],
	templateUrl: './resources.html',
	styleUrl: './resources.css',
})
export class Resources {
	private readonly route = inject(ActivatedRoute)

	readonly projectId = computed(() => this.route.snapshot.parent?.params?.['id'] ?? '')

	// ── Filters ──────────────────────────────────────────────────
	readonly searchQuery = signal('')
	readonly typeFilter = signal<TypeFilter>('ALL')
	readonly statusFilter = signal<StatusFilter>('ALL')

	// ── Detail modal ──────────────────────────────────────────────
	readonly selectedResource = signal<MockProjectResource | null>(null)
	readonly detailOpen = computed(() => this.selectedResource() !== null)

	// ── Form modal (create / edit) ────────────────────────────────
	readonly formOpen = signal(false)
	readonly formResource = signal<MockProjectResource | null>(null)
	readonly formMode = computed<'create' | 'edit'>(() => (this.formResource() ? 'edit' : 'create'))

	// ── Expose helpers to template ────────────────────────────────
	readonly effectiveUnitCost = effectiveUnitCost
	readonly effectiveCurrency = effectiveCurrency
	readonly plannedCost = plannedCost
	readonly actualCost = actualCost
	readonly consumptionPercent = consumptionPercent
	readonly resourceIsLowStock = resourceIsLowStock

	// ── Stats ─────────────────────────────────────────────────────
	readonly stats = computed(() => {
		const all = MOCK_PROJECT_RESOURCES
		const total = all.reduce((s, r) => s + plannedCost(r), 0)
		const used = all.reduce((s, r) => s + actualCost(r), 0)
		const lowStock = all.filter(r => resourceIsLowStock(r.resource))
		return {
			count: all.length,
			materialCount: all.filter(r => r.resource.classification.type === 'MATERIAL').length,
			equipmentCount: all.filter(r => r.resource.classification.type === 'EQUIPMENT').length,
			laborCount: all.filter(r => r.resource.classification.type === 'LABOR').length,
			totalPlanned: total,
			totalActual: used,
			lowStockCount: lowStock.length,
		}
	})

	// ── Filtered & grouped ────────────────────────────────────────
	readonly filteredResources = computed<MockProjectResource[]>(() => {
		const q = this.searchQuery().toLowerCase().trim()
		const typeF = this.typeFilter()
		const statF = this.statusFilter()

		return MOCK_PROJECT_RESOURCES.filter(pr => {
			if (typeF !== 'ALL' && pr.resource.classification.type !== typeF) return false
			if (statF !== 'ALL' && pr.status !== statF) return false
			if (q) {
				const hay = [
					pr.resource.identification.sku,
					pr.resource.identification.name,
					pr.resource.identification.description ?? '',
					pr.resource.classification.name,
					pr.stageName ?? '',
				]
					.join(' ')
					.toLowerCase()
				if (!hay.includes(q)) return false
			}
			return true
		})
	})

	// Group by classification type for the table sections
	readonly groupedResources = computed(() => {
		const filtered = this.filteredResources()
		const order: ClassificationType[] = ['LABOR', 'EQUIPMENT', 'MATERIAL']
		return order
			.map(type => ({
				type,
				label: this.typeLabel(type),
				icon: this.typeIcon(type),
				items: filtered.filter(r => r.resource.classification.type === type),
			}))
			.filter(g => g.items.length > 0)
	})

	// ── Actions ───────────────────────────────────────────────────
	openDetail(pr: MockProjectResource): void {
		this.selectedResource.set(pr)
	}

	closeDetail(): void {
		this.selectedResource.set(null)
	}

	openCreate(): void {
		this.formResource.set(null)
		this.formOpen.set(true)
	}

	openEdit(pr: MockProjectResource, event: Event): void {
		event.stopPropagation()
		this.selectedResource.set(null)
		this.formResource.set(pr)
		this.formOpen.set(true)
	}

	closeForm(): void {
		this.formOpen.set(false)
		this.formResource.set(null)
	}

	onSearch(event: Event): void {
		this.searchQuery.set((event.target as HTMLInputElement).value)
	}

	// ── Label / style helpers ─────────────────────────────────────
	typeLabel(type: ClassificationType | string): string {
		const map: Record<string, string> = {
			LABOR: 'Mano de obra',
			EQUIPMENT: 'Equipo y maquinaria',
			MATERIAL: 'Materiales',
		}
		return map[type] ?? type
	}

	typeIcon(type: ClassificationType | string): IconType {
		const map: Record<string, IconType> = {
			LABOR: 'users',
			EQUIPMENT: 'settings',
			MATERIAL: 'shopping-basket',
		}
		return map[type] ?? 'file'
	}

	typeBadgeVariant(type: ClassificationType | string): BadgeVariant {
		const map: Record<string, BadgeVariant> = {
			LABOR: 'planning',
			EQUIPMENT: 'in-progress',
			MATERIAL: 'completed',
		}
		return (map[type] as BadgeVariant) ?? 'custom'
	}

	statusLabel(status: ProjectResourceStatus | string): string {
		const map: Record<string, string> = {
			PLANNED: 'Planificado',
			ORDERED: 'Solicitado',
			IN_USE: 'En uso',
			COMPLETED: 'Completado',
			CANCELLED: 'Cancelado',
		}
		return map[status] ?? status
	}

	statusBadgeVariant(status: ProjectResourceStatus | string): BadgeVariant {
		const map: Record<string, BadgeVariant> = {
			PLANNED: 'planning',
			ORDERED: 'in-progress',
			IN_USE: 'completed',
			COMPLETED: 'custom',
			CANCELLED: 'delayed',
		}
		return (map[status] as BadgeVariant) ?? 'custom'
	}

	resourceStatusLabel(status: string): string {
		const map: Record<string, string> = {
			AVAILABLE: 'Disponible',
			IN_USE: 'En uso',
			MAINTENANCE: 'Mantenimiento',
			DEPLETED: 'Agotado',
		}
		return map[status] ?? status
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

	consumptionBarColor(percent: number): ProgressBarColor {
		if (percent >= 95) return 'danger'
		if (percent >= 75) return 'accent'
		return 'auto'
	}

	formatCurrency(amount: number, currency: string): string {
		return new Intl.NumberFormat('es-MX', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
	}

	formatNumber(n: number): string {
		return new Intl.NumberFormat('es-MX').format(n)
	}

	groupPlannedCost(items: MockProjectResource[]): number {
		return items.reduce((sum, pr) => sum + plannedCost(pr), 0)
	}
}
