import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant = 'planning' | 'in-progress' | 'completed' | 'delayed' | 'review' | 'custom';
export type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'lib-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './badge.html',
})
export class Badge {
  readonly variant = input<BadgeVariant>('planning');
  readonly label   = input('');
  readonly size    = input<BadgeSize>('md');
  readonly color   = input('');

  readonly classes = computed(() => {
    const sizeClass    = this.size() === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';
    const variantClass = this.variantClasses();
    return `inline-flex items-center rounded-badge font-medium uppercase tracking-wide ${sizeClass} ${variantClass}`.trim();
  });

  readonly customBg = computed(() => {
    if (this.variant() !== 'custom' || !this.color()) return null;
    return this.color() + '26'; // 15% opacity in hex (0.15 * 255 ≈ 38 = 0x26)
  });

  readonly customColor = computed(() => {
    if (this.variant() !== 'custom' || !this.color()) return null;
    return this.color();
  });

  private variantClasses(): string {
    switch (this.variant()) {
      case 'planning':    return 'bg-status-planning/15 text-status-planning';
      case 'in-progress': return 'bg-accent/15 text-accent';
      case 'completed':   return 'bg-success/15 text-success';
      case 'delayed':     return 'bg-danger/15 text-danger';
      case 'review':      return 'bg-primary/15 text-primary';
      default:            return '';
    }
  }
}
