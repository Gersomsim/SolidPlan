import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: '[libModalFooter]', standalone: true })
export class LibModalFooterDirective {
  readonly template = inject(TemplateRef<void>);
}
