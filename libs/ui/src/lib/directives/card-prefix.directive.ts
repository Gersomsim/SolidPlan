import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: '[libCardPrefix]', standalone: true })
export class LibCardPrefixDirective {
  readonly template = inject(TemplateRef<void>);
}
