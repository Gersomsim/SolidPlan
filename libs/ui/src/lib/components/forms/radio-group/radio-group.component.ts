import {
  Component, input, inject, signal, OnInit, forwardRef, Injector, computed, InjectionToken,
} from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl,
} from '@angular/forms';
import { ErrorMessageService } from '../../../services/error-message.service';

export const RADIO_GROUP = new InjectionToken<RadioGroupComponent>('RADIO_GROUP');

@Component({
  selector: 'lib-radio-group',
  standalone: true,
  imports: [],
  templateUrl: './radio-group.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioGroupComponent), multi: true },
    { provide: RADIO_GROUP, useExisting: forwardRef(() => RadioGroupComponent) },
  ],
})
export class RadioGroupComponent implements ControlValueAccessor, OnInit {
  readonly label       = input('');
  readonly hint        = input('');
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  readonly disabled    = input(false);
  readonly errors      = input<Record<string, string>>({});

  readonly selectedValue = signal<unknown>(null);
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

  writeValue(value: unknown): void { this.selectedValue.set(value); }
  registerOnChange(fn: (v: unknown) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabledByForm.set(isDisabled); }

  select(value: unknown): void {
    this.selectedValue.set(value);
    this.onChange(value);
    this.onTouched();
  }
}
