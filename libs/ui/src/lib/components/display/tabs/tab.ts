import { ChangeDetectionStrategy, Component, InjectionToken, inject, input } from '@angular/core';

// Forward declaration — Tabs will provide this token
export const TABS = new InjectionToken<{ activeTab: () => string }>('TABS');

@Component({
  selector: 'lib-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './tab.html',
})
export class Tab {
  readonly key      = input.required<string>();
  readonly label    = input.required<string>();
  readonly icon     = input('');
  readonly disabled = input(false);
  readonly badge    = input<number | null>(null);

  readonly tabs = inject(TABS);

  get isActive(): boolean {
    return this.tabs.activeTab() === this.key();
  }
}
