import { Permission, Role } from '@org/util'

// ─── Extended mock: role + assigned users ────────────────────────────────────

export interface MockRoleUser {
	id: string
	firstName: string
	lastName: string
	email: string
	jobTitle: string
	avatarBg: string
	status: 'ACTIVE' | 'INACTIVE' | 'PENDING_INVITE'
}

export interface MockRole extends Role {
	description: string
	users: MockRoleUser[]
	createdAt: Date
	updatedAt: Date
}

// ─── Shared users pool ────────────────────────────────────────────────────────

const USERS: Record<string, MockRoleUser> = {
	u1: { id: 'u1', firstName: 'Carlos',   lastName: 'Mendoza',   email: 'carlos.mendoza@constructora.mx',   jobTitle: 'Director General',        avatarBg: '#1E3A5F', status: 'ACTIVE' },
	u2: { id: 'u2', firstName: 'Ana',      lastName: 'Gutiérrez', email: 'ana.gutierrez@constructora.mx',   jobTitle: 'Gerente de Proyectos',    avatarBg: '#10B981', status: 'ACTIVE' },
	u3: { id: 'u3', firstName: 'Roberto',  lastName: 'Torres',    email: 'roberto.torres@constructora.mx',  jobTitle: 'Supervisor de Obra',      avatarBg: '#3B82F6', status: 'ACTIVE' },
	u4: { id: 'u4', firstName: 'María',    lastName: 'Hernández', email: 'maria.hernandez@constructora.mx', jobTitle: 'Residente de Obra',       avatarBg: '#F59E0B', status: 'ACTIVE' },
	u5: { id: 'u5', firstName: 'Jorge',    lastName: 'Ramírez',   email: 'jorge.ramirez@constructora.mx',   jobTitle: 'Residente de Obra',       avatarBg: '#EF4444', status: 'ACTIVE' },
	u6: { id: 'u6', firstName: 'Patricia', lastName: 'López',     email: 'patricia.lopez@constructora.mx',  jobTitle: 'Arquitecta de Proyectos', avatarBg: '#06B6D4', status: 'ACTIVE' },
	u7: { id: 'u7', firstName: 'Daniel',   lastName: 'Morales',   email: 'daniel.morales@constructora.mx',  jobTitle: 'Ingeniero Civil',         avatarBg: '#8B5CF6', status: 'PENDING_INVITE' },
	u8: { id: 'u8', firstName: 'Sofía',    lastName: 'Castro',    email: 'sofia.castro@constructora.mx',    jobTitle: 'Coordinadora de Obra',    avatarBg: '#EC4899', status: 'PENDING_INVITE' },
	u9: { id: 'u9', firstName: 'Luis',     lastName: 'Vega',      email: 'luis.vega@constructora.mx',       jobTitle: 'Supervisor de Obra',      avatarBg: '#64748B', status: 'INACTIVE' },
}

// ─── Mock roles ───────────────────────────────────────────────────────────────

export const MOCK_ROLES: MockRole[] = [
	{
		id: 'role-tenant-admin',
		tenantId: 'tenant-1',
		name: 'Administrador',
		description: 'Acceso total a la organización. Puede gestionar usuarios, proyectos, configuración y facturación.',
		scope: 'TENANT',
		isSystemDefault: true,
		users: [USERS['u1'], USERS['u2']],
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2024-01-10'),
		permissions: [
			{ resource: 'PROJECTS',        action: 'MANAGE' },
			{ resource: 'DAILY_LOGS',      action: 'MANAGE' },
			{ resource: 'SCHEDULE',        action: 'MANAGE' },
			{ resource: 'MEMBERS',         action: 'MANAGE' },
			{ resource: 'ROLES',           action: 'MANAGE' },
			{ resource: 'STAGE_TEMPLATES', action: 'MANAGE' },
			{ resource: 'CATEGORIES',      action: 'MANAGE' },
			{ resource: 'ACTIVITY_STATES', action: 'MANAGE' },
			{ resource: 'RESOURCES',       action: 'MANAGE' },
			{ resource: 'SYSTEM_CONFIG',   action: 'MANAGE' },
			{ resource: 'BILLING',         action: 'MANAGE' },
			{ resource: 'REPORTS',         action: 'MANAGE' },
		],
	},
	{
		id: 'role-member',
		tenantId: 'tenant-1',
		name: 'Miembro',
		description: 'Acceso estándar de miembro. Opera según su rol en cada proyecto.',
		scope: 'TENANT',
		isSystemDefault: true,
		users: [USERS['u3'], USERS['u4'], USERS['u5'], USERS['u6'], USERS['u7'], USERS['u8'], USERS['u9']],
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2024-01-10'),
		permissions: [
			{ resource: 'PROJECTS',        action: 'READ' },
			{ resource: 'DAILY_LOGS',      action: 'READ' },
			{ resource: 'DAILY_LOGS',      action: 'CREATE' },
			{ resource: 'SCHEDULE',        action: 'READ' },
			{ resource: 'RESOURCES',       action: 'READ' },
			{ resource: 'REPORTS',         action: 'READ' },
		],
	},
	{
		id: 'role-supervisor',
		tenantId: 'tenant-1',
		name: 'Supervisor de obra',
		description: 'Supervisa proyectos en campo. Puede aprobar bitácoras y gestionar actividades.',
		scope: 'PROJECT',
		isSystemDefault: true,
		users: [USERS['u3'], USERS['u9']],
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2023-11-20'),
		permissions: [
			{ resource: 'PROJECTS',   action: 'READ' },
			{ resource: 'DAILY_LOGS', action: 'READ' },
			{ resource: 'DAILY_LOGS', action: 'CREATE' },
			{ resource: 'DAILY_LOGS', action: 'UPDATE' },
			{ resource: 'SCHEDULE',   action: 'READ' },
			{ resource: 'SCHEDULE',   action: 'UPDATE' },
			{ resource: 'RESOURCES',  action: 'READ' },
		],
	},
	{
		id: 'role-resident',
		tenantId: 'tenant-1',
		name: 'Residente de obra',
		description: 'Residente en campo. Crea bitácoras, registra avances y sube evidencias fotográficas.',
		scope: 'PROJECT',
		isSystemDefault: true,
		users: [USERS['u4'], USERS['u5']],
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2023-11-20'),
		permissions: [
			{ resource: 'PROJECTS',   action: 'READ' },
			{ resource: 'DAILY_LOGS', action: 'READ' },
			{ resource: 'DAILY_LOGS', action: 'CREATE' },
			{ resource: 'SCHEDULE',   action: 'READ' },
			{ resource: 'RESOURCES',  action: 'READ' },
		],
	},
	{
		id: 'role-viewer',
		tenantId: 'tenant-1',
		name: 'Observador',
		description: 'Acceso de solo lectura al proyecto. Ideal para clientes y stakeholders externos.',
		scope: 'PROJECT',
		isSystemDefault: true,
		users: [USERS['u6'], USERS['u7'], USERS['u8']],
		createdAt: new Date('2023-06-01'),
		updatedAt: new Date('2023-11-20'),
		permissions: [
			{ resource: 'PROJECTS',   action: 'READ' },
			{ resource: 'DAILY_LOGS', action: 'READ' },
			{ resource: 'SCHEDULE',   action: 'READ' },
		],
	},
	{
		id: 'role-planner',
		tenantId: 'tenant-1',
		name: 'Planificador',
		description: 'Rol personalizado para planificadores. Acceso completo a cronogramas y recursos, sin gestión de usuarios.',
		scope: 'TENANT',
		isSystemDefault: false,
		users: [USERS['u2'], USERS['u6']],
		createdAt: new Date('2024-02-01'),
		updatedAt: new Date('2024-02-15'),
		permissions: [
			{ resource: 'PROJECTS',        action: 'READ' },
			{ resource: 'PROJECTS',        action: 'UPDATE' },
			{ resource: 'SCHEDULE',        action: 'MANAGE' },
			{ resource: 'RESOURCES',       action: 'MANAGE' },
			{ resource: 'STAGE_TEMPLATES', action: 'READ' },
			{ resource: 'STAGE_TEMPLATES', action: 'CREATE' },
			{ resource: 'STAGE_TEMPLATES', action: 'UPDATE' },
			{ resource: 'REPORTS',         action: 'READ' },
		],
	},
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Devuelve si un rol tiene un permiso específico. */
export function hasPermission(role: MockRole, resource: Permission['resource'], action: Permission['action']): boolean {
	return role.permissions.some(p => p.resource === resource && p.action === action)
		|| role.permissions.some(p => p.resource === resource && p.action === 'MANAGE')
}
