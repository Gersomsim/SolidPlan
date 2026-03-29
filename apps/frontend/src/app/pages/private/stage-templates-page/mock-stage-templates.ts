export interface MockStageTemplate {
	id: string
	name: string
	description?: string
	color: string
	isArchived: boolean
	usageCount: number   // proyectos que usan esta plantilla
	createdAt: Date
	updatedAt: Date
}

export const MOCK_STAGE_TEMPLATES: MockStageTemplate[] = [
	{
		id: 'st1',
		name: 'Preliminares',
		description: 'Trabajos previos a la obra: permisos, topografía, trazo y nivelación del terreno.',
		color: '#64748B',
		isArchived: false,
		usageCount: 7,
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2024-01-10'),
	},
	{
		id: 'st2',
		name: 'Cimentación',
		description: 'Excavación, armado y vaciado de la estructura de cimentación del edificio.',
		color: '#92400E',
		isArchived: false,
		usageCount: 5,
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2024-01-10'),
	},
	{
		id: 'st3',
		name: 'Estructura',
		description: 'Construcción del sistema estructural: columnas, trabes, losas y muros de carga.',
		color: '#F59E0B',
		isArchived: false,
		usageCount: 5,
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2024-01-10'),
	},
	{
		id: 'st4',
		name: 'Instalaciones',
		description: 'Instalaciones hidrosanitarias, eléctricas, especiales y de gas.',
		color: '#3B82F6',
		isArchived: false,
		usageCount: 4,
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2024-03-15'),
	},
	{
		id: 'st5',
		name: 'Muros y divisiones',
		description: 'Levantamiento de muros, tabiques, divisiones interiores y exteriores.',
		color: '#10B981',
		isArchived: false,
		usageCount: 4,
		createdAt: new Date('2023-08-01'),
		updatedAt: new Date('2024-03-15'),
	},
	{
		id: 'st6',
		name: 'Acabados',
		description: 'Pintura, pisos, recubrimientos, carpintería y herrería de detalle.',
		color: '#8B5CF6',
		isArchived: false,
		usageCount: 3,
		createdAt: new Date('2023-08-01'),
		updatedAt: new Date('2024-03-15'),
	},
	{
		id: 'st7',
		name: 'Entrega',
		description: 'Limpieza general, pruebas de funcionamiento, entrega de documentación y llaves.',
		color: '#06B6D4',
		isArchived: false,
		usageCount: 3,
		createdAt: new Date('2023-08-01'),
		updatedAt: new Date('2024-03-15'),
	},
	{
		id: 'st8',
		name: 'Demolición',
		description: 'Derribo de estructuras existentes, retiro de escombro y limpieza del sitio.',
		color: '#EF4444',
		isArchived: true,
		usageCount: 1,
		createdAt: new Date('2023-09-01'),
		updatedAt: new Date('2024-06-01'),
	},
]

export const PRESET_COLORS = [
	{ label: 'Pizarra',   hex: '#64748B' },
	{ label: 'Café',      hex: '#92400E' },
	{ label: 'Ámbar',     hex: '#F59E0B' },
	{ label: 'Naranja',   hex: '#F97316' },
	{ label: 'Rojo',      hex: '#EF4444' },
	{ label: 'Rosa',      hex: '#EC4899' },
	{ label: 'Violeta',   hex: '#8B5CF6' },
	{ label: 'Azul',      hex: '#3B82F6' },
	{ label: 'Cian',      hex: '#06B6D4' },
	{ label: 'Esmeralda', hex: '#10B981' },
	{ label: 'Lima',      hex: '#84CC16' },
	{ label: 'Gris',      hex: '#9CA3AF' },
]
