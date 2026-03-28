import { Component, computed, input } from '@angular/core'

import { Icon } from '../icon/icon'
import { IconType } from '../icon/icon.type'

export type StatCardColor = 'primary' | 'accent' | 'success' | 'danger'

@Component({
	selector: 'lib-stat-card',
	standalone: true,
	imports: [Icon],
	templateUrl: './stat-card.html',
})
export class StatCard {
	readonly icon = input<IconType>('chart-area')
	readonly label = input<string>('')
	readonly value = input<string | number>('')
	readonly sublabel = input<string>('')
	readonly color = input<StatCardColor>('primary')

	readonly iconContainerClass = computed(() => {
		const colorMap: Record<StatCardColor, string> = {
			primary: 'bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light',
			accent: 'bg-accent/10 text-accent',
			success: 'bg-success/10 text-success',
			danger: 'bg-danger/10 text-danger',
		}
		return `w-11 h-11 rounded-default flex items-center justify-center shrink-0 ${colorMap[this.color()]}`
	})
}
