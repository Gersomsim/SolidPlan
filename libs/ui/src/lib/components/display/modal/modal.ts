import {
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	HostListener,
	input,
	output,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

import { LibModalFooterDirective } from '../../../directives/modal-footer.directive'
import { Icon } from '../icon/icon'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

@Component({
	selector: 'lib-modal',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Icon, NgTemplateOutlet],
	templateUrl: './modal.html',
	styles: [`
		.modal-backdrop {
			animation: backdrop-in 150ms ease forwards;
		}
		.modal-panel {
			animation: panel-in 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
		}
		@keyframes backdrop-in {
			from { opacity: 0; }
			to   { opacity: 1; }
		}
		@keyframes panel-in {
			from { opacity: 0; transform: scale(0.97) translateY(-10px); }
			to   { opacity: 1; transform: scale(1)    translateY(0); }
		}
	`],
})
export class Modal {
	readonly open      = input<boolean>(false)
	readonly size      = input<ModalSize>('md')
	readonly title     = input<string>('')
	readonly showClose = input<boolean>(true)
	readonly closed    = output<void>()

	readonly footerSlot = contentChild(LibModalFooterDirective)

	readonly panelClass = computed(() => {
		const sizeMap: Record<ModalSize, string> = {
			sm:   'w-full max-w-sm',
			md:   'w-full max-w-lg',
			lg:   'w-full max-w-2xl',
			xl:   'w-full max-w-4xl',
			full: 'w-full max-w-[92vw]',
		}
		return `modal-panel relative flex flex-col rounded-card bg-surface dark:bg-dark-surface shadow-hover overflow-hidden max-h-[90vh] ${sizeMap[this.size()]}`
	})

	onBackdropClick(event: MouseEvent): void {
		if (event.target === event.currentTarget) {
			this.closed.emit()
		}
	}

	@HostListener('document:keydown.escape')
	onEscape(): void {
		if (this.open()) this.closed.emit()
	}
}
