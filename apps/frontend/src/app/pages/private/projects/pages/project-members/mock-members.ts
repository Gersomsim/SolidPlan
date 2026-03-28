import { ProjectMemberRole } from '@org/util'

export interface MockUser {
	id: string
	name: string
	email: string
	initials: string
	avatarBg: string
}

export interface MockProjectMember {
	id: string
	projectId: string
	userId: string
	user: MockUser
	role: ProjectMemberRole
	assignedAt: Date
	assignedByName: string
}

const ALL_TENANT_USERS: MockUser[] = [
	{ id: 'u1', name: 'Carlos Mendoza',   email: 'carlos.mendoza@constructora.mx',   initials: 'CM', avatarBg: '#3B82F6' },
	{ id: 'u2', name: 'Ana Gutiérrez',    email: 'ana.gutierrez@constructora.mx',    initials: 'AG', avatarBg: '#10B981' },
	{ id: 'u3', name: 'Roberto Torres',   email: 'roberto.torres@constructora.mx',   initials: 'RT', avatarBg: '#8B5CF6' },
	{ id: 'u4', name: 'María Hernández',  email: 'maria.hernandez@constructora.mx',  initials: 'MH', avatarBg: '#F59E0B' },
	{ id: 'u5', name: 'Jorge Ramírez',    email: 'jorge.ramirez@constructora.mx',    initials: 'JR', avatarBg: '#EF4444' },
	{ id: 'u6', name: 'Patricia López',   email: 'patricia.lopez@constructora.mx',   initials: 'PL', avatarBg: '#06B6D4' },
	{ id: 'u7', name: 'Daniel Morales',   email: 'daniel.morales@constructora.mx',   initials: 'DM', avatarBg: '#EC4899' },
	{ id: 'u8', name: 'Sofía Castro',     email: 'sofia.castro@constructora.mx',     initials: 'SC', avatarBg: '#64748B' },
]

export const MOCK_PROJECT_MEMBERS: MockProjectMember[] = [
	{ id: 'pm1', projectId: 'proj1', userId: 'u1', user: ALL_TENANT_USERS[0], role: 'ADMIN',      assignedAt: new Date('2024-01-05'), assignedByName: 'Sistema' },
	{ id: 'pm2', projectId: 'proj1', userId: 'u2', user: ALL_TENANT_USERS[1], role: 'SUPERVISOR', assignedAt: new Date('2024-01-05'), assignedByName: 'Carlos Mendoza' },
	{ id: 'pm3', projectId: 'proj1', userId: 'u3', user: ALL_TENANT_USERS[2], role: 'SUPERVISOR', assignedAt: new Date('2024-01-10'), assignedByName: 'Carlos Mendoza' },
	{ id: 'pm4', projectId: 'proj1', userId: 'u4', user: ALL_TENANT_USERS[3], role: 'RESIDENT',   assignedAt: new Date('2024-01-10'), assignedByName: 'Carlos Mendoza' },
	{ id: 'pm5', projectId: 'proj1', userId: 'u5', user: ALL_TENANT_USERS[4], role: 'RESIDENT',   assignedAt: new Date('2024-02-01'), assignedByName: 'Ana Gutiérrez' },
	{ id: 'pm6', projectId: 'proj1', userId: 'u6', user: ALL_TENANT_USERS[5], role: 'VIEWER',     assignedAt: new Date('2024-02-15'), assignedByName: 'Carlos Mendoza' },
]

export const MOCK_AVAILABLE_USERS: MockUser[] = ALL_TENANT_USERS.filter(
	u => !MOCK_PROJECT_MEMBERS.some(m => m.userId === u.id),
)
