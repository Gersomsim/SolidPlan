import { ProjectStageStatus } from '@org/util'

export interface MockProjectStage {
	id: string
	projectId: string
	templateId?: string
	order: number
	info: {
		name: string
		description?: string
		color: string
	}
	status: ProjectStageStatus
	dates: {
		plannedStartDate?: Date
		plannedEndDate?: Date
		actualStartDate?: Date
		actualEndDate?: Date
	}
	// Derived — computed from activities with this stageId
	activityCount: number
	completedActivityCount: number
	createdAt: Date
	updatedAt: Date
}

export const MOCK_PROJECT_STAGES: MockProjectStage[] = [
	{
		id: 's1',
		projectId: '1',
		templateId: 'st2',
		order: 1,
		info: {
			name: 'Cimientos',
			description: 'Excavación, armado y vaciado de la estructura de cimentación del edificio.',
			color: '#92400E',
		},
		status: 'COMPLETED',
		dates: {
			plannedStartDate: new Date('2024-03-15'),
			plannedEndDate: new Date('2024-06-30'),
			actualStartDate: new Date('2024-03-15'),
			actualEndDate: new Date('2024-06-28'),
		},
		activityCount: 4,
		completedActivityCount: 4,
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2024-06-28'),
	},
	{
		id: 's2',
		projectId: '1',
		templateId: 'st3',
		order: 2,
		info: {
			name: 'Estructura',
			description: 'Construcción del sistema estructural: columnas, trabes, losas y muros de carga.',
			color: '#F59E0B',
		},
		status: 'IN_PROGRESS',
		dates: {
			plannedStartDate: new Date('2024-07-01'),
			plannedEndDate: new Date('2025-06-30'),
			actualStartDate: new Date('2024-07-01'),
		},
		activityCount: 8,
		completedActivityCount: 3,
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2025-03-20'),
	},
	{
		id: 's3',
		projectId: '1',
		templateId: 'st4',
		order: 3,
		info: {
			name: 'Instalaciones',
			description: 'Instalaciones hidrosanitarias, eléctricas, especiales y de gas.',
			color: '#3B82F6',
		},
		status: 'PENDING',
		dates: {
			plannedStartDate: new Date('2025-07-01'),
			plannedEndDate: new Date('2025-12-31'),
		},
		activityCount: 6,
		completedActivityCount: 0,
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2024-01-10'),
	},
	{
		id: 's4',
		projectId: '1',
		templateId: 'st5',
		order: 4,
		info: {
			name: 'Muros y divisiones',
			description: 'Levantamiento de muros, tabiques, divisiones interiores y exteriores.',
			color: '#10B981',
		},
		status: 'PENDING',
		dates: {
			plannedStartDate: new Date('2026-01-01'),
			plannedEndDate: new Date('2026-04-30'),
		},
		activityCount: 5,
		completedActivityCount: 0,
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2024-01-10'),
	},
	{
		id: 's5',
		projectId: '1',
		templateId: 'st6',
		order: 5,
		info: {
			name: 'Acabados',
			description: 'Pintura, pisos, recubrimientos, carpintería y herrería de detalle.',
			color: '#8B5CF6',
		},
		status: 'PENDING',
		dates: {
			plannedStartDate: new Date('2026-05-01'),
			plannedEndDate: new Date('2026-07-31'),
		},
		activityCount: 7,
		completedActivityCount: 0,
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2024-01-10'),
	},
	{
		id: 's6',
		projectId: '1',
		templateId: 'st7',
		order: 6,
		info: {
			name: 'Entrega',
			description: 'Limpieza general, pruebas de funcionamiento, entrega de documentación y llaves.',
			color: '#06B6D4',
		},
		status: 'PENDING',
		dates: {
			plannedStartDate: new Date('2026-08-01'),
			plannedEndDate: new Date('2026-08-15'),
		},
		activityCount: 3,
		completedActivityCount: 0,
		createdAt: new Date('2024-01-10'),
		updatedAt: new Date('2024-01-10'),
	},
]

export const STAGE_PRESET_COLORS = [
	{ label: 'Pizarra',   hex: '#64748B' },
	{ label: 'Café',      hex: '#92400E' },
	{ label: 'Ámbar',     hex: '#F59E0B' },
	{ label: 'Naranja',   hex: '#F97316' },
	{ label: 'Rojo',      hex: '#EF4444' },
	{ label: 'Violeta',   hex: '#8B5CF6' },
	{ label: 'Azul',      hex: '#3B82F6' },
	{ label: 'Cian',      hex: '#06B6D4' },
	{ label: 'Esmeralda', hex: '#10B981' },
	{ label: 'Lima',      hex: '#84CC16' },
]
