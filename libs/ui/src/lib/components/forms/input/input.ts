import {
  Component, input, inject, Injector, contentChild, TemplateRef,
  signal, computed, OnInit, forwardRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl,
  AbstractControl,
} from '@angular/forms';
import { ErrorMessageService } from '../../../services/error-message.service';
import { LibPrefixDirective } from '../../../directives/prefix.directive';
import { LibSuffixDirective } from '../../../directives/suffix.directive';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './input.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Input), multi: true },
  ],
})
export class Input implements ControlValueAccessor, OnInit {
  readonly label       = input('');
  readonly hint        = input('');
  readonly placeholder = input('');
  readonly type        = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url'>('text');
  readonly disabled    = input(false);
  readonly readonly    = input(false);
  readonly prefix      = input('');
  readonly suffix      = input('');
  readonly errors      = input<Record<string, string>>({});

  readonly prefixTpl = contentChild(LibPrefixDirective, { read: TemplateRef });
  readonly suffixTpl = contentChild(LibSuffixDirective, { read: TemplateRef });

  readonly value     = signal('');
  readonly isFocused = signal(false);

  private injector     = inject(Injector);
  private errorService = inject(ErrorMessageService);

  private _ngControl: NgControl | null = null;

  ngOnInit(): void {
    this._ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
  }

  get control(): AbstractControl | null {
    return this._ngControl?.control ?? null;
  }

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

  private readonly _disabledByForm = signal(false);
  readonly effectiveDisabled = computed(() => this.disabled() || this._disabledByForm());

  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void { this.value.set(value ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabledByForm.set(isDisabled); }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }
}
