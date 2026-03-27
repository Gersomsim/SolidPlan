import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({ selector: '[libStepIcon]', standalone: true })
export class LibStepIconDirective {
  readonly key      = input.required<string>({ alias: 'libStepIcon' });
  readonly template = inject(TemplateRef<void>);
}
