import { Weather } from '@org/util'

export interface MockDailyLog {
	id: string
	projectId: string
	activityIds: string[]   // linked activities (empty = general project log)
	authorId: string
	authorName: string
	authorRole: 'ADMIN' | 'SUPERVISOR' | 'RESIDENT' | 'VIEWER'
	reportDate: Date

	content: {
		title: string
		description: string
		incidents?: string
		observations?: string
	}

	metrics: {
		headcount: number
		workingHours: number
		machineryInUse: string[]
	}

	evidence: {
		mediaIds: string[]
		documentIds?: string[]
	}

	environment: {
		weather: Weather
		temperature?: number
	}

	isLocked: boolean
	createdAt: Date
	updatedAt: Date
}

export const MOCK_DAILY_LOGS: MockDailyLog[] = [
	{
		id: 'log-001',
		projectId: '1',
		activityIds: ['col', 'vis'],
		authorId: 'u1',
		authorName: 'Carlos Mendoza',
		authorRole: 'RESIDENT',
		reportDate: new Date('2025-03-27'),
		content: {
			title: 'Colado de columnas nivel 8',
			description:
				'Se completó el colado de 6 columnas del nivel 8 en el eje A-D. Mezcla de concreto f\'c=250 kg/cm² suministrada por CEMEX, llegó a las 7:20am. Vibrado correcto y curado iniciado al cierre.',
			incidents:
				'Pequeño retraso de 40 min por falla en la bomba de concreto (manguera desgastada). Se resolvió con refacción en almacén.',
			observations:
				'Revisar nivel de vigas del eje E antes del siguiente colado. Solicitar concreto 24h antes al proveedor.',
		},
		metrics: {
			headcount: 18,
			workingHours: 96,
			machineryInUse: ['Bomba de concreto BPL 1600', 'Grúa torre Liebherr 65K'],
		},
		evidence: {
			mediaIds: ['file-001', 'file-002', 'file-003'],
		},
		environment: { weather: 'CLEAR', temperature: 22 },
		isLocked: true,
		createdAt: new Date('2025-03-27T18:30:00'),
		updatedAt: new Date('2025-03-27T18:30:00'),
	},
	{
		id: 'log-002',
		projectId: '1',
		activityIds: ['enc'],
		authorId: 'u2',
		authorName: 'Patricia López',
		authorRole: 'SUPERVISOR',
		reportDate: new Date('2025-03-26'),
		content: {
			title: 'Encofrado nivel 8 – eje E a J',
			description:
				'Se instaló encofrado metálico en 12 elementos verticales del eje E–J, nivel 8. Plomadas verificadas con nivel láser. Amarres y alineación revisados por superintendente.',
		},
		metrics: {
			headcount: 14,
			workingHours: 112,
			machineryInUse: ['Andamio escalera telescópica'],
		},
		evidence: {
			mediaIds: ['file-004', 'file-005'],
		},
		environment: { weather: 'OVERCAST', temperature: 19 },
		isLocked: true,
		createdAt: new Date('2025-03-26T17:45:00'),
		updatedAt: new Date('2025-03-26T17:45:00'),
	},
	{
		id: 'log-003',
		projectId: '1',
		activityIds: ['ins-hid', 'ins-ele'],
		authorId: 'u1',
		authorName: 'Carlos Mendoza',
		authorRole: 'RESIDENT',
		reportDate: new Date('2025-03-25'),
		content: {
			title: 'Instalaciones hidráulicas y eléctricas piso 6',
			description:
				'Avance en tubería de cobre para agua fría y caliente en departamentos 601–612. Cuadrilla eléctrica tendiendo canalización conduit EMT en losa.',
			incidents:
				'Inspector de obra detectó discrepancia en plano hidráulico vs. obra: ramal de 1/2" faltante en baño del dpto. 608. Se notificó a coordinador BIM para RFI urgente.',
		},
		metrics: {
			headcount: 22,
			workingHours: 176,
			machineryInUse: [],
		},
		evidence: {
			mediaIds: ['file-006'],
			documentIds: ['doc-001'],
		},
		environment: { weather: 'CLEAR', temperature: 24 },
		isLocked: false,
		createdAt: new Date('2025-03-25T19:00:00'),
		updatedAt: new Date('2025-03-25T19:10:00'),
	},
	{
		id: 'log-004',
		projectId: '1',
		activityIds: [],
		authorId: 'u2',
		authorName: 'Patricia López',
		authorRole: 'SUPERVISOR',
		reportDate: new Date('2025-03-24'),
		content: {
			title: 'Inspección general y reunión de coordinación',
			description:
				'Visita de propietario y equipo de arquitectura. Revisión general del avance en niveles 5–7. Reunión de coordinación con contratistas de instalaciones y acabados.',
			observations:
				'Propietario aprobó cambio de acabado en lobby: cantera gris → porcelanato 120×120. Ajustar especificaciones.',
		},
		metrics: {
			headcount: 5,
			workingHours: 40,
			machineryInUse: [],
		},
		evidence: {
			mediaIds: ['file-007', 'file-008'],
			documentIds: ['doc-002'],
		},
		environment: { weather: 'CLEAR', temperature: 23 },
		isLocked: true,
		createdAt: new Date('2025-03-24T15:20:00'),
		updatedAt: new Date('2025-03-24T15:20:00'),
	},
	{
		id: 'log-005',
		projectId: '1',
		activityIds: ['col', 'vis'],
		authorId: 'u1',
		authorName: 'Carlos Mendoza',
		authorRole: 'RESIDENT',
		reportDate: new Date('2025-03-21'),
		content: {
			title: 'Colado de losa nivel 7',
			description:
				'Se coló la losa del nivel 7 completa (área 480 m²). Concreto premezclado f\'c=250 con impermeabilizante integral. Proceso ininterrumpido de 6.5h. Curado con compuesto líquido Darakur 2000.',
		},
		metrics: {
			headcount: 24,
			workingHours: 192,
			machineryInUse: ['Bomba de concreto BPL 1600', 'Vibrador de inmersión ×4'],
		},
		evidence: {
			mediaIds: ['file-009', 'file-010', 'file-011'],
		},
		environment: { weather: 'CLEAR', temperature: 21 },
		isLocked: true,
		createdAt: new Date('2025-03-21T20:00:00'),
		updatedAt: new Date('2025-03-21T20:00:00'),
	},
	{
		id: 'log-006',
		projectId: '1',
		activityIds: ['ins-hid'],
		authorId: 'u3',
		authorName: 'Ramón Torres',
		authorRole: 'RESIDENT',
		reportDate: new Date('2025-03-20'),
		content: {
			title: 'Prueba hidrostática redes pisos 4–5',
			description:
				'Prueba hidrostática satisfactoria en redes de agua fría/caliente pisos 4 y 5. Presión de prueba: 7 kg/cm² por 4 horas. Sin fugas detectadas.',
			observations:
				'Piso 3 aún pendiente de prueba; programar para el viernes.',
		},
		metrics: {
			headcount: 8,
			workingHours: 64,
			machineryInUse: ['Bomba de prueba hidrostática'],
		},
		evidence: {
			mediaIds: ['file-012'],
			documentIds: ['doc-003'],
		},
		environment: { weather: 'OVERCAST', temperature: 18 },
		isLocked: true,
		createdAt: new Date('2025-03-20T16:00:00'),
		updatedAt: new Date('2025-03-20T16:00:00'),
	},
	{
		id: 'log-007',
		projectId: '1',
		activityIds: [],
		authorId: 'u1',
		authorName: 'Carlos Mendoza',
		authorRole: 'RESIDENT',
		reportDate: new Date('2025-03-19'),
		content: {
			title: 'Paro por condiciones climáticas',
			description:
				'Suspensión de trabajos en exteriores y en altura por lluvia intensa y viento mayor a 40 km/h. Personal reubicado en trabajos interiores de nivel 3.',
			incidents:
				'Pequeña inundación en sótano 2 por tapa de drenaje obstruida. Se despejó y bombeó el agua en 1.5h.',
		},
		metrics: {
			headcount: 10,
			workingHours: 40,
			machineryInUse: ['Bomba de achique'],
		},
		evidence: {
			mediaIds: ['file-013'],
		},
		environment: { weather: 'RAIN', temperature: 14 },
		isLocked: false,
		createdAt: new Date('2025-03-19T14:00:00'),
		updatedAt: new Date('2025-03-19T14:30:00'),
	},
	{
		id: 'log-008',
		projectId: '1',
		activityIds: ['enc', 'col'],
		authorId: 'u2',
		authorName: 'Patricia López',
		authorRole: 'SUPERVISOR',
		reportDate: new Date('2025-03-18'),
		content: {
			title: 'Avance encofrado y armado nivel 8',
			description:
				'Armado de vigas principales en nivel 8 al 60%. Encofrado de trabe VN-801 terminado. Se inspeccionó amarre de acero: diámetros y separaciones conforme a proyecto.',
		},
		metrics: {
			headcount: 20,
			workingHours: 160,
			machineryInUse: ['Grúa torre Liebherr 65K'],
		},
		evidence: {
			mediaIds: ['file-014', 'file-015'],
		},
		environment: { weather: 'CLEAR', temperature: 20 },
		isLocked: true,
		createdAt: new Date('2025-03-18T17:30:00'),
		updatedAt: new Date('2025-03-18T17:30:00'),
	},
]

export function getLogById(id: string): MockDailyLog | undefined {
	return MOCK_DAILY_LOGS.find(l => l.id === id)
}

export function getLogsByActivityId(activityId: string): MockDailyLog[] {
	return MOCK_DAILY_LOGS.filter(l => l.activityIds.includes(activityId))
}
