import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type LinkVariant   = 'link' | 'muted' | 'danger' | 'nav' | 'primary' | 'secondary' | 'action' | 'ghost' | 'white';
export type LinkUnderline = 'always' | 'hover' | 'never';
export type LinkTarget    = '_blank' | '_self';
export type LinkSize      = 'sm' | 'md' | 'lg';

@Component({
  selector: 'lib-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './link.html',
})
export class Link {
  readonly href       = input('');
  readonly routerLink = input<string | unknown[] | null>(null);
  readonly target     = input<LinkTarget>('_self');
  readonly variant    = input<LinkVariant>('link');
  readonly underline  = input<LinkUnderline>('hover');
  readonly size       = input<LinkSize>('md');
  readonly fullWidth  = input(false);

  readonly linkClass = computed(() => {
    const v = this.variant();

    // ── Text link variants ──────────────────────────────────────
    if (v === 'link') {
      return `inline transition-colors text-link hover:text-link-hover ${this.underlineClass()}`;
    }
    if (v === 'muted') {
      return `inline transition-colors text-text-secondary dark:text-dark-text/60 hover:text-text-primary dark:hover:text-dark-text ${this.underlineClass()}`;
    }
    if (v === 'danger') {
      return `inline transition-colors text-danger hover:opacity-80 ${this.underlineClass()}`;
    }
    if (v === 'nav') {
      return 'px-4 py-2 text-small font-medium text-text-secondary dark:text-dark-text/70 hover:text-text-primary dark:hover:text-dark-text hover:bg-secondary-bg dark:hover:bg-white/10 rounded-default transition-colors duration-150 no-underline';
    }

    // ── Button variants ─────────────────────────────────────────
    const flex = this.fullWidth() ? 'flex w-full justify-center' : 'inline-flex';
    const base = `${flex} items-center gap-2 font-medium rounded-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 no-underline`;
    const sz   = this.sizeClass();

    const map: Partial<Record<LinkVariant, string>> = {
      primary:   `${base} ${sz} bg-primary hover:bg-primary-hover text-white dark:bg-dark-primary dark:hover:bg-dark-primary-hover shadow-card`,
      secondary: `${base} ${sz} bg-secondary-bg text-text-primary hover:bg-border dark:bg-dark-secondary-bg dark:text-dark-text dark:hover:bg-white/10`,
      action:    `${base} ${sz} bg-accent hover:bg-accent-hover text-white`,
      ghost:     `${base} ${sz} bg-transparent text-text-primary border border-transparent hover:border-border dark:text-dark-text dark:hover:border-dark-border`,
      white:     `${base} ${sz} bg-white text-primary hover:bg-secondary-bg`,
    };
    return map[v] ?? '';
  });

  private sizeClass(): string {
    const map: Record<LinkSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return map[this.size()];
  }

  private underlineClass(): string {
    const map: Record<LinkUnderline, string> = {
      always: 'underline',
      hover:  'no-underline hover:underline',
      never:  'no-underline',
    };
    return map[this.underline()];
  }
}
