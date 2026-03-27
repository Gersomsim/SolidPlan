import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'action' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant  = input<ButtonVariant>('primary');
  readonly size     = input<ButtonSize>('md');
  readonly type     = input<'button' | 'submit' | 'reset'>('button');
  readonly loading  = input(false);
  readonly disabled = input(false);
  // TODO: render with @lucide/angular once icon components are available
  readonly iconLeft  = input<string>('');
  readonly iconRight = input<string>('');

  readonly isDisabled = computed(() => this.disabled() || this.loading());

  readonly variantClasses = computed(() => {
    const map: Record<ButtonVariant, string> = {
      primary:   'bg-primary hover:bg-primary-hover text-white',
      secondary: 'bg-secondary-bg text-text-primary hover:bg-border',
      action:    'bg-accent hover:bg-accent-hover text-white',
      ghost:     'bg-transparent text-text-primary border border-transparent hover:border-border',
      danger:    'bg-danger hover:opacity-90 text-white',
    };
    return map[this.variant()];
  });

  readonly sizeClasses = computed(() => {
    const map: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return map[this.size()];
  });
}
