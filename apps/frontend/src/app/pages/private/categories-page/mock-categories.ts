export interface MockCategory {
	id: string
	name: string
	description?: string
	isArchived: boolean
	usageCount: number   // actividades que usan esta categoría
	createdAt: Date
	updatedAt: Date
}

export const MOCK_CATEGORIES: MockCategory[] = [
	{
		id: 'cat1',
		name: 'Albañilería',
		description: 'Trabajos de mampostería, muros, tabiques y morteros.',
		isArchived: false,
		usageCount: 23,
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2024-01-10'),
	},
	{
		id: 'cat2',
		name: 'Estructura',
		description: 'Columnas, trabes, losas, cimentaciones y elementos estructurales.',
		isArchived: false,
		usageCount: 18,
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2024-01-10'),
	},
	{
		id: 'cat3',
		name: 'Instalaciones Eléctricas',
		description: 'Red eléctrica, tableros, canalizaciones, luminarias y contactos.',
		isArchived: false,
		usageCount: 15,
		createdAt: new Date('2023-06-15'),
		updatedAt: new Date('2024-02-20'),
	},
	{
		id: 'cat4',
		name: 'Instalaciones Hidrosanitarias',
		description: 'Tuberías de agua potable, drenaje sanitario y pluvial.',
		isArchived: false,
		usageCount: 14,
		createdAt: new Date('2023-06-15'),
		updatedAt: new Date('2024-02-20'),
	},
	{
		id: 'cat5',
		name: 'Acabados',
		description: 'Pintura, pisos, recubrimientos, aplanados y detalles finales.',
		isArchived: false,
		usageCount: 21,
		createdAt: new Date('2023-07-01'),
		updatedAt: new Date('2024-03-15'),
	},
	{
		id: 'cat6',
		name: 'Carpintería',
		description: 'Puertas, marcos, closets, muebles de madera y acabados en madera.',
		isArchived: false,
		usageCount: 9,
		createdAt: new Date('2023-07-01'),
		updatedAt: new Date('2024-03-15'),
	},
	{
		id: 'cat7',
		name: 'Herrería',
		description: 'Ventanas, barandales, puertas metálicas, cancelería y estructuras de acero.',
		isArchived: false,
		usageCount: 7,
		createdAt: new Date('2023-08-01'),
		updatedAt: new Date('2024-04-01'),
	},
	{
		id: 'cat8',
		name: 'Topografía',
		description: 'Levantamiento, trazo, nivelación y replanteo del terreno.',
		isArchived: false,
		usageCount: 4,
		createdAt: new Date('2023-08-01'),
		updatedAt: new Date('2024-04-01'),
	},
	{
		id: 'cat9',
		name: 'Obra Civil',
		description: 'Pavimentos, guarniciones, banquetas, redes de infraestructura exterior.',
		isArchived: false,
		usageCount: 6,
		createdAt: new Date('2023-09-01'),
		updatedAt: new Date('2024-05-10'),
	},
	{
		id: 'cat10',
		name: 'Demolición',
		description: 'Derribo de estructuras, retiro de escombro y limpieza del sitio.',
		isArchived: true,
		usageCount: 2,
		createdAt: new Date('2023-09-01'),
		updatedAt: new Date('2024-06-01'),
	},
]
