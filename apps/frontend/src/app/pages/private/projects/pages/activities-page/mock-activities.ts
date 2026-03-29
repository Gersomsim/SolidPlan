import { ActivityProgressType, ActivityStatus } from '@org/util'

export interface MockActivity {
	id: string
	parentId?: string
	stageId?: string   // FK a ProjectStage — opcional
	stageName?: string // Denormalizado para display
	code: string
	name: string
	description?: string
	category: string
	categoryColor: string
	assignedRole: string
	startDate: Date
	endDate: Date
	durationDays: number
	progressType: ActivityProgressType
	progress: number
	progressState?: string
	progressStateColor?: string
	status: ActivityStatus
	isCriticalPath: boolean
}

export const MOCK_ACTIVITIES: MockActivity[] = [
	// ── ARQ: Arquitectura ────────────────────────────────────────
	{
		id: 'arq', code: 'ARQ', name: 'Arquitectura',
		description: 'Conjunto de actividades relacionadas al diseño arquitectónico del proyecto, incluyendo planos, memorias y especificaciones.',
		category: 'Diseño', categoryColor: '#3B82F6',
		assignedRole: 'SUPERVISOR',
		startDate: new Date('2024-01-08'), endDate: new Date('2024-03-15'), durationDays: 67,
		progressType: 'PERCENTAGE', progress: 72, status: 'IN_PROGRESS', isCriticalPath: false,
	},
	{
		id: 'arq-01', parentId: 'arq', code: 'ARQ-01', name: 'Levantamiento topográfico',
		description: 'Medición y registro preciso del terreno para establecer la base del proyecto.',
		category: 'Topografía', categoryColor: '#8B5CF6',
		assignedRole: 'RESIDENT',
		startDate: new Date('2024-01-08'), endDate: new Date('2024-01-19'), durationDays: 11,
		progressType: 'PERCENTAGE', progress: 100, status: 'COMPLETED', isCriticalPath: true,
	},
	{
		id: 'arq-02', parentId: 'arq', code: 'ARQ-02', name: 'Planos arquitectónicos',
		description: 'Elaboración de planos completos de la edificación: planta baja, alta, fachadas y cortes.',
		category: 'Diseño', categoryColor: '#3B82F6',
		assignedRole: 'SUPERVISOR',
		startDate: new Date('2024-01-22'), endDate: new Date('2024-02-23'), durationDays: 32,
		progressType: 'PERCENTAGE', progress: 85, status: 'IN_PROGRESS', isCriticalPath: true,
	},
	{
		id: 'arq-02a', parentId: 'arq-02', code: 'ARQ-02A', name: 'Planta baja',
		description: 'Distribución de espacios y elementos estructurales del nivel 0.',
		category: 'Diseño', categoryColor: '#3B82F6',
		assignedRole: 'RESIDENT',
		startDate: new Date('2024-01-22'), endDate: new Date('2024-02-02'), durationDays: 11,
		progressType: 'STATE', progress: 100, progressState: 'APROBADO', progressStateColor: '#2F855A', status: 'COMPLETED', isCriticalPath: false,
	},
	{
		id: 'arq-02b', parentId: 'arq-02', code: 'ARQ-02B', name: 'Planta alta',
		description: 'Distribución de espacios del nivel 1, incluyendo escaleras y accesos verticales.',
		category: 'Diseño', categoryColor: '#3B82F6',
		assignedRole: 'RESIDENT',
		startDate: new Date('2024-02-05'), endDate: new Date('2024-02-16'), durationDays: 11,
		progressType: 'STATE', progress: 60, progressState: 'EN REVISIÓN', progressStateColor: '#F59E0B', status: 'IN_PROGRESS', isCriticalPath: false,
	},
	{
		id: 'arq-02c', parentId: 'arq-02', code: 'ARQ-02C', name: 'Fachadas y cortes',
		description: 'Representación de las elevaciones exteriores y secciones transversales del edificio.',
		category: 'Diseño', categoryColor: '#3B82F6',
		assignedRole: 'RESIDENT',
		startDate: new Date('2024-02-19'), endDate: new Date('2024-02-23'), durationDays: 4,
		progressType: 'STATE', progress: 0, progressState: 'PENDIENTE', progressStateColor: '#718096', status: 'PENDING', isCriticalPath: false,
	},
	{
		id: 'arq-03', parentId: 'arq', code: 'ARQ-03', name: 'Memorias descriptivas',
		description: 'Documentación técnica escrita que justifica y describe las decisiones de diseño arquitectónico.',
		category: 'Documentación', categoryColor: '#0EA5E9',
		assignedRole: 'SUPERVISOR',
		startDate: new Date('2024-02-26'), endDate: new Date('2024-03-15'), durationDays: 18,
		progressType: 'PERCENTAGE', progress: 30, status: 'IN_PROGRESS', isCriticalPath: false,
	},

	// ── EST: Estructura ──────────────────────────────────────────
	{
		id: 'est', code: 'EST', name: 'Estructura', stageId: 's2', stageName: 'Estructura',
		description: 'Actividades relacionadas al análisis, diseño y construcción del sistema estructural del edificio.',
		category: 'Obra civil', categoryColor: '#F59E0B',
		assignedRole: 'ADMIN',
		startDate: new Date('2024-03-18'), endDate: new Date('2024-06-28'), durationDays: 102,
		progressType: 'PERCENTAGE', progress: 45, status: 'IN_PROGRESS', isCriticalPath: true,
	},
	{
		id: 'est-01', parentId: 'est', stageId: 's2', stageName: 'Estructura', code: 'EST-01', name: 'Estudio de suelos',
		description: 'Análisis geotécnico del terreno para determinar la capacidad portante y tipo de cimentación.',
		category: 'Topografía', categoryColor: '#8B5CF6',
		assignedRole: 'SUPERVISOR',
		startDate: new Date('2024-03-18'), endDate: new Date('2024-03-29'), durationDays: 11,
		progressType: 'PERCENTAGE', progress: 100, status: 'COMPLETED', isCriticalPath: true,
	},
	{
		id: 'est-02', parentId: 'est', stageId: 's2', stageName: 'Estructura', code: 'EST-02', name: 'Cimentación',
		description: 'Construcción del sistema de cimentación según el tipo definido en el estudio de suelos.',
		category: 'Obra civil', categoryColor: '#F59E0B',
		assignedRole: 'RESIDENT',
		startDate: new Date('2024-04-01'), endDate: new Date('2024-05-17'), durationDays: 46,
		progressType: 'PERCENTAGE', progress: 62, status: 'IN_PROGRESS', isCriticalPath: true,
	},
	{
		id: 'est-02a', parentId: 'est-02', stageId: 's2', stageName: 'Estructura', code: 'EST-02A', name: 'Excavación y trazo',
		description: 'Preparación del terreno mediante excavación hasta la profundidad de desplante.',
		category: 'Obra civil', categoryColor: '#F59E0B',
		assignedRole: 'RESIDENT',
		startDate: new Date('2024-04-01'), endDate: new Date('2024-04-19'), durationDays: 18,
		progressType: 'PERCENTAGE', progress: 100, status: 'COMPLETED', isCriticalPath: true,
	},
	{
		id: 'est-02b', parentId: 'est-02', stageId: 's2', stageName: 'Estructura', code: 'EST-02B', name: 'Armado de acero',
		description: 'Habilitación y colocación de armadura de acero para la cimentación.',
		category: 'Estructural', categoryColor: '#EF4444',
		assignedRole: 'RESIDENT',
		startDate: new Date('2024-04-22'), endDate: new Date('2024-05-03'), durationDays: 12,
		progressType: 'PERCENTAGE', progress: 80, status: 'IN_PROGRESS', isCriticalPath: true,
	},
	{
		id: 'est-02c', parentId: 'est-02', stageId: 's2', stageName: 'Estructura', code: 'EST-02C', name: 'Vaciado de concreto',
		description: 'Vaciado y curado del concreto en cimientos. Bloqueado por falta de aprobación de armadura.',
		category: 'Estructural', categoryColor: '#EF4444',
		assignedRole: 'RESIDENT',
		startDate: new Date('2024-05-06'), endDate: new Date('2024-05-17'), durationDays: 12,
		progressType: 'PERCENTAGE', progress: 0, status: 'BLOCKED', isCriticalPath: true,
	},
	{
		id: 'est-03', parentId: 'est', stageId: 's2', stageName: 'Estructura', code: 'EST-03', name: 'Estructura metálica',
		description: 'Fabricación, transporte e instalación de la estructura metálica principal del edificio.',
		category: 'Estructural', categoryColor: '#EF4444',
		assignedRole: 'SUPERVISOR',
		startDate: new Date('2024-05-20'), endDate: new Date('2024-06-28'), durationDays: 39,
		progressType: 'PERCENTAGE', progress: 0, status: 'PENDING', isCriticalPath: true,
	},

	// ── INS: Instalaciones ───────────────────────────────────────
	{
		id: 'ins', stageId: 's3', stageName: 'Instalaciones', code: 'INS', name: 'Instalaciones',
		description: 'Instalaciones técnicas del edificio: sistemas eléctricos, hidráulicos y sanitarios.',
		category: 'Instalaciones', categoryColor: '#10B981',
		assignedRole: 'ADMIN',
		startDate: new Date('2024-06-03'), endDate: new Date('2024-08-16'), durationDays: 74,
		progressType: 'PERCENTAGE', progress: 0, status: 'PENDING', isCriticalPath: false,
	},
	{
		id: 'ins-01', parentId: 'ins', stageId: 's3', stageName: 'Instalaciones', code: 'INS-01', name: 'Instalación eléctrica',
		description: 'Sistema eléctrico completo: tablero principal, circuitos, iluminación y contactos.',
		category: 'Eléctrico', categoryColor: '#F59E0B',
		assignedRole: 'RESIDENT',
		startDate: new Date('2024-06-03'), endDate: new Date('2024-07-12'), durationDays: 39,
		progressType: 'PERCENTAGE', progress: 0, status: 'PENDING', isCriticalPath: false,
	},
	{
		id: 'ins-01a', parentId: 'ins-01', stageId: 's3', stageName: 'Instalaciones', code: 'INS-01A', name: 'Tablero principal',
		description: 'Instalación del tablero de distribución principal y circuitos derivados.',
		category: 'Eléctrico', categoryColor: '#F59E0B',
		assignedRole: 'RESIDENT',
		startDate: new Date('2024-06-03'), endDate: new Date('2024-06-14'), durationDays: 11,
		progressType: 'PERCENTAGE', progress: 0, status: 'PENDING', isCriticalPath: false,
	},
	{
		id: 'ins-01b', parentId: 'ins-01', stageId: 's3', stageName: 'Instalaciones', code: 'INS-01B', name: 'Ductos y cableado',
		description: 'Instalación de ductos conduit y tendido de cables para todos los circuitos.',
		category: 'Eléctrico', categoryColor: '#F59E0B',
		assignedRole: 'RESIDENT',
		startDate: new Date('2024-06-17'), endDate: new Date('2024-07-12'), durationDays: 25,
		progressType: 'PERCENTAGE', progress: 0, status: 'PENDING', isCriticalPath: false,
	},
	{
		id: 'ins-02', parentId: 'ins', stageId: 's3', stageName: 'Instalaciones', code: 'INS-02', name: 'Instalación hidráulica',
		description: 'Sistema hidráulico y sanitario: cisternas, tuberías, muebles y accesorios.',
		category: 'Hidráulico', categoryColor: '#06B6D4',
		assignedRole: 'SUPERVISOR',
		startDate: new Date('2024-07-15'), endDate: new Date('2024-08-16'), durationDays: 32,
		progressType: 'PERCENTAGE', progress: 0, status: 'PENDING', isCriticalPath: false,
	},
]

export function getActivityById(id: string): MockActivity | undefined {
	return MOCK_ACTIVITIES.find(a => a.id === id)
}

export function getChildActivities(parentId: string): MockActivity[] {
	return MOCK_ACTIVITIES.filter(a => a.parentId === parentId)
}

export function buildActivityTree(
	activities: MockActivity[],
): (MockActivity & { children: MockActivity[] })[] {
	const map = new Map<string, MockActivity & { children: MockActivity[] }>()
	activities.forEach(a => map.set(a.id, { ...a, children: [] }))
	const roots: (MockActivity & { children: MockActivity[] })[] = []
	map.forEach(node => {
		if (node.parentId) {
			map.get(node.parentId)?.children.push(node)
		} else {
			roots.push(node)
		}
	})
	return roots
}
