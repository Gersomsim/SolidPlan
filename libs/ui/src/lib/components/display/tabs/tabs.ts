import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  input,
  model,
} from '@angular/core';
import { Tab, TABS } from './tab';

export type TabsOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'lib-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './tabs.html',
  providers: [{ provide: TABS, useExisting: forwardRef(() => Tabs) }],
})
export class Tabs {
  readonly activeTab   = model('');
  readonly orientation = input<TabsOrientation>('horizontal');

  readonly tabs = contentChildren(Tab);

  readonly containerClass = computed(() =>
    this.orientation() === 'vertical' ? 'flex flex-row gap-0' : 'flex flex-col gap-0'
  );

  readonly tabBarClass = computed(() =>
    this.orientation() === 'vertical'
      ? 'flex flex-col border-r border-border min-w-[160px] shrink-0'
      : 'flex flex-row border-b border-border'
  );

  readonly panelClass = computed(() =>
    this.orientation() === 'vertical' ? 'flex-1 pl-6 pt-0' : 'pt-4'
  );

  tabButtonClass(tab: Tab): string {
    const isActive = this.activeTab() === tab.key();
    const base = 'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none whitespace-nowrap';

    if (tab.disabled()) {
      return `${base} text-text-muted cursor-not-allowed opacity-50`;
    }

    if (this.orientation() === 'vertical') {
      return isActive
        ? `${base} border-l-2 border-primary text-primary bg-primary/5 cursor-pointer`
        : `${base} border-l-2 border-transparent text-text-secondary hover:text-text-primary hover:bg-hover-row cursor-pointer`;
    }

    return isActive
      ? `${base} border-b-2 border-primary text-primary cursor-pointer`
      : `${base} border-b-2 border-transparent text-text-secondary hover:text-text-primary cursor-pointer`;
  }

  onTabClick(tab: Tab): void {
    if (tab.disabled()) return;
    this.activeTab.set(tab.key());
  }
}
