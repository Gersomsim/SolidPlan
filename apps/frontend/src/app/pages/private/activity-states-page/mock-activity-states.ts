export interface MockActivityState {
	id: string
	name: string
	color: string
	order: number
	isFinal: boolean
	isDefault: boolean
	usageCount: number   // actividades que usan este estado
	createdAt: Date
	updatedAt: Date
}

export const MOCK_ACTIVITY_STATES: MockActivityState[] = [
	{
		id: 'as1',
		name: 'Por iniciar',
		color: '#64748B',
		order: 1,
		isFinal: false,
		isDefault: true,
		usageCount: 34,
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2024-01-10'),
	},
	{
		id: 'as2',
		name: 'En proceso',
		color: '#3B82F6',
		order: 2,
		isFinal: false,
		isDefault: false,
		usageCount: 18,
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2024-01-10'),
	},
	{
		id: 'as3',
		name: 'Pausado',
		color: '#F59E0B',
		order: 3,
		isFinal: false,
		isDefault: false,
		usageCount: 5,
		createdAt: new Date('2023-06-15'),
		updatedAt: new Date('2024-02-20'),
	},
	{
		id: 'as4',
		name: 'En revisión',
		color: '#8B5CF6',
		order: 4,
		isFinal: false,
		isDefault: false,
		usageCount: 9,
		createdAt: new Date('2023-06-15'),
		updatedAt: new Date('2024-02-20'),
	},
	{
		id: 'as5',
		name: 'Observado',
		color: '#F97316',
		order: 5,
		isFinal: false,
		isDefault: false,
		usageCount: 4,
		createdAt: new Date('2023-07-01'),
		updatedAt: new Date('2024-03-10'),
	},
	{
		id: 'as6',
		name: 'Aprobado',
		color: '#10B981',
		order: 6,
		isFinal: true,
		isDefault: false,
		usageCount: 11,
		createdAt: new Date('2023-07-01'),
		updatedAt: new Date('2024-03-10'),
	},
	{
		id: 'as7',
		name: 'Terminado',
		color: '#06B6D4',
		order: 7,
		isFinal: true,
		isDefault: false,
		usageCount: 21,
		createdAt: new Date('2023-08-01'),
		updatedAt: new Date('2024-04-01'),
	},
	{
		id: 'as8',
		name: 'Cancelado',
		color: '#EF4444',
		order: 8,
		isFinal: true,
		isDefault: false,
		usageCount: 3,
		createdAt: new Date('2023-08-01'),
		updatedAt: new Date('2024-04-01'),
	},
]

export const STATE_PRESET_COLORS = [
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
