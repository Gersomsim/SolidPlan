import { Component, computed, inject, signal } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { RouterLink } from '@angular/router'

import { Button, Card, Input, Link, Select, Stepper } from '@org/ui'
import { Icon } from '@org/ui'
import { StepItem } from '@org/ui'

const STEP_KEYS = ['user', 'tenant', 'plan'] as const
type StepKey = typeof STEP_KEYS[number]

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('password')?.value
  const cpw = group.get('confirmPassword')?.value
  if (!pw || !cpw) return null
  return pw === cpw ? null : { passwordMismatch: true }
}

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink, Button, Card, Input, Select, Link, Icon, Stepper],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private fb = inject(FormBuilder)

  // ── Step navigation ─────────────────────────────────────────
  readonly activeStep = signal<StepKey>('user')

  readonly stepItems = computed<StepItem[]>(() => {
    const current    = this.activeStep()
    const currentIdx = STEP_KEYS.indexOf(current)
    return [
      {
        key: 'user',
        label: 'Tu cuenta',
        description: 'Datos personales',
        status: currentIdx > 0 ? 'completed' : currentIdx === 0 ? 'active' : 'pending',
      },
      {
        key: 'tenant',
        label: 'Tu empresa',
        description: 'Organización',
        status: currentIdx > 1 ? 'completed' : currentIdx === 1 ? 'active' : 'pending',
      },
      {
        key: 'plan',
        label: 'Tu plan',
        description: 'Suscripción',
        status: currentIdx === 2 ? 'active' : 'pending',
      },
    ]
  })

  // ── Step 1 — User form ───────────────────────────────────────
  readonly jobTitleOptions = [
    'Director General',
    'Gerente de Construcción',
    'Director de Obra',
    'Residente de Obra',
    'Supervisor de Obra',
    'Arquitecto',
    'Ingeniero Civil',
    'Ingeniero en Construcción',
    'Administrador de Proyectos',
    'Otro',
  ].map(v => ({ label: v, value: v }))

  readonly userForm = this.fb.group(
    {
      firstName:       ['', [Validators.required, Validators.minLength(2)]],
      lastName:        ['', [Validators.required, Validators.minLength(2)]],
      email:           ['', [Validators.required, Validators.email]],
      phone:           [''],
      jobTitle:        ['', Validators.required],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  )

  get passwordMismatch(): boolean {
    return !!(
      this.userForm.errors?.['passwordMismatch'] &&
      this.userForm.get('confirmPassword')?.touched
    )
  }

  // ── Step 2 — Tenant form ─────────────────────────────────────
  readonly tenantForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  })

  get tenantSlugPreview(): string {
    const name = this.tenantForm.get('name')?.value ?? ''
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  // ── Step 3 — Plan selection ──────────────────────────────────
  readonly selectedPlan = signal<'FREE' | 'PRO' | 'ENTERPRISE'>('FREE')

  readonly plans = [
    {
      key: 'FREE' as const,
      name: 'Básico',
      price: '$0',
      period: 'gratis para siempre',
      description: 'Para equipos pequeños que quieren empezar a ordenar sus proyectos.',
      highlighted: false,
      badge: null,
      features: [
        'Hasta 3 proyectos activos',
        'Hasta 5 usuarios',
        'Cronograma básico',
        'Bitácora de obra',
        'Soporte por email',
      ],
    },
    {
      key: 'PRO' as const,
      name: 'Pro',
      price: '$49',
      period: 'por mes',
      description: 'Para constructoras que necesitan control total y reportes detallados.',
      highlighted: true,
      badge: 'Más popular',
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
      key: 'ENTERPRISE' as const,
      name: 'Empresa',
      price: 'A medida',
      period: 'contactar ventas',
      description: 'Para grandes constructoras con múltiples obras y requerimientos especiales.',
      highlighted: false,
      badge: null,
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

  // ── Navigation ───────────────────────────────────────────────
  nextStep(): void {
    const current = this.activeStep()
    if (current === 'user') {
      this.userForm.markAllAsTouched()
      if (this.userForm.invalid) return
      this.activeStep.set('tenant')
    } else if (current === 'tenant') {
      this.tenantForm.markAllAsTouched()
      if (this.tenantForm.invalid) return
      this.activeStep.set('plan')
    }
  }

  prevStep(): void {
    const current = this.activeStep()
    if (current === 'tenant') this.activeStep.set('user')
    else if (current === 'plan')  this.activeStep.set('tenant')
  }

  onStepChange(key: string): void {
    const currentIdx = STEP_KEYS.indexOf(this.activeStep())
    const targetIdx  = STEP_KEYS.indexOf(key as StepKey)
    if (targetIdx < currentIdx) this.activeStep.set(key as StepKey)
  }

  get selectedPlanName(): string {
    return this.plans.find(p => p.key === this.selectedPlan())?.name ?? ''
  }

  submit(): void {
    // TODO: integrate with API
    console.log({
      user:   this.userForm.value,
      tenant: this.tenantForm.value,
      plan:   this.selectedPlan(),
    })
  }
}
