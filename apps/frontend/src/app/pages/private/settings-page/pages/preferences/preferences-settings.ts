import { Component, signal } from '@angular/core'

import { Icon } from '@org/ui'

interface WorkDay {
	value: number
	label: string
	short: string
	enabled: boolean
}

@Component({
	selector: 'app-preferences-settings',
	standalone: true,
	imports: [Icon],
	templateUrl: './preferences-settings.html',
})
export class PreferencesSettings {
	readonly saving = signal(false)
	readonly savedOk = signal(false)

	// Projects config (TenantConfig.projects)
	readonly autoAssignViewer = signal(false)
	readonly requireApprovalForDailyLog = signal(true)
	readonly allowGuestAccess = signal(false)

	// Notifications (TenantConfig.notifications)
	readonly emailOnDailyLog = signal(true)
	readonly emailOnActivityDelay = signal(true)
	readonly emailOnProjectStatusChange = signal(false)

	// Schedule (TenantConfig.schedule)
	readonly workStart = signal('08:00')
	readonly workEnd = signal('17:00')

	readonly workDays = signal<WorkDay[]>([
		{ value: 1, label: 'Lunes', short: 'L', enabled: true },
		{ value: 2, label: 'Martes', short: 'M', enabled: true },
		{ value: 3, label: 'Miércoles', short: 'X', enabled: true },
		{ value: 4, label: 'Jueves', short: 'J', enabled: true },
		{ value: 5, label: 'Viernes', short: 'V', enabled: true },
		{ value: 6, label: 'Sábado', short: 'S', enabled: false },
		{ value: 0, label: 'Domingo', short: 'D', enabled: false },
	])

	toggleWorkDay(value: number): void {
		this.workDays.update(days => days.map(d => (d.value === value ? { ...d, enabled: !d.enabled } : d)))
	}

	onSave(): void {
		this.saving.set(true)
		setTimeout(() => {
			this.saving.set(false)
			this.savedOk.set(true)
			setTimeout(() => this.savedOk.set(false), 2500)
		}, 800)
	}
}
