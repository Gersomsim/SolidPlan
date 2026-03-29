import { Component, signal } from '@angular/core'

import { Badge, BadgeVariant, Icon } from '@org/ui'

interface PlanTier {
	id: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE'
	name: string
	price: string
	period: string
	description: string
	features: string[]
	highlighted: boolean
}

@Component({
	selector: 'app-plan-settings',
	standalone: true,
	imports: [Badge, Icon],
	templateUrl: './plan-settings.html',
})
export class PlanSettings {
	readonly currentPlan = signal<'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE'>('STARTER')
	readonly billingAnnual = signal(false)

	readonly plans: PlanTier[] = [
		{
			id: 'FREE',
			name: 'Free',
			price: '$0',
			period: 'siempre',
			description: 'Para equipos pequeños que están comenzando',
			features: ['Hasta 3 proyectos', 'Hasta 5 usuarios', 'Bitácoras básicas', 'Soporte por correo'],
			highlighted: false,
		},
		{
			id: 'STARTER',
			name: 'Starter',
			price: '$299',
			period: '/mes',
			description: 'Para empresas en crecimiento con más proyectos',
			features: ['Hasta 15 proyectos', 'Hasta 20 usuarios', 'Recursos y catálogo', 'Reportes básicos', 'Soporte prioritario'],
			highlighted: false,
		},
		{
			id: 'PRO',
			name: 'Pro',
			price: '$799',
			period: '/mes',
			description: 'Para constructoras que requieren control total',
			features: [
				'Proyectos ilimitados',
				'Usuarios ilimitados',
				'Cronograma Gantt',
				'Reportes avanzados',
				'Exportación PDF/Excel',
				'Soporte dedicado',
			],
			highlighted: true,
		},
		{
			id: 'ENTERPRISE',
			name: 'Enterprise',
			price: 'Personalizado',
			period: '',
			description: 'Solución a medida para grandes organizaciones',
			features: ['Todo lo de Pro', 'BD dedicada por tenant', 'SSO / Active Directory', 'SLA garantizado', 'Onboarding personalizado'],
			highlighted: false,
		},
	]

	planBadgeVariant(id: string): BadgeVariant {
		const map: Record<string, BadgeVariant> = {
			FREE: 'custom',
			STARTER: 'in-progress',
			PRO: 'completed',
			ENTERPRISE: 'planning',
		}
		return map[id] as BadgeVariant
	}

	isCurrentPlan(id: string): boolean {
		return this.currentPlan() === id
	}
}
