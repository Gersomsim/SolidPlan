import {
  Component, input, inject, signal, OnInit, forwardRef, Injector, computed,
} from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl,
} from '@angular/forms';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  selector: 'lib-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './checkbox.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Checkbox), multi: true },
  ],
})
export class Checkbox implements ControlValueAccessor, OnInit {
  readonly label    = input('');
  readonly hint     = input('');
  readonly disabled = input(false);
  readonly errors   = input<Record<string, string>>({});

  readonly checked  = signal(false);
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

  onChange: (v: boolean) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: boolean): void { this.checked.set(!!value); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabledByForm.set(isDisabled); }

  toggle(): void {
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
