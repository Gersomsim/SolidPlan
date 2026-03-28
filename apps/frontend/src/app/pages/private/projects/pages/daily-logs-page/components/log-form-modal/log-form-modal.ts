import { Component, computed, input, OnInit, output, signal } from '@angular/core'
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'

import { Checkbox, Icon, Input, Select, Textarea } from '@org/ui'
import { SelectOption } from '@org/ui'

import { MOCK_ACTIVITIES } from '../../../activities-page/mock-activities'
import { MockDailyLog } from '../../mock-daily-logs'

export type LogFormMode = 'create' | 'edit'

const WEATHER_OPTIONS: SelectOption[] = [
	{ label: 'Despejado', value: 'CLEAR' },
	{ label: 'Nublado',   value: 'OVERCAST' },
	{ label: 'Lluvia',    value: 'RAIN' },
	{ label: 'Clima extremo', value: 'EXTREME' },
]

let machineCounter = 0
function machineUid(): string {
	return `m-${++machineCounter}`
}

interface MachineRow {
	uid: string
	value: string
}

@Component({
	selector: 'app-log-form-modal',
	standalone: true,
	imports: [ReactiveFormsModule, Checkbox, Icon, Input, Select, Textarea],
	templateUrl: './log-form-modal.html',
})
export class LogFormModal implements OnInit {
	readonly mode = input<LogFormMode>('create')
	readonly log  = input<MockDailyLog | null>(null)

	readonly saved    = output<void>()
	readonly canceled = output<void>()

	readonly saving = signal(false)
	readonly savedOk = signal(false)

	readonly weatherOptions  = WEATHER_OPTIONS
	readonly allActivities   = MOCK_ACTIVITIES

	// Machinery dynamic list
	readonly machines = signal<MachineRow[]>([])

	// Activity IDs checked
	readonly checkedActivities = signal<Set<string>>(new Set())

	readonly isEdit = computed(() => this.mode() === 'edit')

	readonly form = new FormGroup({
		reportDate:   new FormControl('', Validators.required),
		title:        new FormControl('', Validators.required),
		description:  new FormControl('', Validators.required),
		incidents:    new FormControl(''),
		observations: new FormControl(''),
		headcount:    new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
		workingHours: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
		weather:      new FormControl('CLEAR', Validators.required),
		temperature:  new FormControl<number | null>(null),
	})

	ngOnInit(): void {
		const existing = this.log()
		if (existing) {
			this.form.patchValue({
				reportDate:   existing.reportDate.toISOString().split('T')[0],
				title:        existing.content.title,
				description:  existing.content.description,
				incidents:    existing.content.incidents  ?? '',
				observations: existing.content.observations ?? '',
				headcount:    existing.metrics.headcount,
				workingHours: existing.metrics.workingHours,
				weather:      existing.environment.weather,
				temperature:  existing.environment.temperature ?? null,
			})
			this.machines.set(
				existing.metrics.machineryInUse.map(v => ({ uid: machineUid(), value: v })),
			)
			this.checkedActivities.set(new Set(existing.activityIds))
		}
	}

	// ── Machinery helpers ────────────────────────────────────
	addMachine(): void {
		this.machines.update(rows => [...rows, { uid: machineUid(), value: '' }])
	}

	removeMachine(uid: string): void {
		this.machines.update(rows => rows.filter(r => r.uid !== uid))
	}

	updateMachine(uid: string, value: string): void {
		this.machines.update(rows => rows.map(r => r.uid === uid ? { ...r, value } : r))
	}

	// ── Activity toggle ──────────────────────────────────────
	toggleActivity(id: string): void {
		this.checkedActivities.update(set => {
			const next = new Set(set)
			next.has(id) ? next.delete(id) : next.add(id)
			return next
		})
	}

	isActivityChecked(id: string): boolean {
		return this.checkedActivities().has(id)
	}

	// ── Submit ───────────────────────────────────────────────
	onSubmit(): void {
		this.form.markAllAsTouched()
		if (this.form.invalid) return

		this.saving.set(true)
		setTimeout(() => {
			this.saving.set(false)
			this.savedOk.set(true)
			setTimeout(() => {
				this.savedOk.set(false)
				this.saved.emit()
			}, 800)
		}, 900)
	}
}
