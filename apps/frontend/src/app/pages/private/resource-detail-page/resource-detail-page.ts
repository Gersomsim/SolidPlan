import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { Router, RouterLink, ActivatedRoute } from '@angular/router'

import { Badge, BadgeVariant, Card, EmptyState, Icon, IconType, ProgressBar, StatCard } from '@org/ui'
import { ClassificationType, ProjectResourceStatus, ResourceStatus } from '@org/util'

import {
	MOCK_PROJECT_NAMES,
	MockProjectResource,
	actualCost,
	consumptionPercent,
	effectiveCurrency,
	effectiveUnitCost,
	getResourceById,
	getUsageByResourceId,
	plannedCost,
	resourceIsLowStock,
} from '../projects/pages/resources/mock-resources'

@Component({
	selector: 'app-resource-detail-page',
	standalone: true,
	imports: [CurrencyPipe, DatePipe, DecimalPipe, RouterLink, Badge, Card, EmptyState, Icon, ProgressBar, StatCard],
	templateUrl: './resource-detail-page.html',
})
export class ResourceDetailPage {
	private readonly route = inject(ActivatedRoute)
	private readonly router = inject(Router)

	private fmt(value: number, currency: string): string {
		return new Intl.NumberFormat('es-MX', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
	}

	readonly resource = computed(() => {
		const id = this.route.snapshot.paramMap.get('id') ?? ''
		return getResourceById(id) ?? null
	})

	readonly usage = computed(() => {
		const r = this.resource()
		if (!r) return []
		return getUsageByResourceId(r.id)
	})

	// ── Stats ─────────────────────────────────────────────────────
	readonly statValues = computed(() => {
		const r = this.resource()
		const s = this.stats()
		if (!r || !s) return null
		const cur = r.costing.currency
		return {
			unitCost:      this.fmt(r.costing.unitCost, cur),
			inventoryValue: this.fmt(s.inventoryValue ?? 0, cur),
			plannedCostSum: this.fmt(s.plannedCostSum, cur),
			usedCostSum:    this.fmt(s.usedCostSum, cur),
		}
	})

	readonly stats = computed(() => {
		const r = this.resource()
		const usages = this.usage()
		if (!r) return null

		const activeUsages   = usages.filter(u => u.status === 'IN_USE').length
		const plannedTotal   = usages.reduce((s, u) => s + u.allocation.plannedQuantity, 0)
		const usedTotal      = usages.reduce((s, u) => s + u.allocation.usedQuantity, 0)
		const plannedCostSum = usages.reduce((s, u) => s + plannedCost(u), 0)
		const usedCostSum    = usages.reduce((s, u) => s + actualCost(u), 0)
		const inventoryValue = r.inventory ? r.costing.unitCost * r.inventory.currentStock : null
		const isLow          = resourceIsLowStock(r)

		return { activeUsages, plannedTotal, usedTotal, plannedCostSum, usedCostSum, inventoryValue, isLow }
	})

	// ── Helpers ───────────────────────────────────────────────────
	projectName(projectId: string): string {
		return MOCK_PROJECT_NAMES[projectId] ?? `Proyecto ${projectId}`
	}

	consumptionPct(u: MockProjectResource): number {
		return consumptionPercent(u)
	}

	unitCost(u: MockProjectResource): number {
		return effectiveUnitCost(u)
	}

	currency(u: MockProjectResource): string {
		return effectiveCurrency(u)
	}

	hasOverride(u: MockProjectResource): boolean {
		return u.costingOverride != null
	}

	typeLabel(type: ClassificationType): string {
		return { MATERIAL: 'Material', EQUIPMENT: 'Equipo', LABOR: 'Mano de obra' }[type]
	}

	typeIcon(type: ClassificationType): IconType {
		return { MATERIAL: 'shopping-basket', EQUIPMENT: 'zap', LABOR: 'users' }[type] as IconType
	}

	typeBadgeVariant(type: ClassificationType): BadgeVariant {
		return { MATERIAL: 'in-progress', EQUIPMENT: 'planning', LABOR: 'delayed' }[type] as BadgeVariant
	}

	statusLabel(status: ResourceStatus): string {
		return { AVAILABLE: 'Disponible', IN_USE: 'En uso', MAINTENANCE: 'Mantenimiento', DEPLETED: 'Agotado' }[status]
	}

	statusBadgeVariant(status: ResourceStatus): BadgeVariant {
		return ({ AVAILABLE: 'completed', IN_USE: 'in-progress', MAINTENANCE: 'delayed', DEPLETED: 'custom' } as Record<ResourceStatus, BadgeVariant>)[status]
	}

	usageStatusLabel(status: ProjectResourceStatus): string {
		const map: Record<ProjectResourceStatus, string> = {
			PLANNED: 'Planificado', ORDERED: 'Solicitado', IN_USE: 'En uso', COMPLETED: 'Completado', CANCELLED: 'Cancelado',
		}
		return map[status]
	}

	usageStatusVariant(status: ProjectResourceStatus): BadgeVariant {
		const map: Record<ProjectResourceStatus, BadgeVariant> = {
			PLANNED: 'planning', ORDERED: 'in-progress', IN_USE: 'in-progress', COMPLETED: 'completed', CANCELLED: 'custom',
		}
		return map[status]
	}

	consumptionColor(pct: number): 'danger' | 'accent' | 'primary' {
		if (pct >= 90) return 'danger'
		if (pct >= 70) return 'accent'
		return 'primary'
	}

	goBack(): void {
		this.router.navigate(['/system/resources'])
	}
}
