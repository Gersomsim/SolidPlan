import { Component, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

import { Icon } from '@org/ui'

@Component({
	selector: 'app-organization-settings',
	standalone: true,
	imports: [ReactiveFormsModule, Icon],
	templateUrl: './organization-settings.html',
})
export class OrganizationSettings {
	readonly saving = signal(false)
	readonly savedOk = signal(false)

	// Mock current tenant
	readonly form = new FormGroup({
		name: new FormControl('Constructora Pérez S.A.', Validators.required),
		slug: new FormControl({ value: 'constructora-perez', disabled: true }),
		industry: new FormControl('CONSTRUCTION'),
		logoUrl: new FormControl(''),
	})

	onSubmit(): void {
		this.form.markAllAsTouched()
		if (this.form.invalid) return

		this.saving.set(true)
		setTimeout(() => {
			this.saving.set(false)
			this.savedOk.set(true)
			setTimeout(() => this.savedOk.set(false), 2500)
		}, 800)
	}
}
