import { Component, computed, input } from '@angular/core'

export type ProgressBarColor = 'primary' | 'accent' | 'success' | 'danger' | 'auto'
export type ProgressBarSize = 'xs' | 'sm' | 'md'

@Component({
	selector: 'lib-progress-bar',
	standalone: true,
	template: `
		<div [class]="trackClass()">
			<div [class]="barClass()" [style.width.%]="clamped()" style="transition: width 0.5s ease"></div>
		</div>
	`,
})
export class ProgressBar {
	readonly value = input<number>(0)
	readonly size = input<ProgressBarSize>('sm')
	readonly color = input<ProgressBarColor>('auto')

	readonly clamped = computed(() => Math.max(0, Math.min(100, this.value())))

	readonly resolvedColor = computed<Exclude<ProgressBarColor, 'auto'>>(() => {
		if (this.color() !== 'auto') return this.color() as Exclude<ProgressBarColor, 'auto'>
		const v = this.clamped()
		if (v <= 30) return 'danger'
		if (v <= 65) return 'accent'
		return 'success'
	})

	readonly trackClass = computed(() => {
		const h: Record<ProgressBarSize, string> = { xs: 'h-1', sm: 'h-1.5', md: 'h-2.5' }
		return `w-full ${h[this.size()]} bg-secondary-bg dark:bg-white/10 rounded-badge overflow-hidden`
	})

	readonly barClass = computed(() => {
		const c: Record<Exclude<ProgressBarColor, 'auto'>, string> = {
			primary: 'bg-primary',
			accent: 'bg-accent',
			success: 'bg-success',
			danger: 'bg-danger',
		}
		return `h-full rounded-badge ${c[this.resolvedColor()]}`
	})
}
