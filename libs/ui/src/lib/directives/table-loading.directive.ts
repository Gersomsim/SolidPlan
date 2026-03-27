import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: '[libLoading]', standalone: true })
export class LibLoadingDirective {
  readonly template = inject(TemplateRef<void>);
}
