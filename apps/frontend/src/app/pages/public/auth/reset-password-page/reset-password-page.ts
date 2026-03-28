import { Component, inject, signal } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { RouterLink } from '@angular/router'

import { Button, Card, Input, Link } from '@org/ui'
import { Icon } from '@org/ui'

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('password')?.value
  const cpw = group.get('confirmPassword')?.value
  if (!pw || !cpw) return null
  return pw === cpw ? null : { passwordMismatch: true }
}

@Component({
  selector: 'app-reset-password-page',
  imports: [ReactiveFormsModule, RouterLink, Button, Card, Input, Link, Icon],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.css',
})
export class ResetPasswordPage {
  private fb = inject(FormBuilder)

  readonly submitted = signal(false)

  readonly form = this.fb.group(
    {
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  )

  get passwordMismatch(): boolean {
    return !!(
      this.form.errors?.['passwordMismatch'] &&
      this.form.get('confirmPassword')?.touched
    )
  }

  submit(): void {
    this.form.markAllAsTouched()
    if (this.form.invalid) return
    // TODO: integrate with API (token from query param)
    console.log('reset-password', this.form.value)
    this.submitted.set(true)
  }
}
