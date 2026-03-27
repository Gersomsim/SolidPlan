import { Directive, inject, TemplateRef, input } from '@angular/core';

@Directive({ selector: '[libCell]', standalone: true })
export class LibCellDirective {
  readonly key = input.required<string>({ alias: 'libCell' });
  readonly template = inject(TemplateRef<{ $implicit: unknown }>);
}
