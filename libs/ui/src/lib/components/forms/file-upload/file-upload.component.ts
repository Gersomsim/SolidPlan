import {
  Component, input, inject, signal, OnInit, forwardRef, Injector,
} from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl,
} from '@angular/forms';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  selector: 'lib-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileUploadComponent), multi: true },
  ],
})
export class FileUploadComponent implements ControlValueAccessor, OnInit {
  readonly label       = input('');
  readonly hint        = input('');
  readonly accept      = input('');
  // TODO: multiple file selection value handling is not implemented (emits only single File)
  readonly multiple    = input(false);
  readonly maxSizeMB   = input(0);
  readonly disabled    = input(false);
  readonly errors      = input<Record<string, string>>({});

  readonly files       = signal<File[]>([]);
  readonly isDragging  = signal(false);
  readonly uploadError = signal<string | null>(null);

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
    return !!(ctrl?.invalid && ctrl?.touched) || this.uploadError() !== null;
  }

  get firstError(): string | null {
    if (this.uploadError()) return this.uploadError();
    const ctrl = this.control;
    if (!ctrl?.errors) return null;
    const [key, params] = Object.entries(ctrl.errors)[0];
    return this.errorService.getMessage(key, params as Record<string, unknown>, this.errors());
  }

  onChange: (v: File | File[] | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: File | File[] | null): void {
    if (!value) { this.files.set([]); return; }
    this.files.set(Array.isArray(value) ? value : [value]);
  }
  registerOnChange(fn: (v: File | File[] | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { /* disabled input handles this */ }

  handleFiles(fileList: File[]): void {
    this.uploadError.set(null);
    const maxBytes = this.maxSizeMB() * 1024 * 1024;

    for (const file of fileList) {
      if (maxBytes > 0 && file.size > maxBytes) {
        this.uploadError.set(`El archivo excede ${this.maxSizeMB()}MB`);
        this.onTouched();
        return;
      }
    }

    this.files.set(fileList);
    const val = this.multiple() ? fileList : (fileList[0] ?? null);
    this.onChange(val);
    this.onTouched();
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.handleFiles(Array.from(input.files ?? []));
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void { this.isDragging.set(false); }

  isImageFile(file: File): boolean { return file.type.startsWith('image/'); }

  get previewUrl(): string | null {
    const f = this.files()[0];
    return f && this.isImageFile(f) ? URL.createObjectURL(f) : null;
  }
}
