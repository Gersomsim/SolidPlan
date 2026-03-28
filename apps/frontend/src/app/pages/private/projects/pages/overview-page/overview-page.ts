import { Component } from '@angular/core'
import { DecimalPipe } from '@angular/common'

import { Badge, BadgeVariant, Card, Icon, StatCard, Timeline, TimelineItem } from '@org/ui'

interface TeamMember {
	name: string
	role: 'ADMIN' | 'SUPERVISOR' | 'RESIDENT' | 'VIEWER'
	initials: string
}

const ROLE_BADGE: Record<TeamMember['role'], { variant: BadgeVariant; label: string; color: string }> = {
	ADMIN: { variant: 'review', label: 'Admin', color: '' },
	SUPERVISOR: { variant: 'in-progress', label: 'Supervisor', color: '' },
	RESIDENT: { variant: 'planning', label: 'Residente', color: '' },
	VIEWER: { variant: 'custom', label: 'Viewer', color: '#718096' },
}

@Component({
	selector: 'app-overview-page',
	imports: [DecimalPipe, Badge, Card, Icon, StatCard, Timeline],
	templateUrl: './overview-page.html',
})
export class OverviewPage {
	readonly project = {
		name: 'Torre Residencial El Pinar',
		description:
			'Edificio residencial de 15 niveles con 120 departamentos en zona norte de Monterrey. El complejo incluye amenidades como alberca, gimnasio, salón de usos múltiples y áreas verdes. Se trabaja bajo normativa NOM-031-STPS-2011 y certificación LEED Silver.',
		city: 'Monterrey, NL, México',
		street: 'Av. Constitución 4500, San Pedro Garza García',
		estimatedStartDate: new Date('2024-03-15'),
		estimatedEndDate: new Date('2026-08-15'),
		actualStartDate: new Date('2024-03-15'),
		totalAreaM2: 4200,
		budget: { amount: 45000000, currency: 'MXN' },
		overallProgress: 45,
		pendingActivities: 18,
		daysRemaining: 505,
		memberCount: 8,
		ownerId: 'Constructora Garza & Asociados',
		managerId: 'Arq. Miguel Torres',
	}

	readonly teamMembers: TeamMember[] = [
		{ name: 'Carlos Ramírez', role: 'ADMIN', initials: 'CR' },
		{ name: 'Ana Martínez', role: 'SUPERVISOR', initials: 'AM' },
		{ name: 'Pedro López', role: 'RESIDENT', initials: 'PL' },
		{ name: 'Sofía García', role: 'RESIDENT', initials: 'SG' },
		{ name: 'Luis Hernández', role: 'SUPERVISOR', initials: 'LH' },
		{ name: 'Diana Flores', role: 'VIEWER', initials: 'DF' },
		{ name: 'Ricardo Méndez', role: 'VIEWER', initials: 'RM' },
		{ name: 'Elena Torres', role: 'VIEWER', initials: 'ET' },
	]

	readonly stageTimeline: TimelineItem[] = [
		{
			id: 's1',
			label: 'Cimientos',
			description: 'Excavación, plantillas y colado de cimentación',
			date: new Date('2024-06-30'),
			status: 'completed',
		},
		{
			id: 's2',
			label: 'Estructura',
			description: 'Colado de columnas, trabes y losas — niveles 1–15',
			date: new Date('2025-06-30'),
			status: 'active',
		},
		{
			id: 's3',
			label: 'Instalaciones',
			description: 'Hidráulica, sanitaria, eléctrica y especiales',
			date: new Date('2025-12-31'),
			status: 'pending',
		},
		{
			id: 's4',
			label: 'Muros y divisiones',
			description: 'Mampostería, tablaroca y aislamiento acústico',
			date: new Date('2026-04-30'),
			status: 'pending',
		},
		{
			id: 's5',
			label: 'Acabados',
			description: 'Pintura, pisos, muebles de baño y carpintería',
			date: new Date('2026-07-31'),
			status: 'pending',
		},
		{
			id: 's6',
			label: 'Entrega',
			description: 'Pruebas finales, permisos de ocupación y escrituración',
			date: new Date('2026-08-15'),
			status: 'pending',
		},
	]

	roleBadge(role: TeamMember['role']) {
		return ROLE_BADGE[role]
	}

	formatDate(date: Date): string {
		return new Intl.DateTimeFormat('es-MX', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}).format(date)
	}

	formatBudget(): string {
		return `$${(this.project.budget.amount / 1_000_000).toFixed(1)}M ${this.project.budget.currency}`
	}
}
