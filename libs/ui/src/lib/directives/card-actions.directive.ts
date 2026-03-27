import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: '[libCardActions]', standalone: true })
export class LibCardActionsDirective {
  readonly template = inject(TemplateRef<void>);
}
