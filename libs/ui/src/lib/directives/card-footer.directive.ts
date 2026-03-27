import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: '[libCardFooter]', standalone: true })
export class LibCardFooterDirective {
  readonly template = inject(TemplateRef<void>);
}
