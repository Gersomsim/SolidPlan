import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: '[libSeparator]', standalone: true })
export class LibSeparatorDirective {
  readonly template = inject(TemplateRef<void>);
}
