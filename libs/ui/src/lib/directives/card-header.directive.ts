import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: '[libCardHeader]', standalone: true })
export class LibCardHeaderDirective {
  readonly template = inject(TemplateRef<void>);
}
