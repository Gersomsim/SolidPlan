import { Component, input } from '@angular/core'

import { Icon } from '../icon/icon'
import { IconType } from '../icon/icon.type'

@Component({
	selector: 'lib-empty-state',
	standalone: true,
	imports: [Icon],
	template: `
		<div class="flex flex-col items-center justify-center py-16 px-6 text-center">
			<div class="w-16 h-16 bg-secondary-bg dark:bg-white/10 rounded-full flex items-center justify-center mb-4 text-text-secondary dark:text-dark-text/40">
				<lib-ui-icon [icon]="icon()" [size]="30" />
			</div>
			<h3 class="text-h4 font-semibold text-text-primary dark:text-dark-text mb-2">{{ title() }}</h3>
			@if (description()) {
				<p class="text-small text-text-secondary dark:text-dark-text/60 max-w-sm leading-relaxed mb-5">
					{{ description() }}
				</p>
			}
			<ng-content />
		</div>
	`,
})
export class EmptyState {
	readonly icon = input<IconType>('search')
	readonly title = input<string>('')
	readonly description = input<string>('')
}
