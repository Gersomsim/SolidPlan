import { Component, computed, inject, signal } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

import { Icon, IconType, ThemeService } from '@org/ui'

interface NavItem {
	icon: IconType
	label: string
	route: string
}

interface NavGroup {
	label: string
	items: NavItem[]
}

@Component({
	selector: 'app-private-layout',
	imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
	templateUrl: './private-layout.html',
})
export class PrivateLayout {
	readonly themeService = inject(ThemeService)
	readonly sidebarCollapsed = signal(false)

	readonly sidebarWidth = computed(() =>
		this.sidebarCollapsed() ? 'w-16' : 'w-60',
	)

	readonly navGroups: NavGroup[] = [
		{
			label: 'Principal',
			items: [
				{ icon: 'house',           label: 'Dashboard',  route: '/system/dashboard' },
				{ icon: 'building',        label: 'Proyectos',  route: '/system/projects' },
				{ icon: 'shopping-basket', label: 'Recursos',   route: '/system/resources' },
			],
		},
		{
			label: 'Organización',
			items: [
				{ icon: 'users', label: 'Miembros', route: '/system/members' },
				{ icon: 'landmark', label: 'Plantillas de etapas', route: '/system/stage-templates' },
				{
					icon: 'chart-candlestick',
					label: 'Estados de actividad',
					route: '/system/activity-states',
				},
				{ icon: 'tag', label: 'Categorías', route: '/system/categories' },
			],
		},
		{
			label: 'Sistema',
			items: [{ icon: 'settings', label: 'Configuración', route: '/system/settings' }],
		},
	]

	toggleSidebar(): void {
		this.sidebarCollapsed.update(v => !v)
	}

	navItemClass(isActive: boolean): string {
		const base =
			'flex items-center gap-3 h-10 px-3 rounded-input transition-colors duration-150 cursor-pointer no-underline'
		return isActive
			? `${base} bg-white/15 text-white font-medium`
			: `${base} text-white/70 hover:bg-white/10 hover:text-white`
	}

	navItemCollapsedClass(isActive: boolean): string {
		const base =
			'flex items-center justify-center w-10 h-10 rounded-input transition-colors duration-150 cursor-pointer no-underline mx-auto'
		return isActive
			? `${base} bg-white/15 text-white`
			: `${base} text-white/70 hover:bg-white/10 hover:text-white`
	}
}
