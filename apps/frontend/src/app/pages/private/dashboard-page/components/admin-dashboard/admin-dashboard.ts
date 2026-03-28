import { Component } from '@angular/core'

import { Badge, BadgeVariant, Card, Icon, StatCard } from '@org/ui'

type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'delayed' | 'review'

interface MockProject {
	id: string
	name: string
	location: string
	stage: string
	status: ProjectStatus
	progress: number
	endDate: Date
	memberCount: number
}

interface OverdueActivity {
	name: string
	project: string
	daysLate: number
	assignedRole: string
}

interface RecentLog {
	project: string
	author: string
	date: Date
	summary: string
}

@Component({
	selector: 'app-admin-dashboard',
	imports: [Badge, Card, Icon, StatCard],
	templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
	readonly formattedDate = new Intl.DateTimeFormat('es-MX', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(new Date())

	readonly projects: MockProject[] = [
		{
			id: '1',
			name: 'Torre Residencial El Pinar',
			location: 'Monterrey, NL',
			stage: 'Estructura',
			status: 'in-progress',
			progress: 45,
			endDate: new Date('2026-08-15'),
			memberCount: 8,
		},
		{
			id: '2',
			name: 'Centro Comercial Vallarta',
			location: 'Guadalajara, JAL',
			stage: 'Cimientos',
			status: 'delayed',
			progress: 22,
			endDate: new Date('2026-05-01'),
			memberCount: 12,
		},
		{
			id: '3',
			name: 'Complejo Industrial Norte',
			location: 'Saltillo, COA',
			stage: 'Acabados',
			status: 'in-progress',
			progress: 78,
			endDate: new Date('2026-04-30'),
			memberCount: 6,
		},
		{
			id: '4',
			name: 'Conjunto Habitacional Villas',
			location: 'CDMX',
			stage: 'Planificación',
			status: 'planning',
			progress: 5,
			endDate: new Date('2026-12-01'),
			memberCount: 4,
		},
	]

	readonly overdueActivities: OverdueActivity[] = [
		{
			name: 'Colado de columnas nivel 3',
			project: 'Torre Residencial El Pinar',
			daysLate: 5,
			assignedRole: 'Residente',
		},
		{
			name: 'Inspección de cimentación',
			project: 'Centro Comercial Vallarta',
			daysLate: 12,
			assignedRole: 'Supervisor',
		},
		{
			name: 'Entrega de planos estructurales',
			project: 'Complejo Industrial Norte',
			daysLate: 2,
			assignedRole: 'Admin',
		},
	]

	readonly recentLogs: RecentLog[] = [
		{
			project: 'Torre Residencial El Pinar',
			author: 'Carlos R.',
			date: new Date('2026-03-27'),
			summary: 'Avance en colocación de varilla nivel 4. Personal completo en obra.',
		},
		{
			project: 'Complejo Industrial Norte',
			author: 'Ana M.',
			date: new Date('2026-03-27'),
			summary: 'Revisión de acabados en bloque A. Se detectaron detalles menores de pintura.',
		},
		{
			project: 'Centro Comercial Vallarta',
			author: 'Pedro L.',
			date: new Date('2026-03-26'),
			summary: 'Reporte de lluvia. Trabajo suspendido por condiciones climáticas.',
		},
	]

	statusBadgeVariant(status: ProjectStatus): BadgeVariant {
		const map: Record<ProjectStatus, BadgeVariant> = {
			planning: 'planning',
			'in-progress': 'in-progress',
			completed: 'completed',
			delayed: 'delayed',
			review: 'review',
		}
		return map[status]
	}

	statusLabel(status: ProjectStatus): string {
		const map: Record<ProjectStatus, string> = {
			planning: 'Planificación',
			'in-progress': 'En progreso',
			completed: 'Completado',
			delayed: 'Retrasado',
			review: 'En revisión',
		}
		return map[status]
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
