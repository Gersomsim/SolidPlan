import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

import { Badge, Card, Icon } from '@org/ui'
import { LibCardPrefixDirective } from '@org/ui'

@Component({
	selector: 'app-home-page',
	imports: [RouterLink, Icon, Card, Badge, LibCardPrefixDirective],
	templateUrl: './home-page.html',
	styleUrl: './home-page.css',
})
export class HomePage {
	readonly features = [
		{
			icon: 'building' as const,
			title: 'Gestión de proyectos',
			description:
				'Crea y administra todos tus proyectos de construcción en un solo lugar. Etapas, presupuesto y fechas bajo control.',
		},
		{
			icon: 'calendar-days' as const,
			title: 'Cronograma Gantt',
			description:
				'Visualiza el avance de actividades en tiempo real. Árbol de tareas con sub-actividades y dependencias.',
		},
		{
			icon: 'users' as const,
			title: 'Equipos de obra',
			description:
				'Asigna roles y responsabilidades por proyecto. Admin, Supervisor, Residente y Viewer con permisos diferenciados.',
		},
		{
			icon: 'chart-area' as const,
			title: 'Reportes y análisis',
			description:
				'Métricas de avance, presupuesto ejecutado y bitácoras de obra exportables para reuniones y auditorías.',
		},
		{
			icon: 'shield-check' as const,
			title: 'Trazabilidad total',
			description:
				'Registra cada avance con evidencia fotográfica. Historial inmutable de cambios por actividad y etapa.',
		},
		{
			icon: 'map-pin' as const,
			title: 'Diseñado para campo',
			description:
				'Interfaz optimizada para uso en obra. Rápida, clara y funcional desde cualquier dispositivo en sitio.',
		},
	]

	readonly steps = [
		{
			number: '01',
			title: 'Crea tu organización',
			description:
				'Registra tu empresa constructora, invita a tu equipo y configura las etapas de trabajo que usarás en tus proyectos.',
		},
		{
			number: '02',
			title: 'Configura tu proyecto',
			description:
				'Define etapas, asigna miembros con sus roles y estructura el cronograma de actividades con fechas y responsables.',
		},
		{
			number: '03',
			title: 'Controla el avance',
			description:
				'Registra bitácoras diarias, actualiza el progreso de actividades y genera reportes en tiempo real desde campo.',
		},
	]

	readonly plans = [
		{
			name: 'Básico',
			price: '$0',
			period: 'gratis para siempre',
			description: 'Para equipos pequeños que quieren empezar a ordenar sus proyectos.',
			cta: 'Empezar gratis',
			ctaLink: '/auth/register',
			highlighted: false,
			features: [
				'Hasta 3 proyectos activos',
				'Hasta 5 usuarios',
				'Cronograma básico',
				'Bitácora de obra',
				'Soporte por email',
			],
		},
		{
			name: 'Pro',
			price: '$49',
			period: 'por mes',
			description: 'Para constructoras que necesitan control total y reportes detallados.',
			cta: 'Comenzar prueba gratis',
			ctaLink: '/auth/register',
			highlighted: true,
			features: [
				'Proyectos ilimitados',
				'Hasta 25 usuarios',
				'Cronograma Gantt completo',
				'Reportes exportables',
				'Gestión de evidencias',
				'Soporte prioritario',
			],
		},
		{
			name: 'Empresa',
			price: 'A medida',
			period: 'contactar ventas',
			description: 'Para grandes constructoras con múltiples obras y requerimientos especiales.',
			cta: 'Contactar ventas',
			ctaLink: '/auth/register',
			highlighted: false,
			features: [
				'Todo lo de Pro',
				'Usuarios ilimitados',
				'SLA garantizado',
				'Integración con ERP',
				'Onboarding dedicado',
				'Soporte 24/7',
			],
		},
	]
}
