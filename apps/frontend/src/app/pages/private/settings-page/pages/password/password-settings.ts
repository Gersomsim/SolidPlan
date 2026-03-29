import { Component, signal } from '@angular/core'
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'

import { Icon } from '@org/ui'

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
	const newPass = group.get('newPassword')?.value
	const confirm = group.get('confirmPassword')?.value
	return newPass && confirm && newPass !== confirm ? { passwordMismatch: true } : null
}

@Component({
	selector: 'app-password-settings',
	standalone: true,
	imports: [ReactiveFormsModule, Icon],
	templateUrl: './password-settings.html',
})
export class PasswordSettings {
	readonly saving = signal(false)
	readonly savedOk = signal(false)
	readonly showCurrent = signal(false)
	readonly showNew = signal(false)
	readonly showConfirm = signal(false)
	readonly mfaEnabled = signal(false)

	readonly form = new FormGroup(
		{
			currentPassword: new FormControl('', Validators.required),
			newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
			confirmPassword: new FormControl('', Validators.required),
		},
		{ validators: passwordMatchValidator },
	)

	onSubmit(): void {
		this.form.markAllAsTouched()
		if (this.form.invalid) return

		this.saving.set(true)
		setTimeout(() => {
			this.saving.set(false)
			this.savedOk.set(true)
			this.form.reset()
			setTimeout(() => this.savedOk.set(false), 2500)
		}, 800)
	}
}
