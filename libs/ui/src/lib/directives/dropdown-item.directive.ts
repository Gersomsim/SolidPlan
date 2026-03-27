import { Directive, inject, TemplateRef } from '@angular/core';
import { DropdownItem } from '../models/dropdown-item.model';

@Directive({ selector: '[libDropdownItem]', standalone: true })
export class LibDropdownItemDirective {
  readonly template = inject(TemplateRef<{ $implicit: DropdownItem }>);
}
