import { Component, inject, input } from '@angular/core';
import { RADIO_GROUP } from './radio-group.component';

@Component({
  selector: 'lib-radio',
  standalone: true,
  imports: [],
  templateUrl: './radio.component.html',
})
export class RadioComponent {
  readonly value    = input<unknown>(null);
  readonly label    = input('');
  readonly disabled = input(false);

  readonly group = inject(RADIO_GROUP);

  get isChecked(): boolean {
    return this.group.selectedValue() === this.value();
  }

  select(): void {
    if (!this.disabled() && !this.group.effectiveDisabled()) {
      this.group.select(this.value());
    }
  }
}
