import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type LinkVariant   = 'default' | 'muted' | 'danger';
export type LinkUnderline = 'always' | 'hover' | 'never';
export type LinkTarget    = '_blank' | '_self';

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
  readonly variant    = input<LinkVariant>('default');
  readonly underline  = input<LinkUnderline>('hover');

  readonly linkClass = computed(() => {
    const variantClasses: Record<LinkVariant, string> = {
      default: 'text-primary hover:text-primary-hover',
      muted:   'text-text-muted hover:text-text-primary',
      danger:  'text-danger hover:text-danger',
    };
    const underlineClasses: Record<LinkUnderline, string> = {
      always: 'underline',
      hover:  'no-underline hover:underline',
      never:  'no-underline',
    };
    return `inline transition-colors ${variantClasses[this.variant()]} ${underlineClasses[this.underline()]}`;
  });
}
