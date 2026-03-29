import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

import { Icon, IconType } from '@org/ui'

interface SettingsNavItem {
	icon: IconType
	label: string
	route: string
	description: string
}

interface SettingsNavGroup {
	label: string
	items: SettingsNavItem[]
}

@Component({
	selector: 'app-settings-page',
	standalone: true,
	imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
	templateUrl: './settings-page.html',
})
export class SettingsPage {
	readonly navGroups: SettingsNavGroup[] = [
		{
			label: 'Cuenta',
			items: [
				{ icon: 'user', label: 'Perfil', route: 'profile', description: 'Nombre, cargo y foto' },
				{ icon: 'lock', label: 'Contraseña y seguridad', route: 'password', description: 'Contraseña y autenticación' },
			],
		},
		{
			label: 'Organización',
			items: [
				{ icon: 'building', label: 'Organización', route: 'organization', description: 'Datos de la empresa' },
				{ icon: 'sliders-horizontal', label: 'Preferencias', route: 'preferences', description: 'Configuración del sistema' },
			],
		},
		{
			label: 'Suscripción',
			items: [
				{ icon: 'zap', label: 'Plan', route: 'plan', description: 'Plan actual y comparación' },
				{ icon: 'credit-card', label: 'Facturación', route: 'billing', description: 'Método de pago e historial' },
			],
		},
	]
}
