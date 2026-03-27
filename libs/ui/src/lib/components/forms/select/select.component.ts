import {
  Component, input, inject, signal, computed, OnInit, forwardRef, Injector,
} from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl,
} from '@angular/forms';
import { ErrorMessageService } from '../../../services/error-message.service';
import { SelectOption } from '../../../models/select-option.model';

@Component({
  selector: 'lib-select',
  standalone: true,
  imports: [],
  templateUrl: './select.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Select), multi: true },
  ],
})
export class Select implements ControlValueAccessor, OnInit {
  readonly label       = input('');
  readonly hint        = input('');
  readonly placeholder = input('Selecciona una opción');
  readonly options     = input<SelectOption[]>([]);
  // TODO: multi-select value handling (selectedOptions) is not implemented; currently only the first selected option is emitted
  readonly multiple    = input(false);
  readonly disabled    = input(false);
  readonly errors      = input<Record<string, string>>({});

  readonly value     = signal<unknown>(null);
  readonly isFocused = signal(false);
  private readonly _disabledByForm = signal(false);
  readonly effectiveDisabled = computed(() => this.disabled() || this._disabledByForm());

  private injector     = inject(Injector);
  private errorService = inject(ErrorMessageService);
  private ngControl: NgControl | null = null;

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { self: true, optional: true } as never);
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  get control(): AbstractControl | null { return this.ngControl?.control ?? null; }

  get showErrors(): boolean {
    const ctrl = this.control;
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  get firstError(): string | null {
    const ctrl = this.control;
    if (!ctrl?.errors) return null;
    const [key, params] = Object.entries(ctrl.errors)[0];
    return this.errorService.getMessage(key, params as Record<string, unknown>, this.errors());
  }

  onChange: (v: unknown) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: unknown): void { this.value.set(value); }
  registerOnChange(fn: (v: unknown) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabledByForm.set(isDisabled); }

  onSelectChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    const matched = this.options().find(o => String(o.value) === val);
    const newVal = matched ? matched.value : val;
    this.value.set(newVal);
    this.onChange(newVal);
    this.onTouched();
  }

  isSelected(option: SelectOption): boolean {
    return this.value() === option.value;
  }
}
