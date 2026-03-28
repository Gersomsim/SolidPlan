import { UserTenantRole } from '@org/util'

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_INVITE'

export interface MockTenantUser {
	id: string
	tenantRole: UserTenantRole
	status: UserStatus
	profile: {
		firstName: string
		lastName: string
		jobTitle: string
		avatarBg: string
	}
	auth: {
		email: string
	}
	projectCount: number
	createdAt: Date
	invitedAt?: Date
}

export const MOCK_TENANT_USERS: MockTenantUser[] = [
	{
		id: 'u1',
		tenantRole: 'TENANT_ADMIN',
		status: 'ACTIVE',
		profile: { firstName: 'Carlos',   lastName: 'Mendoza',   jobTitle: 'Director General',        avatarBg: '#1E3A5F' },
		auth: { email: 'carlos.mendoza@constructora.mx' },
		projectCount: 5,
		createdAt: new Date('2023-06-01'),
	},
	{
		id: 'u2',
		tenantRole: 'TENANT_ADMIN',
		status: 'ACTIVE',
		profile: { firstName: 'Ana',      lastName: 'Gutiérrez', jobTitle: 'Gerente de Proyectos',    avatarBg: '#10B981' },
		auth: { email: 'ana.gutierrez@constructora.mx' },
		projectCount: 4,
		createdAt: new Date('2023-06-01'),
	},
	{
		id: 'u3',
		tenantRole: 'MEMBER',
		status: 'ACTIVE',
		profile: { firstName: 'Roberto',  lastName: 'Torres',    jobTitle: 'Supervisor de Obra',      avatarBg: '#3B82F6' },
		auth: { email: 'roberto.torres@constructora.mx' },
		projectCount: 3,
		createdAt: new Date('2023-08-15'),
	},
	{
		id: 'u4',
		tenantRole: 'MEMBER',
		status: 'ACTIVE',
		profile: { firstName: 'María',    lastName: 'Hernández', jobTitle: 'Residente de Obra',       avatarBg: '#F59E0B' },
		auth: { email: 'maria.hernandez@constructora.mx' },
		projectCount: 2,
		createdAt: new Date('2023-09-01'),
	},
	{
		id: 'u5',
		tenantRole: 'MEMBER',
		status: 'ACTIVE',
		profile: { firstName: 'Jorge',    lastName: 'Ramírez',   jobTitle: 'Residente de Obra',       avatarBg: '#EF4444' },
		auth: { email: 'jorge.ramirez@constructora.mx' },
		projectCount: 2,
		createdAt: new Date('2023-10-10'),
	},
	{
		id: 'u6',
		tenantRole: 'MEMBER',
		status: 'ACTIVE',
		profile: { firstName: 'Patricia', lastName: 'López',     jobTitle: 'Arquitecta de Proyectos', avatarBg: '#06B6D4' },
		auth: { email: 'patricia.lopez@constructora.mx' },
		projectCount: 1,
		createdAt: new Date('2024-01-15'),
	},
	{
		id: 'u7',
		tenantRole: 'MEMBER',
		status: 'PENDING_INVITE',
		profile: { firstName: 'Daniel',   lastName: 'Morales',   jobTitle: 'Ingeniero Civil',         avatarBg: '#8B5CF6' },
		auth: { email: 'daniel.morales@constructora.mx' },
		projectCount: 0,
		createdAt: new Date('2024-03-01'),
		invitedAt: new Date('2024-03-01'),
	},
	{
		id: 'u8',
		tenantRole: 'MEMBER',
		status: 'PENDING_INVITE',
		profile: { firstName: 'Sofía',    lastName: 'Castro',    jobTitle: 'Coordinadora de Obra',    avatarBg: '#EC4899' },
		auth: { email: 'sofia.castro@constructora.mx' },
		projectCount: 0,
		createdAt: new Date('2024-03-10'),
		invitedAt: new Date('2024-03-10'),
	},
	{
		id: 'u9',
		tenantRole: 'MEMBER',
		status: 'INACTIVE',
		profile: { firstName: 'Luis',     lastName: 'Vega',      jobTitle: 'Supervisor de Obra',      avatarBg: '#64748B' },
		auth: { email: 'luis.vega@constructora.mx' },
		projectCount: 0,
		createdAt: new Date('2023-07-20'),
	},
]
