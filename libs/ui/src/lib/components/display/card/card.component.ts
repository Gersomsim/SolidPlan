import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
} from '@angular/core';
import { LibCardActionsDirective } from '../../../directives/card-actions.directive';
import { LibCardFooterDirective } from '../../../directives/card-footer.directive';
import { LibCardHeaderDirective } from '../../../directives/card-header.directive';
import { LibCardPrefixDirective } from '../../../directives/card-prefix.directive';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly title = input('');
  readonly subtitle = input('');
  readonly loading = input(false);
  readonly padding = input<CardPadding>('md');
  readonly bordered = input(true);
  readonly elevated = input(true);

  readonly prefixSlot = contentChild(LibCardPrefixDirective);
  readonly actionsSlot = contentChild(LibCardActionsDirective);
  readonly footerSlot = contentChild(LibCardFooterDirective);
  readonly headerSlot = contentChild(LibCardHeaderDirective);

  readonly hasDefaultHeader = computed(() => !!(
    this.title().trim() ||
    this.subtitle().trim() ||
    this.prefixSlot() ||
    this.actionsSlot()
  ));

  readonly containerClasses = computed(() => {
    const classes = [
      'relative overflow-hidden rounded-card bg-surface text-text-primary dark:bg-dark-surface dark:text-dark-text',
      this.bordered() ? 'border border-border' : '',
      this.elevated() ? 'shadow-card' : '',
    ];
    return classes.filter(Boolean).join(' ');
  });

  readonly contentPaddingClass = computed(() => {
    const map: Record<CardPadding, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    return map[this.padding()];
  });

  readonly footerPaddingClass = computed(() => {
    const map: Record<CardPadding, string> = {
      none: 'px-0 py-0',
      sm: 'px-4 py-4',
      md: 'px-6 py-4',
      lg: 'px-8 py-5',
    };
    return map[this.padding()];
  });
}
