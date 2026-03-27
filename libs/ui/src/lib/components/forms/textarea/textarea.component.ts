import {
  Component, input, inject, signal, OnInit, forwardRef, Injector, computed,
} from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl,
} from '@angular/forms';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  selector: 'lib-textarea',
  standalone: true,
  imports: [],
  templateUrl: './textarea.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextareaComponent), multi: true },
  ],
})
export class TextareaComponent implements ControlValueAccessor, OnInit {
  readonly label       = input('');
  readonly hint        = input('');
  readonly placeholder = input('');
  readonly rows        = input(4);
  readonly disabled    = input(false);
  readonly readonly    = input(false);
  readonly errors      = input<Record<string, string>>({});

  readonly value     = signal('');
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

  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void { this.value.set(value ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabledByForm.set(isDisabled); }

  onInput(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
  }
}
