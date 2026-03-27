import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({ selector: '[libStepContent]', standalone: true })
export class LibStepContentDirective {
  readonly key      = input.required<string>({ alias: 'libStepContent' });
  readonly template = inject(TemplateRef<void>);
}
