import { Component, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

import { Icon } from '@org/ui'

@Component({
	selector: 'app-profile-settings',
	standalone: true,
	imports: [ReactiveFormsModule, Icon],
	templateUrl: './profile-settings.html',
})
export class ProfileSettings {
	readonly saving = signal(false)
	readonly savedOk = signal(false)

	// Mock current user
	readonly form = new FormGroup({
		firstName: new FormControl('Carlos', Validators.required),
		lastName: new FormControl('Mendoza', Validators.required),
		jobTitle: new FormControl('Director General', Validators.required),
		phone: new FormControl('+52 55 1234 5678'),
		email: new FormControl({ value: 'carlos.mendoza@constructora.mx', disabled: true }),
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
