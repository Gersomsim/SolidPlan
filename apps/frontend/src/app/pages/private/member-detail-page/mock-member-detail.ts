import { ActivityProgressType, ActivityStatus, ProjectMemberRole } from '@org/util'

export interface MemberActivityItem {
	id: string
	code: string
	name: string
	projectName: string
	projectId: string
	role: ProjectMemberRole
	status: ActivityStatus
	progress: number
	progressType: ActivityProgressType
	progressState?: string
	progressStateColor?: string
	category: string
	categoryColor: string
	startDate: Date
	endDate: Date
}

export interface MemberProjectItem {
	id: string
	name: string
	role: ProjectMemberRole
	projectStatus: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD'
	activitiesCount: number
	completedCount: number
	joinedAt: Date
}

export interface MemberLogItem {
	id: string
	projectName: string
	projectId: string
	date: Date
	title: string
	activitiesCount: number
	photosCount: number
	hasObservations: boolean
}

export interface MemberDetailData {
	userId: string
	projects: MemberProjectItem[]
	activeActivities: MemberActivityItem[]
	completedActivities: MemberActivityItem[]
	recentLogs: MemberLogItem[]
}

export const MOCK_MEMBER_DETAILS: MemberDetailData[] = [
	// ── u1: Carlos Mendoza — Director General ─────────────────────
	{
		userId: 'u1',
		projects: [
			{ id: 'p1', name: 'Edificio Residencial Alameda', role: 'ADMIN',      projectStatus: 'ACTIVE',     activitiesCount: 42, completedCount: 18, joinedAt: new Date('2023-06-01') },
			{ id: 'p2', name: 'Centro Comercial Poniente',    role: 'ADMIN',      projectStatus: 'ACTIVE',     activitiesCount: 31, completedCount: 12, joinedAt: new Date('2023-08-15') },
			{ id: 'p3', name: 'Parque Industrial Norte',      role: 'ADMIN',      projectStatus: 'ACTIVE',     activitiesCount: 27, completedCount: 9,  joinedAt: new Date('2024-01-10') },
			{ id: 'p4', name: 'Bodega Logística Sur',         role: 'ADMIN',      projectStatus: 'COMPLETED',  activitiesCount: 19, completedCount: 19, joinedAt: new Date('2023-03-01') },
			{ id: 'p5', name: 'Plaza Médica Las Torres',      role: 'ADMIN',      projectStatus: 'ON_HOLD',    activitiesCount: 15, completedCount: 5,  joinedAt: new Date('2024-02-20') },
		],
		activeActivities: [
			{ id: 'aa1', code: 'ARQ-02', name: 'Planos arquitectónicos', projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'ADMIN', status: 'IN_PROGRESS', progress: 85, progressType: 'PERCENTAGE', category: 'Diseño', categoryColor: '#3B82F6', startDate: new Date('2024-01-22'), endDate: new Date('2024-02-23') },
			{ id: 'aa2', code: 'EST-01', name: 'Cimentación general',    projectName: 'Centro Comercial Poniente',    projectId: 'p2', role: 'ADMIN', status: 'IN_PROGRESS', progress: 60, progressType: 'PERCENTAGE', category: 'Estructura', categoryColor: '#F59E0B', startDate: new Date('2024-02-01'), endDate: new Date('2024-03-15') },
			{ id: 'aa3', code: 'ING-03', name: 'Memoria de cálculo',     projectName: 'Parque Industrial Norte',      projectId: 'p3', role: 'ADMIN', status: 'PENDING',     progress: 0,  progressType: 'PERCENTAGE', category: 'Diseño', categoryColor: '#3B82F6', startDate: new Date('2024-03-01'), endDate: new Date('2024-03-20') },
		],
		completedActivities: [
			{ id: 'ca1', code: 'ARQ-01', name: 'Levantamiento topográfico', projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'ADMIN', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Topografía', categoryColor: '#8B5CF6', startDate: new Date('2024-01-08'), endDate: new Date('2024-01-19') },
			{ id: 'ca2', code: 'DOC-01', name: 'Permisos de construcción', projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'ADMIN', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Diseño', categoryColor: '#3B82F6', startDate: new Date('2023-11-01'), endDate: new Date('2023-12-15') },
			{ id: 'ca3', code: 'ALL-01', name: 'Trazo y nivelación',       projectName: 'Bodega Logística Sur',        projectId: 'p4', role: 'ADMIN', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Topografía', categoryColor: '#8B5CF6', startDate: new Date('2023-04-01'), endDate: new Date('2023-04-10') },
		],
		recentLogs: [
			{ id: 'l1', projectName: 'Edificio Residencial Alameda', projectId: 'p1', date: new Date('2024-03-25'), title: 'Avance de planos y revisión de fachada', activitiesCount: 3, photosCount: 8, hasObservations: false },
			{ id: 'l2', projectName: 'Centro Comercial Poniente',    projectId: 'p2', date: new Date('2024-03-22'), title: 'Revisión de cimentación y ajuste de presupuesto', activitiesCount: 2, photosCount: 5, hasObservations: true },
			{ id: 'l3', projectName: 'Parque Industrial Norte',      projectId: 'p3', date: new Date('2024-03-18'), title: 'Inicio de trabajos de topografía', activitiesCount: 1, photosCount: 4, hasObservations: false },
			{ id: 'l4', projectName: 'Edificio Residencial Alameda', projectId: 'p1', date: new Date('2024-03-15'), title: 'Reunión de coordinación de obra', activitiesCount: 0, photosCount: 2, hasObservations: false },
		],
	},

	// ── u2: Ana Gutiérrez — Gerente de Proyectos ──────────────────
	{
		userId: 'u2',
		projects: [
			{ id: 'p1', name: 'Edificio Residencial Alameda', role: 'ADMIN',      projectStatus: 'ACTIVE',    activitiesCount: 42, completedCount: 18, joinedAt: new Date('2023-06-01') },
			{ id: 'p2', name: 'Centro Comercial Poniente',    role: 'SUPERVISOR', projectStatus: 'ACTIVE',    activitiesCount: 31, completedCount: 12, joinedAt: new Date('2023-08-15') },
			{ id: 'p3', name: 'Parque Industrial Norte',      role: 'SUPERVISOR', projectStatus: 'ACTIVE',    activitiesCount: 27, completedCount: 9,  joinedAt: new Date('2024-01-10') },
			{ id: 'p6', name: 'Hospital Regional Oriente',    role: 'ADMIN',      projectStatus: 'ON_HOLD',   activitiesCount: 22, completedCount: 7,  joinedAt: new Date('2023-12-01') },
		],
		activeActivities: [
			{ id: 'aa4', code: 'ARQ-03', name: 'Especificaciones técnicas', projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'ADMIN', status: 'IN_PROGRESS', progress: 70, progressType: 'PERCENTAGE', category: 'Diseño', categoryColor: '#3B82F6', startDate: new Date('2024-02-10'), endDate: new Date('2024-03-10') },
			{ id: 'aa5', code: 'COO-01', name: 'Coordinación de subcontratos', projectName: 'Centro Comercial Poniente', projectId: 'p2', role: 'SUPERVISOR', status: 'IN_PROGRESS', progress: 45, progressType: 'PERCENTAGE', category: 'Obra Civil', categoryColor: '#64748B', startDate: new Date('2024-02-20'), endDate: new Date('2024-04-30') },
		],
		completedActivities: [
			{ id: 'ca4', code: 'DOC-02', name: 'Estudio de impacto urbano', projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'ADMIN', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Diseño', categoryColor: '#3B82F6', startDate: new Date('2023-10-01'), endDate: new Date('2023-11-15') },
			{ id: 'ca5', code: 'GES-01', name: 'Plan de gestión del proyecto', projectName: 'Centro Comercial Poniente', projectId: 'p2', role: 'SUPERVISOR', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Diseño', categoryColor: '#3B82F6', startDate: new Date('2023-08-15'), endDate: new Date('2023-09-05') },
		],
		recentLogs: [
			{ id: 'l5', projectName: 'Edificio Residencial Alameda', projectId: 'p1', date: new Date('2024-03-24'), title: 'Seguimiento de especificaciones y coordinación', activitiesCount: 2, photosCount: 6, hasObservations: false },
			{ id: 'l6', projectName: 'Centro Comercial Poniente',    projectId: 'p2', date: new Date('2024-03-20'), title: 'Reunión con subcontratistas de estructuras', activitiesCount: 3, photosCount: 10, hasObservations: true },
			{ id: 'l7', projectName: 'Parque Industrial Norte',      projectId: 'p3', date: new Date('2024-03-12'), title: 'Revisión de avance semanal', activitiesCount: 1, photosCount: 3, hasObservations: false },
		],
	},

	// ── u3: Roberto Torres — Supervisor de Obra ───────────────────
	{
		userId: 'u3',
		projects: [
			{ id: 'p1', name: 'Edificio Residencial Alameda', role: 'SUPERVISOR', projectStatus: 'ACTIVE',    activitiesCount: 42, completedCount: 18, joinedAt: new Date('2023-06-15') },
			{ id: 'p2', name: 'Centro Comercial Poniente',    role: 'SUPERVISOR', projectStatus: 'ACTIVE',    activitiesCount: 31, completedCount: 12, joinedAt: new Date('2023-09-01') },
			{ id: 'p4', name: 'Bodega Logística Sur',         role: 'SUPERVISOR', projectStatus: 'COMPLETED', activitiesCount: 19, completedCount: 19, joinedAt: new Date('2023-03-15') },
		],
		activeActivities: [
			{ id: 'aa6', code: 'ALB-01', name: 'Muros exteriores nivel 1', projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'SUPERVISOR', status: 'IN_PROGRESS', progress: 55, progressType: 'PERCENTAGE', category: 'Albañilería', categoryColor: '#92400E', startDate: new Date('2024-02-15'), endDate: new Date('2024-04-10') },
			{ id: 'aa7', code: 'EST-02', name: 'Columnas nivel 2', projectName: 'Centro Comercial Poniente', projectId: 'p2', role: 'SUPERVISOR', status: 'IN_PROGRESS', progress: 30, progressType: 'PERCENTAGE', category: 'Estructura', categoryColor: '#F59E0B', startDate: new Date('2024-03-01'), endDate: new Date('2024-04-30') },
			{ id: 'aa8', code: 'ACB-01', name: 'Revisión de acabados baño principal', projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'SUPERVISOR', status: 'BLOCKED', progress: 20, progressType: 'PERCENTAGE', category: 'Acabados', categoryColor: '#EC4899', startDate: new Date('2024-03-05'), endDate: new Date('2024-03-20') },
		],
		completedActivities: [
			{ id: 'ca6', code: 'EST-01', name: 'Cimentación profunda', projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'SUPERVISOR', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Estructura', categoryColor: '#F59E0B', startDate: new Date('2024-01-20'), endDate: new Date('2024-02-10') },
			{ id: 'ca7', code: 'BOD-04', name: 'Losa de cubierta', projectName: 'Bodega Logística Sur', projectId: 'p4', role: 'SUPERVISOR', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Estructura', categoryColor: '#F59E0B', startDate: new Date('2023-08-01'), endDate: new Date('2023-09-15') },
			{ id: 'ca8', code: 'BOD-05', name: 'Instalaciones eléctricas', projectName: 'Bodega Logística Sur', projectId: 'p4', role: 'SUPERVISOR', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Instalaciones', categoryColor: '#10B981', startDate: new Date('2023-09-20'), endDate: new Date('2023-11-01') },
		],
		recentLogs: [
			{ id: 'l8',  projectName: 'Edificio Residencial Alameda', projectId: 'p1', date: new Date('2024-03-26'), title: 'Avance de albañilería nivel 1 y supervisión de materiales', activitiesCount: 2, photosCount: 14, hasObservations: true },
			{ id: 'l9',  projectName: 'Centro Comercial Poniente',    projectId: 'p2', date: new Date('2024-03-25'), title: 'Colado de columnas grids A-C', activitiesCount: 1, photosCount: 9, hasObservations: false },
			{ id: 'l10', projectName: 'Edificio Residencial Alameda', projectId: 'p1', date: new Date('2024-03-21'), title: 'Revisión de estructuras y observaciones en andamiaje', activitiesCount: 3, photosCount: 7, hasObservations: true },
			{ id: 'l11', projectName: 'Edificio Residencial Alameda', projectId: 'p1', date: new Date('2024-03-18'), title: 'Colocación de block en fachada norte', activitiesCount: 1, photosCount: 11, hasObservations: false },
			{ id: 'l12', projectName: 'Centro Comercial Poniente',    projectId: 'p2', date: new Date('2024-03-14'), title: 'Levantamiento de muros de contención', activitiesCount: 2, photosCount: 8, hasObservations: false },
		],
	},

	// ── u4: María Hernández — Residente de Obra ───────────────────
	{
		userId: 'u4',
		projects: [
			{ id: 'p1', name: 'Edificio Residencial Alameda', role: 'RESIDENT', projectStatus: 'ACTIVE',   activitiesCount: 42, completedCount: 18, joinedAt: new Date('2023-09-01') },
			{ id: 'p3', name: 'Parque Industrial Norte',      role: 'RESIDENT', projectStatus: 'ACTIVE',   activitiesCount: 27, completedCount: 9,  joinedAt: new Date('2024-01-15') },
		],
		activeActivities: [
			{ id: 'aa9',  code: 'ACB-02', name: 'Aplanados interiores',   projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'RESIDENT', status: 'IN_PROGRESS', progress: 40, progressType: 'PERCENTAGE', category: 'Acabados', categoryColor: '#EC4899', startDate: new Date('2024-03-01'), endDate: new Date('2024-04-15') },
			{ id: 'aa10', code: 'IND-01', name: 'Preparación del terreno', projectName: 'Parque Industrial Norte', projectId: 'p3', role: 'RESIDENT', status: 'IN_PROGRESS', progress: 65, progressType: 'PERCENTAGE', category: 'Obra Civil', categoryColor: '#64748B', startDate: new Date('2024-02-20'), endDate: new Date('2024-03-30') },
		],
		completedActivities: [
			{ id: 'ca9',  code: 'ALB-02', name: 'Tabiques interiores',  projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'RESIDENT', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Albañilería', categoryColor: '#92400E', startDate: new Date('2024-01-15'), endDate: new Date('2024-02-20') },
			{ id: 'ca10', code: 'ALB-03', name: 'Barda perimetral',     projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'RESIDENT', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Albañilería', categoryColor: '#92400E', startDate: new Date('2023-12-01'), endDate: new Date('2024-01-10') },
		],
		recentLogs: [
			{ id: 'l13', projectName: 'Edificio Residencial Alameda', projectId: 'p1', date: new Date('2024-03-26'), title: 'Aplanados de cuartos 301-310 y pasillo norte', activitiesCount: 2, photosCount: 10, hasObservations: false },
			{ id: 'l14', projectName: 'Parque Industrial Norte',      projectId: 'p3', date: new Date('2024-03-24'), title: 'Compactación de terreno y nivelación de subrasante', activitiesCount: 1, photosCount: 6, hasObservations: true },
			{ id: 'l15', projectName: 'Edificio Residencial Alameda', projectId: 'p1', date: new Date('2024-03-20'), title: 'Revisión de acabados en baños nivel 2', activitiesCount: 1, photosCount: 8, hasObservations: true },
		],
	},

	// ── u5: Jorge Ramírez — Residente de Obra ─────────────────────
	{
		userId: 'u5',
		projects: [
			{ id: 'p2', name: 'Centro Comercial Poniente', role: 'RESIDENT', projectStatus: 'ACTIVE', activitiesCount: 31, completedCount: 12, joinedAt: new Date('2023-10-15') },
			{ id: 'p5', name: 'Plaza Médica Las Torres',   role: 'RESIDENT', projectStatus: 'ON_HOLD', activitiesCount: 15, completedCount: 5, joinedAt: new Date('2024-02-20') },
		],
		activeActivities: [
			{ id: 'aa11', code: 'EST-03', name: 'Losas de entrepiso',   projectName: 'Centro Comercial Poniente', projectId: 'p2', role: 'RESIDENT', status: 'IN_PROGRESS', progress: 50, progressType: 'PERCENTAGE', category: 'Estructura', categoryColor: '#F59E0B', startDate: new Date('2024-03-01'), endDate: new Date('2024-04-20') },
			{ id: 'aa12', code: 'INS-01', name: 'Red hidráulica planta baja', projectName: 'Centro Comercial Poniente', projectId: 'p2', role: 'RESIDENT', status: 'IN_PROGRESS', progress: 25, progressType: 'PERCENTAGE', category: 'Instalaciones', categoryColor: '#10B981', startDate: new Date('2024-03-10'), endDate: new Date('2024-04-30') },
		],
		completedActivities: [
			{ id: 'ca11', code: 'EST-00', name: 'Firme de concreto', projectName: 'Centro Comercial Poniente', projectId: 'p2', role: 'RESIDENT', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Estructura', categoryColor: '#F59E0B', startDate: new Date('2024-01-10'), endDate: new Date('2024-02-05') },
		],
		recentLogs: [
			{ id: 'l16', projectName: 'Centro Comercial Poniente', projectId: 'p2', date: new Date('2024-03-25'), title: 'Colado de losa de entrepiso eje 4-6', activitiesCount: 1, photosCount: 12, hasObservations: false },
			{ id: 'l17', projectName: 'Centro Comercial Poniente', projectId: 'p2', date: new Date('2024-03-21'), title: 'Inicio de instalaciones hidráulicas planta baja', activitiesCount: 2, photosCount: 7, hasObservations: false },
		],
	},

	// ── u6: Patricia López — Arquitecta ───────────────────────────
	{
		userId: 'u6',
		projects: [
			{ id: 'p1', name: 'Edificio Residencial Alameda', role: 'SUPERVISOR', projectStatus: 'ACTIVE', activitiesCount: 42, completedCount: 18, joinedAt: new Date('2024-01-15') },
		],
		activeActivities: [
			{ id: 'aa13', code: 'ARQ-04', name: 'Renders y presentación ejecutiva', projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'SUPERVISOR', status: 'IN_PROGRESS', progress: 60, progressType: 'PERCENTAGE', category: 'Diseño', categoryColor: '#3B82F6', startDate: new Date('2024-02-25'), endDate: new Date('2024-03-20') },
		],
		completedActivities: [
			{ id: 'ca12', code: 'ARQ-01A', name: 'Planos de fachadas', projectName: 'Edificio Residencial Alameda', projectId: 'p1', role: 'SUPERVISOR', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Diseño', categoryColor: '#3B82F6', startDate: new Date('2024-01-20'), endDate: new Date('2024-02-10') },
		],
		recentLogs: [
			{ id: 'l18', projectName: 'Edificio Residencial Alameda', projectId: 'p1', date: new Date('2024-03-19'), title: 'Revisión de renders con cliente y ajustes de diseño', activitiesCount: 1, photosCount: 4, hasObservations: false },
		],
	},

	// ── u7: Daniel Morales — PENDING_INVITE ───────────────────────
	{ userId: 'u7', projects: [], activeActivities: [], completedActivities: [], recentLogs: [] },

	// ── u8: Sofía Castro — PENDING_INVITE ────────────────────────
	{ userId: 'u8', projects: [], activeActivities: [], completedActivities: [], recentLogs: [] },

	// ── u9: Luis Vega — INACTIVE (datos históricos) ───────────────
	{
		userId: 'u9',
		projects: [
			{ id: 'p4', name: 'Bodega Logística Sur', role: 'SUPERVISOR', projectStatus: 'COMPLETED', activitiesCount: 19, completedCount: 19, joinedAt: new Date('2023-03-01') },
		],
		activeActivities: [],
		completedActivities: [
			{ id: 'ca13', code: 'BOD-01', name: 'Cimentación Bodega', projectName: 'Bodega Logística Sur', projectId: 'p4', role: 'SUPERVISOR', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Estructura', categoryColor: '#F59E0B', startDate: new Date('2023-04-01'), endDate: new Date('2023-05-15') },
			{ id: 'ca14', code: 'BOD-02', name: 'Estructura metálica',  projectName: 'Bodega Logística Sur', projectId: 'p4', role: 'SUPERVISOR', status: 'COMPLETED', progress: 100, progressType: 'PERCENTAGE', category: 'Estructura', categoryColor: '#F59E0B', startDate: new Date('2023-05-20'), endDate: new Date('2023-07-10') },
		],
		recentLogs: [
			{ id: 'l19', projectName: 'Bodega Logística Sur', projectId: 'p4', date: new Date('2023-11-10'), title: 'Entrega de obra y cierre de bitácora', activitiesCount: 0, photosCount: 5, hasObservations: false },
		],
	},
]
