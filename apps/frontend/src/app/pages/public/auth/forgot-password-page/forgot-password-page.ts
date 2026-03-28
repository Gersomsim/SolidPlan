import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'

import { Button, Card, Input, Link } from '@org/ui'
import { Icon } from '@org/ui'

@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule, RouterLink, Button, Card, Input, Link, Icon],
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.css',
})
export class ForgotPasswordPage {
  private fb = inject(FormBuilder)

  readonly submitted = signal(false)

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  })

  submit(): void {
    this.form.markAllAsTouched()
    if (this.form.invalid) return
    // TODO: integrate with API
    console.log('forgot-password', this.form.value)
    this.submitted.set(true)
  }
}
