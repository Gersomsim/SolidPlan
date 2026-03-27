import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: '[libEmptyState]', standalone: true })
export class LibEmptyStateDirective {
  readonly template = inject(TemplateRef<void>);
}
