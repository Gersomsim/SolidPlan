import { ClassificationType, ProjectResourceStatus, ResourceStatus } from '@org/util'

// ── Tenant catalog (Resource + ClassificationResource inline) ──
export interface MockClassification {
	id: string
	type: ClassificationType
	name: string
	unitOfMeasure: string
}

export interface MockResource {
	id: string
	tenantId: string
	identification: { sku: string; name: string; description?: string }
	classification: MockClassification
	classificationId: string
	costing: { unitCost: number; currency: string }
	inventory?: { currentStock: number; minimumStock?: number }
	status: ResourceStatus
	createdAt: Date
	updatedAt: Date
}

// ── Project resource (ProjectResource + denormalized Resource data) ──
export interface MockProjectResource {
	id: string
	tenantId: string
	projectId: string
	resourceId: string
	resource: MockResource // denormalized for display
	allocation: {
		plannedQuantity: number
		usedQuantity: number
		reservedQuantity: number
	}
	costingOverride?: { unitCost: number; currency: string }
	stageId?: string
	stageName?: string
	activityId?: string
	activityName?: string
	notes?: string
	status: ProjectResourceStatus
	requestedAt?: Date
	deliveredAt?: Date
	createdAt: Date
	updatedAt: Date
}

// ── Mock Classifications ───────────────────────────────────────
export const MOCK_CLASSIFICATIONS: MockClassification[] = [
	{ id: 'cls-1', type: 'MATERIAL', name: 'Concreto', unitOfMeasure: 'm³' },
	{ id: 'cls-2', type: 'MATERIAL', name: 'Acero de refuerzo', unitOfMeasure: 'kg' },
	{ id: 'cls-3', type: 'MATERIAL', name: 'Block / Tabique', unitOfMeasure: 'pza' },
	{ id: 'cls-4', type: 'MATERIAL', name: 'Pintura', unitOfMeasure: 'lt' },
	{ id: 'cls-5', type: 'EQUIPMENT', name: 'Maquinaria pesada', unitOfMeasure: 'día' },
	{ id: 'cls-6', type: 'EQUIPMENT', name: 'Herramienta menor', unitOfMeasure: 'día' },
	{ id: 'cls-7', type: 'LABOR', name: 'Mano de obra calificada', unitOfMeasure: 'jornal' },
	{ id: 'cls-8', type: 'LABOR', name: 'Mano de obra no calificada', unitOfMeasure: 'jornal' },
]

// ── Mock Tenant Resources ──────────────────────────────────────
export const MOCK_RESOURCES: MockResource[] = [
	{
		id: 'res-1',
		tenantId: 't1',
		identification: {
			sku: 'MAT-CON-001',
			name: "Concreto premezclado f'c=250",
			description: 'Concreto de resistencia 250 kg/cm² con impermeabilizante integral',
		},
		classification: MOCK_CLASSIFICATIONS[0],
		classificationId: 'cls-1',
		costing: { unitCost: 2100, currency: 'MXN' },
		inventory: { currentStock: 480, minimumStock: 50 },
		status: 'AVAILABLE',
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2025-03-01'),
	},
	{
		id: 'res-2',
		tenantId: 't1',
		identification: {
			sku: 'MAT-ACE-001',
			name: 'Varilla corrugada 3/8"',
			description: 'Varilla de acero corrugada ASTM A615 Gr.60',
		},
		classification: MOCK_CLASSIFICATIONS[1],
		classificationId: 'cls-2',
		costing: { unitCost: 18.5, currency: 'MXN' },
		inventory: { currentStock: 12000, minimumStock: 2000 },
		status: 'AVAILABLE',
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2025-02-15'),
	},
	{
		id: 'res-3',
		tenantId: 't1',
		identification: {
			sku: 'MAT-ACE-002',
			name: 'Varilla corrugada 1/2"',
			description: 'Varilla de acero corrugada ASTM A615 Gr.60',
		},
		classification: MOCK_CLASSIFICATIONS[1],
		classificationId: 'cls-2',
		costing: { unitCost: 32, currency: 'MXN' },
		inventory: { currentStock: 1400, minimumStock: 2000 },
		status: 'AVAILABLE',
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2025-03-10'),
	},
	{
		id: 'res-4',
		tenantId: 't1',
		identification: {
			sku: 'MAT-BLK-001',
			name: 'Block de concreto 15×20×40',
			description: 'Block hueco de concreto, resistencia 40 kg/cm²',
		},
		classification: MOCK_CLASSIFICATIONS[2],
		classificationId: 'cls-3',
		costing: { unitCost: 8.5, currency: 'MXN' },
		inventory: { currentStock: 0, minimumStock: 500 },
		status: 'DEPLETED',
		createdAt: new Date('2024-02-01'),
		updatedAt: new Date('2025-03-20'),
	},
	{
		id: 'res-5',
		tenantId: 't1',
		identification: {
			sku: 'MAT-PIN-001',
			name: 'Pintura vinílica blanca',
			description: 'Pintura de alta calidad para interiores',
		},
		classification: MOCK_CLASSIFICATIONS[3],
		classificationId: 'cls-4',
		costing: { unitCost: 95, currency: 'MXN' },
		inventory: { currentStock: 340, minimumStock: 100 },
		status: 'AVAILABLE',
		createdAt: new Date('2024-03-01'),
		updatedAt: new Date('2025-01-20'),
	},
	{
		id: 'res-6',
		tenantId: 't1',
		identification: {
			sku: 'EQP-MAQ-001',
			name: 'Bomba de concreto BPL 1600',
			description: 'Bomba estacionaria de concreto, capacidad 90 m³/h',
		},
		classification: MOCK_CLASSIFICATIONS[4],
		classificationId: 'cls-5',
		costing: { unitCost: 8500, currency: 'MXN' },
		status: 'IN_USE',
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2025-03-25'),
	},
	{
		id: 'res-7',
		tenantId: 't1',
		identification: {
			sku: 'EQP-MAQ-002',
			name: 'Grúa torre Liebherr 65K',
			description: 'Grúa torre, altura máxima 65m, carga máx. 8 ton',
		},
		classification: MOCK_CLASSIFICATIONS[4],
		classificationId: 'cls-5',
		costing: { unitCost: 22000, currency: 'MXN' },
		status: 'IN_USE',
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2025-03-25'),
	},
	{
		id: 'res-8',
		tenantId: 't1',
		identification: {
			sku: 'EQP-HER-001',
			name: 'Vibrador de inmersión 2"',
			description: 'Vibrador eléctrico para compactación de concreto',
		},
		classification: MOCK_CLASSIFICATIONS[5],
		classificationId: 'cls-6',
		costing: { unitCost: 450, currency: 'MXN' },
		status: 'AVAILABLE',
		createdAt: new Date('2023-08-01'),
		updatedAt: new Date('2025-02-01'),
	},
	{
		id: 'res-9',
		tenantId: 't1',
		identification: {
			sku: 'LAB-CAL-001',
			name: 'Oficial albañil',
			description: 'Mano de obra calificada — albañilería en general',
		},
		classification: MOCK_CLASSIFICATIONS[6],
		classificationId: 'cls-7',
		costing: { unitCost: 680, currency: 'MXN' },
		status: 'AVAILABLE',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2025-01-01'),
	},
	{
		id: 'res-10',
		tenantId: 't1',
		identification: {
			sku: 'LAB-CAL-002',
			name: 'Maestro de obras',
			description: 'Maestro de obras con experiencia en construcción vertical',
		},
		classification: MOCK_CLASSIFICATIONS[6],
		classificationId: 'cls-7',
		costing: { unitCost: 1200, currency: 'MXN' },
		status: 'AVAILABLE',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2025-01-01'),
	},
	{
		id: 'res-11',
		tenantId: 't1',
		identification: {
			sku: 'LAB-NOC-001',
			name: 'Peón de obra',
			description: 'Ayudante general, manejo de materiales y limpieza',
		},
		classification: MOCK_CLASSIFICATIONS[7],
		classificationId: 'cls-8',
		costing: { unitCost: 380, currency: 'MXN' },
		status: 'AVAILABLE',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2025-01-01'),
	},
]

// ── Mock ProjectResources for project '1' ─────────────────────
export const MOCK_PROJECT_RESOURCES: MockProjectResource[] = [
	{
		id: 'pr-1',
		tenantId: 't1',
		projectId: '1',
		resourceId: 'res-1',
		resource: MOCK_RESOURCES[0],
		allocation: { plannedQuantity: 600, usedQuantity: 312, reservedQuantity: 80 },
		stageId: 'est',
		stageName: 'Estructura',
		notes: 'Proveedor CEMEX, entrega cada lunes y jueves',
		status: 'IN_USE',
		requestedAt: new Date('2024-07-01'),
		deliveredAt: new Date('2024-07-03'),
		createdAt: new Date('2024-06-15'),
		updatedAt: new Date('2025-03-27'),
	},
	{
		id: 'pr-2',
		tenantId: 't1',
		projectId: '1',
		resourceId: 'res-2',
		resource: MOCK_RESOURCES[1],
		allocation: { plannedQuantity: 85000, usedQuantity: 46200, reservedQuantity: 12000 },
		stageId: 'est',
		stageName: 'Estructura',
		status: 'IN_USE',
		requestedAt: new Date('2024-07-01'),
		deliveredAt: new Date('2024-07-02'),
		createdAt: new Date('2024-06-15'),
		updatedAt: new Date('2025-03-20'),
	},
	{
		id: 'pr-3',
		tenantId: 't1',
		projectId: '1',
		resourceId: 'res-3',
		resource: MOCK_RESOURCES[2],
		allocation: { plannedQuantity: 18000, usedQuantity: 10400, reservedQuantity: 3000 },
		stageId: 'est',
		stageName: 'Estructura',
		status: 'IN_USE',
		costingOverride: { unitCost: 30, currency: 'MXN' },
		notes: 'Precio especial por volumen acordado con proveedor Aceros Nacionales',
		requestedAt: new Date('2024-07-01'),
		deliveredAt: new Date('2024-07-02'),
		createdAt: new Date('2024-06-15'),
		updatedAt: new Date('2025-03-20'),
	},
	{
		id: 'pr-4',
		tenantId: 't1',
		projectId: '1',
		resourceId: 'res-4',
		resource: MOCK_RESOURCES[3],
		allocation: { plannedQuantity: 45000, usedQuantity: 0, reservedQuantity: 0 },
		stageId: 'mur',
		stageName: 'Muros y divisiones',
		status: 'PLANNED',
		notes: 'Pendiente para etapa de muros. Solicitar con 3 semanas de anticipación.',
		createdAt: new Date('2024-06-15'),
		updatedAt: new Date('2025-01-10'),
	},
	{
		id: 'pr-5',
		tenantId: 't1',
		projectId: '1',
		resourceId: 'res-5',
		resource: MOCK_RESOURCES[4],
		allocation: { plannedQuantity: 2800, usedQuantity: 0, reservedQuantity: 0 },
		stageId: 'aca',
		stageName: 'Acabados',
		status: 'PLANNED',
		createdAt: new Date('2024-06-15'),
		updatedAt: new Date('2025-01-10'),
	},
	{
		id: 'pr-6',
		tenantId: 't1',
		projectId: '1',
		resourceId: 'res-6',
		resource: MOCK_RESOURCES[5],
		allocation: { plannedQuantity: 180, usedQuantity: 98, reservedQuantity: 30 },
		stageId: 'est',
		stageName: 'Estructura',
		status: 'IN_USE',
		requestedAt: new Date('2024-07-01'),
		deliveredAt: new Date('2024-07-01'),
		createdAt: new Date('2024-06-15'),
		updatedAt: new Date('2025-03-27'),
	},
	{
		id: 'pr-7',
		tenantId: 't1',
		projectId: '1',
		resourceId: 'res-7',
		resource: MOCK_RESOURCES[6],
		allocation: { plannedQuantity: 400, usedQuantity: 210, reservedQuantity: 60 },
		stageId: 'est',
		stageName: 'Estructura',
		status: 'IN_USE',
		requestedAt: new Date('2024-07-01'),
		deliveredAt: new Date('2024-07-01'),
		createdAt: new Date('2024-06-15'),
		updatedAt: new Date('2025-03-27'),
	},
	{
		id: 'pr-8',
		tenantId: 't1',
		projectId: '1',
		resourceId: 'res-9',
		resource: MOCK_RESOURCES[8],
		allocation: { plannedQuantity: 2400, usedQuantity: 1320, reservedQuantity: 240 },
		status: 'IN_USE',
		requestedAt: new Date('2024-03-15'),
		deliveredAt: new Date('2024-03-15'),
		createdAt: new Date('2024-03-01'),
		updatedAt: new Date('2025-03-27'),
	},
	{
		id: 'pr-9',
		tenantId: 't1',
		projectId: '1',
		resourceId: 'res-10',
		resource: MOCK_RESOURCES[9],
		allocation: { plannedQuantity: 480, usedQuantity: 264, reservedQuantity: 48 },
		status: 'IN_USE',
		requestedAt: new Date('2024-03-15'),
		deliveredAt: new Date('2024-03-15'),
		createdAt: new Date('2024-03-01'),
		updatedAt: new Date('2025-03-27'),
	},
	{
		id: 'pr-10',
		tenantId: 't1',
		projectId: '1',
		resourceId: 'res-11',
		resource: MOCK_RESOURCES[10],
		allocation: { plannedQuantity: 4800, usedQuantity: 2640, reservedQuantity: 480 },
		status: 'IN_USE',
		requestedAt: new Date('2024-03-15'),
		deliveredAt: new Date('2024-03-15'),
		createdAt: new Date('2024-03-01'),
		updatedAt: new Date('2025-03-27'),
	},
	{
		id: 'pr-11',
		tenantId: 't1',
		projectId: '1',
		resourceId: 'res-8',
		resource: MOCK_RESOURCES[7],
		allocation: { plannedQuantity: 120, usedQuantity: 65, reservedQuantity: 10 },
		stageId: 'est',
		stageName: 'Estructura',
		status: 'IN_USE',
		createdAt: new Date('2024-06-15'),
		updatedAt: new Date('2025-03-27'),
	},
]

export function getProjectResourceById(id: string): MockProjectResource | undefined {
	return MOCK_PROJECT_RESOURCES.find(r => r.id === id)
}

// ── Helpers ───────────────────────────────────────────────────
export function effectiveUnitCost(pr: MockProjectResource): number {
	return pr.costingOverride?.unitCost ?? pr.resource.costing.unitCost
}

export function effectiveCurrency(pr: MockProjectResource): string {
	return pr.costingOverride?.currency ?? pr.resource.costing.currency
}

export function plannedCost(pr: MockProjectResource): number {
	return effectiveUnitCost(pr) * pr.allocation.plannedQuantity
}

export function actualCost(pr: MockProjectResource): number {
	return effectiveUnitCost(pr) * pr.allocation.usedQuantity
}

export function consumptionPercent(pr: MockProjectResource): number {
	if (pr.allocation.plannedQuantity === 0) return 0
	return Math.round((pr.allocation.usedQuantity / pr.allocation.plannedQuantity) * 100)
}

export function isLowStock(pr: MockProjectResource): boolean {
	const res = pr.resource
	if (res.inventory == null) return false
	const { currentStock, minimumStock } = res.inventory
	if (currentStock == null || minimumStock == null) return false
	return currentStock < minimumStock
}

export function resourceIsLowStock(res: MockResource): boolean {
	if (!res.inventory) return false
	const { currentStock, minimumStock } = res.inventory
	if (minimumStock == null) return false
	return currentStock < minimumStock
}
