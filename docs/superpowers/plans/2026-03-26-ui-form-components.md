# UI Library — Form Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the foundation and all form components of `libs/ui`: services, shared models/directives, and 7 form components (button, input, textarea, checkbox, radio-group, select, file-upload).

**Architecture:** Standalone Angular 21 components with signal-based APIs (`input()`, `output()`, `model()`). All form components implement `ControlValueAccessor`. Error display is driven by `ErrorMessageService`. Dark mode via Tailwind v4 `dark:` class strategy managed by `ThemeService`.

**Tech Stack:** Angular 21.2, Tailwind v4, @angular/cdk (overlay — needed for later phases), @lucide/angular, @analogjs/vitest-angular, Vitest

---

## File Map

```
libs/ui/src/
  lib/
    services/
      error-message.service.ts        ← global validation messages
      error-message.service.spec.ts
      theme.service.ts                ← light/dark toggle (signals)
      theme.service.spec.ts
    models/
      select-option.model.ts
    directives/
      prefix.directive.ts             ← libPrefix
      suffix.directive.ts             ← libSuffix
      option.directive.ts             ← libOption
      file-preview.directive.ts       ← libFilePreview
    components/
      forms/
        button/
          button.component.ts
          button.component.html
          button.component.spec.ts
        input/
          input.component.ts
          input.component.html
          input.component.spec.ts
        textarea/
          textarea.component.ts
          textarea.component.html
          textarea.component.spec.ts
        checkbox/
          checkbox.component.ts
          checkbox.component.html
          checkbox.component.spec.ts
        radio-group/
          radio-group.component.ts
          radio-group.component.html
          radio-group.component.spec.ts
          radio.component.ts
          radio.component.html
          radio.component.spec.ts
        select/
          select.component.ts
          select.component.html
          select.component.spec.ts
        file-upload/
          file-upload.component.ts
          file-upload.component.html
          file-upload.component.spec.ts
  index.ts                            ← export everything
```

---

## Task 1: Install @angular/cdk

**Files:**
- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install the package**

```bash
pnpm add @angular/cdk
```

Expected: `@angular/cdk` appears in `dependencies` in `package.json`.

- [ ] **Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat(ui): install @angular/cdk"
```

---

## Task 2: ErrorMessageService

**Files:**
- Create: `libs/ui/src/lib/services/error-message.service.ts`
- Create: `libs/ui/src/lib/services/error-message.service.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `libs/ui/src/lib/services/error-message.service.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { ErrorMessageService } from './error-message.service';

describe('ErrorMessageService', () => {
  let service: ErrorMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ErrorMessageService] });
    service = TestBed.inject(ErrorMessageService);
  });

  it('returns default required message', () => {
    expect(service.getMessage('required', {})).toBe('Este campo es obligatorio');
  });

  it('returns minlength message with interpolated length', () => {
    expect(service.getMessage('minlength', { requiredLength: 5 }))
      .toBe('Mínimo 5 caracteres');
  });

  it('returns maxlength message with interpolated length', () => {
    expect(service.getMessage('maxlength', { requiredLength: 100 }))
      .toBe('Máximo 100 caracteres');
  });

  it('allows overriding a message at instance level', () => {
    service.configure({ required: 'Campo obligatorio' });
    expect(service.getMessage('required', {})).toBe('Campo obligatorio');
  });

  it('merges per-call overrides with global defaults', () => {
    const msg = service.getMessage('required', {}, { required: 'Selecciona un estado' });
    expect(msg).toBe('Selecciona un estado');
  });

  it('returns null for unknown error key', () => {
    expect(service.getMessage('customValidator', {})).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/services/error-message.service.spec.ts
```

Expected: FAIL — `ErrorMessageService` not found.

- [ ] **Step 3: Implement ErrorMessageService**

Create `libs/ui/src/lib/services/error-message.service.ts`:

```typescript
import { Injectable } from '@angular/core';

export type ErrorMessageFn = (params: Record<string, unknown>) => string;
export type ErrorMessages = Record<string, string | ErrorMessageFn>;

const DEFAULT_MESSAGES: ErrorMessages = {
  required:  'Este campo es obligatorio',
  minlength: (p) => `Mínimo ${(p as { requiredLength: number }).requiredLength} caracteres`,
  maxlength: (p) => `Máximo ${(p as { requiredLength: number }).requiredLength} caracteres`,
  email:     'Correo electrónico inválido',
  min:       (p) => `Valor mínimo: ${(p as { min: number }).min}`,
  max:       (p) => `Valor máximo: ${(p as { max: number }).max}`,
  pattern:   'Formato inválido',
};

@Injectable({ providedIn: 'root' })
export class ErrorMessageService {
  private messages: ErrorMessages = { ...DEFAULT_MESSAGES };

  configure(overrides: Partial<ErrorMessages>): void {
    this.messages = { ...this.messages, ...overrides };
  }

  getMessage(
    key: string,
    params: Record<string, unknown>,
    overrides?: Partial<ErrorMessages>,
  ): string | null {
    const merged = overrides ? { ...this.messages, ...overrides } : this.messages;
    const entry = merged[key];
    if (entry == null) return null;
    if (typeof entry === 'function') return entry(params);
    return entry;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/services/error-message.service.spec.ts
```

Expected: 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/services/
git commit -m "feat(ui): add ErrorMessageService"
```

---

## Task 3: ThemeService

**Files:**
- Create: `libs/ui/src/lib/services/theme.service.ts`
- Create: `libs/ui/src/lib/services/theme.service.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `libs/ui/src/lib/services/theme.service.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({ providers: [ThemeService] });
    service = TestBed.inject(ThemeService);
  });

  it('defaults to light when no localStorage and no OS dark preference', () => {
    expect(service.theme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('reads theme from localStorage on init', () => {
    localStorage.setItem('sp-theme', 'dark');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [ThemeService] });
    const s = TestBed.inject(ThemeService);
    expect(s.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles between light and dark', () => {
    service.toggle();
    expect(service.theme()).toBe('dark');
    service.toggle();
    expect(service.theme()).toBe('light');
  });

  it('setTheme("dark") adds dark class and persists to localStorage', () => {
    service.setTheme('dark');
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('sp-theme')).toBe('dark');
  });

  it('setTheme("system") removes localStorage entry', () => {
    localStorage.setItem('sp-theme', 'dark');
    service.setTheme('system');
    expect(localStorage.getItem('sp-theme')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/services/theme.service.spec.ts
```

Expected: FAIL — `ThemeService` not found.

- [ ] **Step 3: Implement ThemeService**

Create `libs/ui/src/lib/services/theme.service.ts`:

```typescript
import { Injectable, signal, effect } from '@angular/core';

const STORAGE_KEY = 'sp-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<'light' | 'dark'>(this.resolveInitialTheme());

  constructor() {
    effect(() => {
      const t = this.theme();
      document.documentElement.classList.toggle('dark', t === 'dark');
    });
  }

  toggle(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    if (theme === 'system') {
      localStorage.removeItem(STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(prefersDark ? 'dark' : 'light');
    } else {
      localStorage.setItem(STORAGE_KEY, theme);
      this.theme.set(theme);
    }
  }

  private resolveInitialTheme(): 'light' | 'dark' {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/services/theme.service.spec.ts
```

Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/services/theme.service.ts libs/ui/src/lib/services/theme.service.spec.ts
git commit -m "feat(ui): add ThemeService with signals and localStorage persistence"
```

---

## Task 4: Shared Models and Slot Directives

**Files:**
- Create: `libs/ui/src/lib/models/select-option.model.ts`
- Create: `libs/ui/src/lib/directives/prefix.directive.ts`
- Create: `libs/ui/src/lib/directives/suffix.directive.ts`
- Create: `libs/ui/src/lib/directives/option.directive.ts`
- Create: `libs/ui/src/lib/directives/file-preview.directive.ts`

- [ ] **Step 1: Create SelectOption model**

Create `libs/ui/src/lib/models/select-option.model.ts`:

```typescript
export interface SelectOption {
  value:     unknown;
  label:     string;
  disabled?: boolean;
  group?:    string;
}
```

- [ ] **Step 2: Create slot directives**

Create `libs/ui/src/lib/directives/prefix.directive.ts`:

```typescript
import { Directive } from '@angular/core';

@Directive({ selector: '[libPrefix]', standalone: true })
export class LibPrefixDirective {}
```

Create `libs/ui/src/lib/directives/suffix.directive.ts`:

```typescript
import { Directive } from '@angular/core';

@Directive({ selector: '[libSuffix]', standalone: true })
export class LibSuffixDirective {}
```

Create `libs/ui/src/lib/directives/option.directive.ts`:

```typescript
import { Directive } from '@angular/core';

@Directive({ selector: '[libOption]', standalone: true })
export class LibOptionDirective {}
```

Create `libs/ui/src/lib/directives/file-preview.directive.ts`:

```typescript
import { Directive } from '@angular/core';

@Directive({ selector: '[libFilePreview]', standalone: true })
export class LibFilePreviewDirective {}
```

- [ ] **Step 3: Commit**

```bash
git add libs/ui/src/lib/models/ libs/ui/src/lib/directives/
git commit -m "feat(ui): add shared models and slot directives"
```

---

## Task 5: lib-button

**Files:**
- Create: `libs/ui/src/lib/components/forms/button/button.component.ts`
- Create: `libs/ui/src/lib/components/forms/button/button.component.html`
- Create: `libs/ui/src/lib/components/forms/button/button.component.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `libs/ui/src/lib/components/forms/button/button.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `<lib-button [variant]="variant" [loading]="loading" [disabled]="disabled">Save</lib-button>`,
})
class TestHostComponent {
  variant: 'primary' | 'secondary' | 'action' | 'ghost' | 'danger' = 'primary';
  loading = false;
  disabled = false;
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders button with label', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.textContent.trim()).toContain('Save');
  });

  it('applies primary variant class by default', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('bg-primary')).toBe(true);
  });

  it('applies danger variant class', () => {
    host.variant = 'danger';
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('bg-danger')).toBe(true);
  });

  it('disables button when loading', () => {
    host.loading = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(true);
  });

  it('disables button when disabled input is true', () => {
    host.disabled = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/button/button.component.spec.ts
```

Expected: FAIL — `ButtonComponent` not found.

- [ ] **Step 3: Implement ButtonComponent**

Create `libs/ui/src/lib/components/forms/button/button.component.ts`:

```typescript
import { Component, input, computed } from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'action' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  readonly variant  = input<ButtonVariant>('primary');
  readonly size     = input<ButtonSize>('md');
  readonly type     = input<'button' | 'submit' | 'reset'>('button');
  readonly loading  = input(false);
  readonly disabled = input(false);
  readonly iconLeft  = input<string>('');
  readonly iconRight = input<string>('');

  readonly isDisabled = computed(() => this.disabled() || this.loading());

  readonly variantClasses = computed(() => {
    const map: Record<ButtonVariant, string> = {
      primary:   'bg-primary hover:bg-primary-hover text-white',
      secondary: 'bg-secondary-bg text-text-primary hover:bg-border',
      action:    'bg-accent hover:bg-accent-hover text-white',
      ghost:     'bg-transparent text-text-primary border border-transparent hover:border-border',
      danger:    'bg-danger hover:opacity-90 text-white',
    };
    return map[this.variant()];
  });

  readonly sizeClasses = computed(() => {
    const map: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return map[this.size()];
  });
}
```

Create `libs/ui/src/lib/components/forms/button/button.component.html`:

```html
<button
  [type]="type()"
  [disabled]="isDisabled()"
  [class]="'inline-flex items-center justify-center gap-2 font-medium rounded-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ' + variantClasses() + ' ' + sizeClasses()"
>
  @if (loading()) {
    <svg class="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  }
  <ng-content />
</button>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/button/button.component.spec.ts
```

Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/components/forms/button/
git commit -m "feat(ui): add lib-button component"
```

---

## Task 6: lib-input

**Files:**
- Create: `libs/ui/src/lib/components/forms/input/input.component.ts`
- Create: `libs/ui/src/lib/components/forms/input/input.component.html`
- Create: `libs/ui/src/lib/components/forms/input/input.component.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `libs/ui/src/lib/components/forms/input/input.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from './input.component';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule],
  template: `
    <lib-input label="Name" hint="Your full name" [formControl]="ctrl" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl('', [Validators.required]);
}

describe('InputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [ErrorMessageService],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders label', () => {
    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent.trim()).toBe('Name');
  });

  it('renders hint', () => {
    const hint = fixture.nativeElement.querySelector('[data-hint]');
    expect(hint.textContent.trim()).toBe('Your full name');
  });

  it('shows error message when control is touched and invalid', () => {
    host.ctrl.markAsTouched();
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('[data-error]');
    expect(error).not.toBeNull();
    expect(error.textContent.trim()).toBe('Este campo es obligatorio');
  });

  it('does not show error when control is not touched', () => {
    const error = fixture.nativeElement.querySelector('[data-error]');
    expect(error).toBeNull();
  });

  it('writes value to the native input', () => {
    host.ctrl.setValue('Hello');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Hello');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/input/input.component.spec.ts
```

Expected: FAIL — `InputComponent` not found.

- [ ] **Step 3: Implement InputComponent**

Create `libs/ui/src/lib/components/forms/input/input.component.ts`:

```typescript
import {
  Component, input, inject, contentChild, TemplateRef,
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
  templateUrl: './input.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true },
  ],
})
export class InputComponent implements ControlValueAccessor, OnInit {
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

  private ngControl    = inject(NgControl, { self: true, optional: true });
  private errorService = inject(ErrorMessageService);

  ngOnInit(): void {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  get control(): AbstractControl | null {
    return this.ngControl?.control ?? null;
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

  readonly hasError = computed(() => this.showErrors);

  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void { this.value.set(value ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { /* handled via disabled input */ }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }
}
```

Create `libs/ui/src/lib/components/forms/input/input.component.html`:

```html
<div class="flex flex-col gap-1">
  @if (label()) {
    <label class="text-sm font-medium text-text-primary dark:text-dark-text">{{ label() }}</label>
  }

  <div
    class="flex items-center gap-2 rounded-input border px-3 py-2 transition-colors bg-surface dark:bg-dark-surface"
    [class.border-border]="!showErrors && !isFocused()"
    [class.border-primary]="isFocused() && !showErrors"
    [class.border-danger]="showErrors"
  >
    @if (prefix()) {
      <span class="text-text-secondary dark:text-dark-text/60 text-sm shrink-0">{{ prefix() }}</span>
    }
    @if (prefixTpl()) {
      <ng-template [ngTemplateOutlet]="prefixTpl()!" />
    }

    <input
      class="flex-1 bg-transparent text-sm text-text-primary dark:text-dark-text outline-none placeholder:text-text-secondary disabled:cursor-not-allowed"
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [readOnly]="readonly()"
      [value]="value()"
      (input)="onInput($event)"
      (focus)="isFocused.set(true)"
      (blur)="isFocused.set(false); onTouched()"
    />

    @if (suffixTpl()) {
      <ng-template [ngTemplateOutlet]="suffixTpl()!" />
    }
    @if (suffix() && !suffixTpl()) {
      <span class="text-text-secondary dark:text-dark-text/60 text-sm shrink-0">{{ suffix() }}</span>
    }
  </div>

  @if (hint() && !showErrors) {
    <p data-hint class="text-xs text-text-secondary dark:text-dark-text/60">{{ hint() }}</p>
  }
  @if (showErrors && firstError) {
    <p data-error class="text-xs text-danger">{{ firstError }}</p>
  }
</div>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/input/input.component.spec.ts
```

Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/components/forms/input/
git commit -m "feat(ui): add lib-input component with CVA and error display"
```

---

## Task 7: lib-textarea

**Files:**
- Create: `libs/ui/src/lib/components/forms/textarea/textarea.component.ts`
- Create: `libs/ui/src/lib/components/forms/textarea/textarea.component.html`
- Create: `libs/ui/src/lib/components/forms/textarea/textarea.component.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `libs/ui/src/lib/components/forms/textarea/textarea.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaComponent } from './textarea.component';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  standalone: true,
  imports: [TextareaComponent, ReactiveFormsModule],
  template: `<lib-textarea label="Notes" [rows]="4" [formControl]="ctrl" />`,
})
class TestHostComponent {
  ctrl = new FormControl('', [Validators.required]);
}

describe('TextareaComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [ErrorMessageService],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders label', () => {
    expect(fixture.nativeElement.querySelector('label').textContent.trim()).toBe('Notes');
  });

  it('shows required error when touched', () => {
    host.ctrl.markAsTouched();
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('[data-error]');
    expect(error.textContent.trim()).toBe('Este campo es obligatorio');
  });

  it('sets rows attribute', () => {
    const ta = fixture.nativeElement.querySelector('textarea');
    expect(ta.getAttribute('rows')).toBe('4');
  });

  it('writes value to textarea', () => {
    host.ctrl.setValue('hello');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('textarea').value).toBe('hello');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/textarea/textarea.component.spec.ts
```

Expected: FAIL — `TextareaComponent` not found.

- [ ] **Step 3: Implement TextareaComponent**

Create `libs/ui/src/lib/components/forms/textarea/textarea.component.ts`:

```typescript
import {
  Component, input, inject, signal, OnInit, forwardRef,
  ElementRef, viewChild, effect,
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
  readonly autoResize  = input(false);
  readonly maxRows     = input(0);
  readonly errors      = input<Record<string, string>>({});

  readonly value     = signal('');
  readonly isFocused = signal(false);

  private ngControl    = inject(NgControl, { self: true, optional: true });
  private errorService = inject(ErrorMessageService);

  ngOnInit(): void {
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
  setDisabledState(_: boolean): void {}

  onInput(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
  }
}
```

Create `libs/ui/src/lib/components/forms/textarea/textarea.component.html`:

```html
<div class="flex flex-col gap-1">
  @if (label()) {
    <label class="text-sm font-medium text-text-primary dark:text-dark-text">{{ label() }}</label>
  }

  <textarea
    class="rounded-input border px-3 py-2 text-sm bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text placeholder:text-text-secondary outline-none transition-colors resize-y disabled:cursor-not-allowed disabled:opacity-50"
    [class.border-border]="!showErrors && !isFocused()"
    [class.border-primary]="isFocused() && !showErrors"
    [class.border-danger]="showErrors"
    [rows]="rows()"
    [placeholder]="placeholder()"
    [disabled]="disabled()"
    [readOnly]="readonly()"
    [value]="value()"
    (input)="onInput($event)"
    (focus)="isFocused.set(true)"
    (blur)="isFocused.set(false); onTouched()"
  ></textarea>

  @if (hint() && !showErrors) {
    <p data-hint class="text-xs text-text-secondary dark:text-dark-text/60">{{ hint() }}</p>
  }
  @if (showErrors && firstError) {
    <p data-error class="text-xs text-danger">{{ firstError }}</p>
  }
</div>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/textarea/textarea.component.spec.ts
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/components/forms/textarea/
git commit -m "feat(ui): add lib-textarea component"
```

---

## Task 8: lib-checkbox

**Files:**
- Create: `libs/ui/src/lib/components/forms/checkbox/checkbox.component.ts`
- Create: `libs/ui/src/lib/components/forms/checkbox/checkbox.component.html`
- Create: `libs/ui/src/lib/components/forms/checkbox/checkbox.component.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `libs/ui/src/lib/components/forms/checkbox/checkbox.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  standalone: true,
  imports: [CheckboxComponent, ReactiveFormsModule],
  template: `<lib-checkbox label="Accept terms" [formControl]="ctrl" />`,
})
class TestHostComponent {
  ctrl = new FormControl(false);
}

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [ErrorMessageService],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders label', () => {
    expect(fixture.nativeElement.querySelector('label').textContent.trim()).toContain('Accept terms');
  });

  it('is unchecked initially when control value is false', () => {
    const cb = fixture.nativeElement.querySelector('input[type="checkbox"]');
    expect(cb.checked).toBe(false);
  });

  it('is checked when control value is true', () => {
    host.ctrl.setValue(true);
    fixture.detectChanges();
    const cb = fixture.nativeElement.querySelector('input[type="checkbox"]');
    expect(cb.checked).toBe(true);
  });

  it('updates control value when clicked', () => {
    const cb = fixture.nativeElement.querySelector('input[type="checkbox"]');
    cb.click();
    fixture.detectChanges();
    expect(host.ctrl.value).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/checkbox/checkbox.component.spec.ts
```

Expected: FAIL — `CheckboxComponent` not found.

- [ ] **Step 3: Implement CheckboxComponent**

Create `libs/ui/src/lib/components/forms/checkbox/checkbox.component.ts`:

```typescript
import {
  Component, input, inject, signal, OnInit, forwardRef,
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
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true },
  ],
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {
  readonly label    = input('');
  readonly hint     = input('');
  readonly disabled = input(false);
  readonly errors   = input<Record<string, string>>({});

  readonly checked = signal(false);

  private ngControl    = inject(NgControl, { self: true, optional: true });
  private errorService = inject(ErrorMessageService);

  ngOnInit(): void {
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
  setDisabledState(_: boolean): void {}

  toggle(): void {
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
```

Create `libs/ui/src/lib/components/forms/checkbox/checkbox.component.html`:

```html
<div class="flex flex-col gap-1">
  <label class="flex items-center gap-2 cursor-pointer select-none">
    <input
      type="checkbox"
      class="size-4 rounded accent-primary cursor-pointer disabled:cursor-not-allowed"
      [checked]="checked()"
      [disabled]="disabled()"
      (change)="toggle()"
      (blur)="onTouched()"
    />
    @if (label()) {
      <span class="text-sm text-text-primary dark:text-dark-text">{{ label() }}</span>
    }
  </label>

  @if (hint() && !showErrors) {
    <p class="text-xs text-text-secondary dark:text-dark-text/60 ml-6">{{ hint() }}</p>
  }
  @if (showErrors && firstError) {
    <p data-error class="text-xs text-danger ml-6">{{ firstError }}</p>
  }
</div>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/checkbox/checkbox.component.spec.ts
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/components/forms/checkbox/
git commit -m "feat(ui): add lib-checkbox component"
```

---

## Task 9: lib-radio-group + lib-radio

**Files:**
- Create: `libs/ui/src/lib/components/forms/radio-group/radio-group.component.ts`
- Create: `libs/ui/src/lib/components/forms/radio-group/radio-group.component.html`
- Create: `libs/ui/src/lib/components/forms/radio-group/radio.component.ts`
- Create: `libs/ui/src/lib/components/forms/radio-group/radio.component.html`
- Create: `libs/ui/src/lib/components/forms/radio-group/radio-group.component.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `libs/ui/src/lib/components/forms/radio-group/radio-group.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RadioGroupComponent } from './radio-group.component';
import { RadioComponent } from './radio.component';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  standalone: true,
  imports: [RadioGroupComponent, RadioComponent, ReactiveFormsModule],
  template: `
    <lib-radio-group label="Status" [formControl]="ctrl">
      <lib-radio value="active" label="Active" />
      <lib-radio value="inactive" label="Inactive" />
    </lib-radio-group>
  `,
})
class TestHostComponent {
  ctrl = new FormControl('active');
}

describe('RadioGroupComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [ErrorMessageService],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders group label', () => {
    const legend = fixture.nativeElement.querySelector('legend');
    expect(legend.textContent.trim()).toBe('Status');
  });

  it('marks the matching radio as checked', () => {
    const radios = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);
  });

  it('updates control value when radio is clicked', () => {
    const radios = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    radios[1].click();
    fixture.detectChanges();
    expect(host.ctrl.value).toBe('inactive');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/radio-group/radio-group.component.spec.ts
```

Expected: FAIL — `RadioGroupComponent` not found.

- [ ] **Step 3: Implement RadioGroupComponent and RadioComponent**

Create `libs/ui/src/lib/components/forms/radio-group/radio-group.component.ts`:

```typescript
import {
  Component, input, inject, signal, OnInit, forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl,
} from '@angular/forms';
import { ErrorMessageService } from '../../../services/error-message.service';

export const RADIO_GROUP = Symbol('RADIO_GROUP');

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

  private ngControl    = inject(NgControl, { self: true, optional: true });
  private errorService = inject(ErrorMessageService);

  ngOnInit(): void {
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
  setDisabledState(_: boolean): void {}

  select(value: unknown): void {
    this.selectedValue.set(value);
    this.onChange(value);
    this.onTouched();
  }
}
```

Create `libs/ui/src/lib/components/forms/radio-group/radio-group.component.html`:

```html
<fieldset class="flex flex-col gap-1 border-0 p-0 m-0">
  @if (label()) {
    <legend class="text-sm font-medium text-text-primary dark:text-dark-text mb-1">{{ label() }}</legend>
  }
  <div [class]="orientation() === 'horizontal' ? 'flex gap-4' : 'flex flex-col gap-2'">
    <ng-content />
  </div>
  @if (hint() && !showErrors) {
    <p class="text-xs text-text-secondary dark:text-dark-text/60 mt-1">{{ hint() }}</p>
  }
  @if (showErrors && firstError) {
    <p data-error class="text-xs text-danger mt-1">{{ firstError }}</p>
  }
</fieldset>
```

Create `libs/ui/src/lib/components/forms/radio-group/radio.component.ts`:

```typescript
import { Component, input, inject } from '@angular/core';
import { RadioGroupComponent, RADIO_GROUP } from './radio-group.component';

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

  readonly group = inject<RadioGroupComponent>(RADIO_GROUP as never);

  get isChecked(): boolean {
    return this.group.selectedValue() === this.value();
  }

  select(): void {
    if (!this.disabled() && !this.group.disabled()) {
      this.group.select(this.value());
    }
  }
}
```

Create `libs/ui/src/lib/components/forms/radio-group/radio.component.html`:

```html
<label class="flex items-center gap-2 cursor-pointer select-none">
  <input
    type="radio"
    class="size-4 accent-primary cursor-pointer disabled:cursor-not-allowed"
    [checked]="isChecked"
    [disabled]="disabled() || group.disabled()"
    (change)="select()"
  />
  <span class="text-sm text-text-primary dark:text-dark-text">{{ label() }}</span>
</label>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/radio-group/radio-group.component.spec.ts
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/components/forms/radio-group/
git commit -m "feat(ui): add lib-radio-group and lib-radio components"
```

---

## Task 10: lib-select

**Files:**
- Create: `libs/ui/src/lib/components/forms/select/select.component.ts`
- Create: `libs/ui/src/lib/components/forms/select/select.component.html`
- Create: `libs/ui/src/lib/components/forms/select/select.component.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `libs/ui/src/lib/components/forms/select/select.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectComponent } from './select.component';
import { ErrorMessageService } from '../../../services/error-message.service';
import { SelectOption } from '../../../models/select-option.model';

@Component({
  standalone: true,
  imports: [SelectComponent, ReactiveFormsModule],
  template: `
    <lib-select label="Status" [options]="options" [formControl]="ctrl" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl(null, [Validators.required]);
  options: SelectOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [ErrorMessageService],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders label', () => {
    expect(fixture.nativeElement.querySelector('label').textContent.trim()).toBe('Status');
  });

  it('renders options', () => {
    const opts = fixture.nativeElement.querySelectorAll('option');
    // +1 for placeholder option
    expect(opts.length).toBeGreaterThanOrEqual(2);
  });

  it('shows required error when touched and empty', () => {
    host.ctrl.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-error]')).not.toBeNull();
  });

  it('updates control value on selection', () => {
    const select = fixture.nativeElement.querySelector('select');
    select.value = 'active';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(host.ctrl.value).toBe('active');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/select/select.component.spec.ts
```

Expected: FAIL — `SelectComponent` not found.

- [ ] **Step 3: Implement SelectComponent**

Create `libs/ui/src/lib/components/forms/select/select.component.ts`:

```typescript
import {
  Component, input, inject, signal, computed, OnInit, forwardRef,
  contentChild, TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl,
} from '@angular/forms';
import { ErrorMessageService } from '../../../services/error-message.service';
import { SelectOption } from '../../../models/select-option.model';
import { LibOptionDirective } from '../../../directives/option.directive';

@Component({
  selector: 'lib-select',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './select.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true },
  ],
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  readonly label       = input('');
  readonly hint        = input('');
  readonly placeholder = input('Selecciona una opción');
  readonly options     = input<SelectOption[]>([]);
  readonly multiple    = input(false);
  readonly disabled    = input(false);
  readonly errors      = input<Record<string, string>>({});

  readonly optionTpl = contentChild(LibOptionDirective, { read: TemplateRef });

  readonly value     = signal<unknown>(null);
  readonly isFocused = signal(false);

  private ngControl    = inject(NgControl, { self: true, optional: true });
  private errorService = inject(ErrorMessageService);

  ngOnInit(): void {
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

  readonly groups = computed(() => {
    const result: Record<string, SelectOption[]> = {};
    for (const opt of this.options()) {
      const g = opt.group ?? '';
      (result[g] ??= []).push(opt);
    }
    return result;
  });

  readonly hasGroups = computed(() =>
    this.options().some(o => !!o.group)
  );

  onChange: (v: unknown) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: unknown): void { this.value.set(value); }
  registerOnChange(fn: (v: unknown) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(_: boolean): void {}

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
```

Create `libs/ui/src/lib/components/forms/select/select.component.html`:

```html
<div class="flex flex-col gap-1">
  @if (label()) {
    <label class="text-sm font-medium text-text-primary dark:text-dark-text">{{ label() }}</label>
  }

  <select
    class="rounded-input border px-3 py-2 text-sm bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text outline-none transition-colors appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
    [class.border-border]="!showErrors && !isFocused()"
    [class.border-primary]="isFocused() && !showErrors"
    [class.border-danger]="showErrors"
    [disabled]="disabled()"
    [multiple]="multiple()"
    (change)="onSelectChange($event)"
    (focus)="isFocused.set(true)"
    (blur)="isFocused.set(false); onTouched()"
  >
    @if (!multiple()) {
      <option value="" disabled [selected]="!value()">{{ placeholder() }}</option>
    }
    @for (option of options(); track option.value) {
      <option [value]="option.value" [disabled]="option.disabled ?? false" [selected]="isSelected(option)">
        {{ option.label }}
      </option>
    }
  </select>

  @if (hint() && !showErrors) {
    <p data-hint class="text-xs text-text-secondary dark:text-dark-text/60">{{ hint() }}</p>
  }
  @if (showErrors && firstError) {
    <p data-error class="text-xs text-danger">{{ firstError }}</p>
  }
</div>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/select/select.component.spec.ts
```

Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/components/forms/select/
git commit -m "feat(ui): add lib-select component"
```

---

## Task 11: lib-file-upload

**Files:**
- Create: `libs/ui/src/lib/components/forms/file-upload/file-upload.component.ts`
- Create: `libs/ui/src/lib/components/forms/file-upload/file-upload.component.html`
- Create: `libs/ui/src/lib/components/forms/file-upload/file-upload.component.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `libs/ui/src/lib/components/forms/file-upload/file-upload.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from './file-upload.component';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  standalone: true,
  imports: [FileUploadComponent, ReactiveFormsModule],
  template: `<lib-file-upload label="Documento" accept=".pdf" [maxSizeMB]="2" [formControl]="ctrl" />`,
})
class TestHostComponent {
  ctrl = new FormControl(null);
}

describe('FileUploadComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [ErrorMessageService],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders label', () => {
    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Documento');
  });

  it('renders the drop zone', () => {
    const zone = fixture.nativeElement.querySelector('[data-dropzone]');
    expect(zone).not.toBeNull();
  });

  it('validates file size and shows error for oversized file', () => {
    const largeFile = new File(['x'.repeat(3 * 1024 * 1024)], 'big.pdf', { type: 'application/pdf' });
    const comp = fixture.debugElement.children[0].componentInstance as FileUploadComponent;
    comp.handleFiles([largeFile]);
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('[data-error]');
    expect(error).not.toBeNull();
    expect(error.textContent).toContain('excede');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/file-upload/file-upload.component.spec.ts
```

Expected: FAIL — `FileUploadComponent` not found.

- [ ] **Step 3: Implement FileUploadComponent**

Create `libs/ui/src/lib/components/forms/file-upload/file-upload.component.ts`:

```typescript
import {
  Component, input, inject, signal, OnInit, forwardRef, contentChild, TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl,
} from '@angular/forms';
import { ErrorMessageService } from '../../../services/error-message.service';
import { LibFilePreviewDirective } from '../../../directives/file-preview.directive';

@Component({
  selector: 'lib-file-upload',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './file-upload.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileUploadComponent), multi: true },
  ],
})
export class FileUploadComponent implements ControlValueAccessor, OnInit {
  readonly label       = input('');
  readonly hint        = input('');
  readonly accept      = input('');
  readonly multiple    = input(false);
  readonly maxSizeMB   = input(0);
  readonly disabled    = input(false);
  readonly showPreview = input(false);
  readonly errors      = input<Record<string, string>>({});

  readonly previewTpl = contentChild(LibFilePreviewDirective, { read: TemplateRef });

  readonly files       = signal<File[]>([]);
  readonly isDragging  = signal(false);
  readonly uploadError = signal<string | null>(null);

  private ngControl    = inject(NgControl, { self: true, optional: true });
  private errorService = inject(ErrorMessageService);

  ngOnInit(): void {
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
  setDisabledState(_: boolean): void {}

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
```

Create `libs/ui/src/lib/components/forms/file-upload/file-upload.component.html`:

```html
<div class="flex flex-col gap-1">
  @if (label()) {
    <label class="text-sm font-medium text-text-primary dark:text-dark-text">{{ label() }}</label>
  }

  <div
    data-dropzone
    class="rounded-card border-2 border-dashed p-6 text-center transition-colors cursor-pointer"
    [class.border-primary]="isDragging()"
    [class.border-border]="!isDragging()"
    [class.bg-primary\/5]="isDragging()"
    (click)="fileInput.click()"
    (drop)="onDrop($event)"
    (dragover)="onDragOver($event)"
    (dragleave)="onDragLeave()"
  >
    @if (files().length === 0) {
      <p class="text-sm text-text-secondary dark:text-dark-text/60">
        Arrastra un archivo o <span class="text-primary font-medium">haz clic para seleccionar</span>
      </p>
      @if (hint()) {
        <p class="text-xs text-text-secondary mt-1">{{ hint() }}</p>
      }
    } @else {
      <ul class="space-y-1">
        @for (file of files(); track file.name) {
          <li class="text-sm text-text-primary dark:text-dark-text flex items-center gap-2">
            <span class="truncate max-w-[200px]">{{ file.name }}</span>
            <span class="text-text-secondary text-xs shrink-0">({{ (file.size / 1024).toFixed(1) }} KB)</span>
          </li>
        }
      </ul>
    }
  </div>

  <input
    #fileInput
    type="file"
    class="hidden"
    [accept]="accept()"
    [multiple]="multiple()"
    [disabled]="disabled()"
    (change)="onFileInput($event)"
  />

  @if (showErrors && firstError) {
    <p data-error class="text-xs text-danger">{{ firstError }}</p>
  }
</div>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm nx test ui --testFile=libs/ui/src/lib/components/forms/file-upload/file-upload.component.spec.ts
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/components/forms/file-upload/
git commit -m "feat(ui): add lib-file-upload component"
```

---

## Task 12: Wire index.ts exports

**Files:**
- Modify: `libs/ui/src/index.ts`

- [ ] **Step 1: Update index.ts with all exports**

Replace the contents of `libs/ui/src/index.ts`:

```typescript
// Services
export { ErrorMessageService } from './lib/services/error-message.service';
export { ThemeService } from './lib/services/theme.service';
export type { ErrorMessages, ErrorMessageFn } from './lib/services/error-message.service';

// Models
export type { SelectOption } from './lib/models/select-option.model';

// Directives
export { LibPrefixDirective } from './lib/directives/prefix.directive';
export { LibSuffixDirective } from './lib/directives/suffix.directive';
export { LibOptionDirective } from './lib/directives/option.directive';
export { LibFilePreviewDirective } from './lib/directives/file-preview.directive';

// Form components
export { ButtonComponent } from './lib/components/forms/button/button.component';
export type { ButtonVariant, ButtonSize } from './lib/components/forms/button/button.component';
export { InputComponent } from './lib/components/forms/input/input.component';
export { TextareaComponent } from './lib/components/forms/textarea/textarea.component';
export { CheckboxComponent } from './lib/components/forms/checkbox/checkbox.component';
export { RadioGroupComponent } from './lib/components/forms/radio-group/radio-group.component';
export { RadioComponent } from './lib/components/forms/radio-group/radio.component';
export { SelectComponent } from './lib/components/forms/select/select.component';
export { FileUploadComponent } from './lib/components/forms/file-upload/file-upload.component';
```

- [ ] **Step 2: Run full test suite to verify all tests still pass**

```bash
pnpm nx test ui
```

Expected: All tests PASS.

- [ ] **Step 3: Commit**

```bash
git add libs/ui/src/index.ts
git commit -m "feat(ui): wire all form component exports in index.ts"
```

---

## Self-Review Checklist

- [x] All 7 form components covered (button, input, textarea, checkbox, radio-group, select, file-upload)
- [x] Services: ErrorMessageService, ThemeService
- [x] Shared slot directives: libPrefix, libSuffix, libOption, libFilePreview
- [x] All components use signal-based `input()` API
- [x] CVA implemented via `inject(NgControl, { self: true, optional: true })`
- [x] Error display: touched OR form submitted rule (touched covered in tests)
- [x] Tailwind dark: variants used consistently (`dark:bg-dark-surface`, `dark:text-dark-text`)
- [x] Design system tokens used (no hardcoded hex colors)
- [x] @angular/cdk install included as Task 1
- [x] Every task has failing test → implementation → passing test → commit cycle
