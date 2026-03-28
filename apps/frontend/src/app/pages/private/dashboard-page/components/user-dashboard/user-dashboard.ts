import { Component } from '@angular/core'

import { Badge, BadgeVariant, Card, Icon, StatCard } from '@org/ui'

type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'delayed' | 'review'
type ProjectRole = 'ADMIN' | 'SUPERVISOR' | 'RESIDENT' | 'VIEWER'
type ActivityStatus = 'in-progress' | 'delayed' | 'completed'

interface MyProject {
	id: string
	name: string
	location: string
	role: ProjectRole
	status: ProjectStatus
	progress: number
	stage: string
}

interface MyActivity {
	id: string
	name: string
	project: string
	dueDate: Date
	status: ActivityStatus
	progress: number
}

interface MyLog {
	project: string
	date: Date
	summary: string
}

const ROLE_LABEL: Record<ProjectRole, string> = {
	ADMIN: 'Admin',
	SUPERVISOR: 'Supervisor',
	RESIDENT: 'Residente',
	VIEWER: 'Solo lectura',
}

@Component({
	selector: 'app-user-dashboard',
	imports: [Badge, Card, Icon, StatCard],
	templateUrl: './user-dashboard.html',
})
export class UserDashboard {
	readonly formattedDate = new Intl.DateTimeFormat('es-MX', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(new Date())

	readonly myProjects: MyProject[] = [
		{
			id: '1',
			name: 'Torre Residencial El Pinar',
			location: 'Monterrey, NL',
			role: 'SUPERVISOR',
			status: 'in-progress',
			progress: 45,
			stage: 'Estructura',
		},
		{
			id: '2',
			name: 'Complejo Industrial Norte',
			location: 'Saltillo, COA',
			role: 'RESIDENT',
			status: 'in-progress',
			progress: 78,
			stage: 'Acabados',
		},
	]

	readonly myActivities: MyActivity[] = [
		{
			id: '1',
			name: 'Colado de columnas nivel 3',
			project: 'Torre Residencial El Pinar',
			dueDate: new Date('2026-03-25'),
			status: 'delayed',
			progress: 30,
		},
		{
			id: '2',
			name: 'Verificación de trazo en eje B',
			project: 'Complejo Industrial Norte',
			dueDate: new Date('2026-04-05'),
			status: 'in-progress',
			progress: 60,
		},
		{
			id: '3',
			name: 'Levantamiento de muros perimetrales',
			project: 'Torre Residencial El Pinar',
			dueDate: new Date('2026-04-10'),
			status: 'in-progress',
			progress: 15,
		},
	]

	readonly myLogs: MyLog[] = [
		{
			project: 'Torre Residencial El Pinar',
			date: new Date('2026-03-27'),
			summary: 'Supervisión de colado en planta 3. Personal completo. Sin incidentes.',
		},
		{
			project: 'Complejo Industrial Norte',
			date: new Date('2026-03-26'),
			summary: 'Revisión de acabados bloque A. Se documentaron 3 observaciones de pintura.',
		},
	]

	readonly overdueCount = this.myActivities.filter(a => a.status === 'delayed').length

	roleLabel(role: ProjectRole): string {
		return ROLE_LABEL[role]
	}

	statusBadgeVariant(status: ProjectStatus | ActivityStatus): BadgeVariant {
		const map: Record<string, BadgeVariant> = {
			planning: 'planning',
			'in-progress': 'in-progress',
			completed: 'completed',
			delayed: 'delayed',
			review: 'review',
		}
		return map[status] ?? 'planning'
	}

	statusLabel(status: ProjectStatus | ActivityStatus): string {
		const map: Record<string, string> = {
			planning: 'Planificación',
			'in-progress': 'En progreso',
			completed: 'Completado',
			delayed: 'Retrasado',
			review: 'En revisión',
		}
		return map[status] ?? status
	}

	progressBarClass(progress: number): string {
		if (progress <= 30) return 'bg-danger'
		if (progress <= 65) return 'bg-accent'
		return 'bg-success'
	}

	formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-MX', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}).format(date)
	}

	formatShortDate(date: Date): string {
		return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(date)
	}
}
