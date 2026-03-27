# Stepper Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `lib-stepper` in `libs/ui` — a presentational multi-step progress indicator with horizontal/vertical orientation, two-way `activeStep` binding, status icons, linear mode, and slot directives for content panels and custom icons.

**Architecture:** A single `Stepper` component reads step config from an `input()` array and uses `contentChildren()` to find `LibStepContentDirective` and `LibStepIconDirective` slot templates projected via `ng-content`. The component is purely presentational — navigation logic lives in the parent. The active content panel is displayed via `ngTemplateOutlet` keyed by `activeStep`.

**Tech Stack:** Angular 21 standalone + signals API (`input`, `model`, `output`, `computed`, `contentChildren`), Tailwind v4 tokens from design system, NgTemplateOutlet.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `libs/ui/src/lib/models/step-item.model.ts` | `StepItem` interface |
| Modify | `libs/ui/src/lib/models/index.ts` | Add step-item export |
| Create | `libs/ui/src/lib/directives/step-content.directive.ts` | `LibStepContentDirective` |
| Create | `libs/ui/src/lib/directives/step-icon.directive.ts` | `LibStepIconDirective` |
| Modify | `libs/ui/src/lib/directives/index.ts` | Add both new directive exports |
| Create | `libs/ui/src/lib/components/navigation/stepper/stepper.ts` | Component class |
| Create | `libs/ui/src/lib/components/navigation/stepper/stepper.html` | Template |
| Create | `libs/ui/src/lib/components/navigation/stepper/stepper.spec.ts` | Tests |
| Modify | `libs/ui/src/lib/components/navigation/index.ts` | Add stepper export |

---

### Task 1: StepItem model

**Files:**
- Create: `libs/ui/src/lib/models/step-item.model.ts`
- Modify: `libs/ui/src/lib/models/index.ts`

- [ ] **Step 1: Create the model file**

```typescript
// libs/ui/src/lib/models/step-item.model.ts
export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface StepItem {
  key:          string;
  label:        string;
  description?: string;
  status:       StepStatus;
}
```

- [ ] **Step 2: Add export to models barrel**

Replace the full content of `libs/ui/src/lib/models/index.ts` with:

```typescript
export * from './breadcrumb-item.model';
export * from './dropdown-item.model';
export * from './select-option.model';
export * from './step-item.model';
export * from './table-column.model';
```

- [ ] **Step 3: Commit**

```bash
git add libs/ui/src/lib/models/step-item.model.ts libs/ui/src/lib/models/index.ts
git commit -m "feat(ui): add StepItem model"
```

---

### Task 2: Slot directives

**Files:**
- Create: `libs/ui/src/lib/directives/step-content.directive.ts`
- Create: `libs/ui/src/lib/directives/step-icon.directive.ts`
- Modify: `libs/ui/src/lib/directives/index.ts`

- [ ] **Step 1: Create LibStepContentDirective**

```typescript
// libs/ui/src/lib/directives/step-content.directive.ts
import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({ selector: '[libStepContent]', standalone: true })
export class LibStepContentDirective {
  readonly key      = input.required<string>({ alias: 'libStepContent' });
  readonly template = inject(TemplateRef<void>);
}
```

- [ ] **Step 2: Create LibStepIconDirective**

```typescript
// libs/ui/src/lib/directives/step-icon.directive.ts
import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({ selector: '[libStepIcon]', standalone: true })
export class LibStepIconDirective {
  readonly key      = input.required<string>({ alias: 'libStepIcon' });
  readonly template = inject(TemplateRef<void>);
}
```

- [ ] **Step 3: Add exports to directives barrel**

Add to `libs/ui/src/lib/directives/index.ts`:

```typescript
export * from './card-actions.directive';
export * from './card-footer.directive';
export * from './card-header.directive';
export * from './card-prefix.directive';
export * from './cell.directive';
export * from './dropdown-item.directive';
export * from './file-preview.directive';
export * from './option.directive';
export * from './prefix.directive';
export * from './separator.directive';
export * from './step-content.directive';
export * from './step-icon.directive';
export * from './suffix.directive';
export * from './table-empty-state.directive';
export * from './table-loading.directive';
```

- [ ] **Step 4: Commit**

```bash
git add libs/ui/src/lib/directives/step-content.directive.ts \
        libs/ui/src/lib/directives/step-icon.directive.ts \
        libs/ui/src/lib/directives/index.ts
git commit -m "feat(ui): add LibStepContentDirective and LibStepIconDirective"
```

---

### Task 3: Stepper component class

**Files:**
- Create: `libs/ui/src/lib/components/navigation/stepper/stepper.ts`

- [ ] **Step 1: Create the component class**

```typescript
// libs/ui/src/lib/components/navigation/stepper/stepper.ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  model,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LibStepContentDirective } from '../../../directives/step-content.directive';
import { LibStepIconDirective } from '../../../directives/step-icon.directive';
import { StepItem } from '../../../models/step-item.model';

export type StepperOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'lib-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './stepper.html',
})
export class Stepper {
  readonly steps       = input<StepItem[]>([]);
  readonly orientation = input<StepperOrientation>('horizontal');
  readonly activeStep  = model('');
  readonly linear      = input(false);

  readonly stepChange = output<string>();

  readonly contentSlots = contentChildren(LibStepContentDirective);
  readonly iconSlots    = contentChildren(LibStepIconDirective);

  readonly activeContent = computed(() =>
    this.contentSlots().find(s => s.key() === this.activeStep())
  );

  contentFor(key: string): LibStepContentDirective | undefined {
    return this.contentSlots().find(s => s.key() === key);
  }

  iconFor(key: string): LibStepIconDirective | undefined {
    return this.iconSlots().find(s => s.key() === key);
  }

  stepIndex(step: StepItem): number {
    return this.steps().findIndex(s => s.key === step.key) + 1;
  }

  canClick(step: StepItem): boolean {
    if (!this.linear()) return true;
    const steps    = this.steps();
    const activeIdx = steps.findIndex(s => s.key === this.activeStep());
    const targetIdx = steps.findIndex(s => s.key === step.key);
    return targetIdx <= activeIdx;
  }

  onStepClick(step: StepItem): void {
    if (!this.canClick(step)) return;
    this.activeStep.set(step.key);
    this.stepChange.emit(step.key);
  }

  stepCircleClass(step: StepItem): string {
    const base = 'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 transition-colors focus:outline-none';
    const clickable = this.canClick(step) ? 'cursor-pointer' : 'cursor-default';
    switch (step.status) {
      case 'completed': return `${base} ${clickable} bg-success text-white`;
      case 'active':    return `${base} cursor-default bg-primary text-white`;
      case 'error':     return `${base} ${clickable} bg-danger text-white`;
      default:          return `${base} ${clickable} bg-secondary-bg text-text-secondary border border-border`;
    }
  }

  leftConnectorClass(index: number): string {
    const prev = this.steps()[index - 1];
    const colored = prev?.status === 'completed';
    return colored
      ? 'flex-1 h-0.5 bg-success self-center transition-colors'
      : 'flex-1 h-0.5 bg-border self-center transition-colors';
  }

  rightConnectorClass(step: StepItem): string {
    return step.status === 'completed'
      ? 'flex-1 h-0.5 bg-success self-center transition-colors'
      : 'flex-1 h-0.5 bg-border self-center transition-colors';
  }

  verticalConnectorClass(step: StepItem): string {
    const base = 'w-0.5 flex-1 min-h-6 my-1 transition-colors';
    return step.status === 'completed'
      ? `${base} bg-success`
      : `${base} bg-border`;
  }
}
```

---

### Task 4: Stepper template

**Files:**
- Create: `libs/ui/src/lib/components/navigation/stepper/stepper.html`

- [ ] **Step 1: Create the template**

```html
<!-- libs/ui/src/lib/components/navigation/stepper/stepper.html -->
@if (orientation() === 'horizontal') {

  <!-- ── HORIZONTAL ── -->
  <div>
    <!-- Step indicator row -->
    <div class="flex items-start">
      @for (step of steps(); track step.key; let first = $first; let last = $last; let i = $index) {
        <div class="flex-1 flex flex-col items-center">

          <!-- Circle + connectors row -->
          <div class="flex items-center w-full">

            <!-- Left connector (not first) -->
            @if (!first) {
              <div [class]="leftConnectorClass(i)"></div>
            } @else {
              <div class="flex-1"></div>
            }

            <!-- Step circle -->
            <button
              type="button"
              [class]="stepCircleClass(step)"
              [attr.aria-current]="step.key === activeStep() ? 'step' : null"
              [attr.aria-label]="step.label"
              (click)="onStepClick(step)"
            >
              @if (iconFor(step.key); as slot) {
                <ng-container [ngTemplateOutlet]="slot.template" />
              } @else if (step.status === 'completed') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              } @else if (step.status === 'error') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              } @else {
                {{ stepIndex(step) }}
              }
            </button>

            <!-- Right connector (not last) -->
            @if (!last) {
              <div [class]="rightConnectorClass(step)"></div>
            } @else {
              <div class="flex-1"></div>
            }

          </div>

          <!-- Label + description below circle -->
          <div class="mt-2 text-center px-1">
            <p
              class="text-small font-medium transition-colors"
              [class.text-primary]="step.status === 'active'"
              [class.text-text-primary]="step.status !== 'active'"
            >{{ step.label }}</p>
            @if (step.description) {
              <p class="text-label text-text-secondary mt-0.5">{{ step.description }}</p>
            }
          </div>

        </div>
      }
    </div>

    <!-- Active step content panel -->
    @if (activeContent(); as slot) {
      <div class="mt-6">
        <ng-container [ngTemplateOutlet]="slot.template" />
      </div>
    }
  </div>

} @else {

  <!-- ── VERTICAL ── -->
  <div class="flex flex-col">
    @for (step of steps(); track step.key; let last = $last; let i = $index) {
      <div class="flex gap-4">

        <!-- Left column: circle + vertical connector -->
        <div class="flex flex-col items-center">
          <button
            type="button"
            [class]="stepCircleClass(step)"
            [attr.aria-current]="step.key === activeStep() ? 'step' : null"
            [attr.aria-label]="step.label"
            (click)="onStepClick(step)"
          >
            @if (iconFor(step.key); as slot) {
              <ng-container [ngTemplateOutlet]="slot.template" />
            } @else if (step.status === 'completed') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            } @else if (step.status === 'error') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            } @else {
              {{ stepIndex(step) }}
            }
          </button>

          <!-- Vertical line to next step -->
          @if (!last) {
            <div [class]="verticalConnectorClass(step)"></div>
          }
        </div>

        <!-- Right column: label + optional content -->
        <div class="pb-6" [class.pb-0]="last">
          <p
            class="text-small font-medium pt-1 transition-colors"
            [class.text-primary]="step.status === 'active'"
            [class.text-text-primary]="step.status !== 'active'"
          >{{ step.label }}</p>
          @if (step.description) {
            <p class="text-label text-text-secondary mt-0.5">{{ step.description }}</p>
          }

          <!-- Content rendered inline when this step is active -->
          @if (step.key === activeStep()) {
            @if (contentFor(step.key); as slot) {
              <div class="mt-3">
                <ng-container [ngTemplateOutlet]="slot.template" />
              </div>
            }
          }
        </div>

      </div>
    }
  </div>

}
```

---

### Task 5: Tests

**Files:**
- Create: `libs/ui/src/lib/components/navigation/stepper/stepper.spec.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// libs/ui/src/lib/components/navigation/stepper/stepper.spec.ts
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LibStepContentDirective } from '../../../directives/step-content.directive';
import { LibStepIconDirective } from '../../../directives/step-icon.directive';
import { StepItem } from '../../../models/step-item.model';
import { Stepper } from './stepper';

const STEPS: StepItem[] = [
  { key: 'info',    label: 'Information', status: 'completed'  },
  { key: 'details', label: 'Details',     status: 'active'     },
  { key: 'review',  label: 'Review',      status: 'pending'    },
];

// ── Basic host ──────────────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Stepper],
  template: `
    <lib-stepper
      [steps]="steps"
      [activeStep]="activeStep"
      (stepChange)="changed.push($event)"
    />
  `,
})
class TestHost {
  steps      = [...STEPS];
  activeStep = 'details';
  changed: string[] = [];
}

// ── Host with content slots ─────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Stepper, LibStepContentDirective],
  template: `
    <lib-stepper [steps]="steps" [(activeStep)]="activeStep">
      <ng-template libStepContent="info">Info panel</ng-template>
      <ng-template libStepContent="details">Details panel</ng-template>
      <ng-template libStepContent="review">Review panel</ng-template>
    </lib-stepper>
  `,
})
class ContentHost {
  steps      = [...STEPS];
  activeStep = 'details';
}

// ── Host with icon slot ─────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Stepper, LibStepIconDirective],
  template: `
    <lib-stepper [steps]="steps" [(activeStep)]="activeStep">
      <ng-template libStepIcon="info">★</ng-template>
    </lib-stepper>
  `,
})
class IconHost {
  steps      = [...STEPS];
  activeStep = 'details';
}

// ── Host with linear mode ───────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Stepper],
  template: `
    <lib-stepper [steps]="steps" [(activeStep)]="activeStep" [linear]="true" />
  `,
})
class LinearHost {
  steps      = [...STEPS];
  activeStep = 'details';
}

// ── Host with vertical orientation ─────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Stepper, LibStepContentDirective],
  template: `
    <lib-stepper [steps]="steps" [(activeStep)]="activeStep" orientation="vertical">
      <ng-template libStepContent="details">Details panel</ng-template>
    </lib-stepper>
  `,
})
class VerticalHost {
  steps      = [...STEPS];
  activeStep = 'details';
}

// ────────────────────────────────────────────────────────────────────────────

describe('Stepper — horizontal (default)', () => {
  const render = (props: Partial<TestHost> = {}) => {
    const f = TestBed.createComponent(TestHost);
    Object.assign(f.componentInstance, props);
    f.detectChanges();
    return f;
  };

  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents()
  );

  it('renders one button per step', () => {
    const f = render();
    expect(f.nativeElement.querySelectorAll('button').length).toBe(3);
  });

  it('renders each step label', () => {
    const f = render();
    const text: string = f.nativeElement.textContent;
    expect(text).toContain('Information');
    expect(text).toContain('Details');
    expect(text).toContain('Review');
  });

  it('renders description when provided', () => {
    const f = render({
      steps: [
        { key: 'a', label: 'Step A', description: 'Fill in basics', status: 'active' },
      ],
    });
    expect(f.nativeElement.textContent).toContain('Fill in basics');
  });

  it('active step button has aria-current="step"', () => {
    const f = render();
    const current = f.nativeElement.querySelector('[aria-current="step"]') as HTMLButtonElement;
    expect(current).toBeTruthy();
    expect(current.getAttribute('aria-label')).toBe('Details');
  });

  it('completed step shows checkmark SVG, not a number', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    const completedBtn = buttons[0]; // 'info' step is completed
    expect(completedBtn.querySelector('svg')).toBeTruthy();
    expect(completedBtn.textContent?.trim()).toBe('');
  });

  it('error step shows exclamation SVG', () => {
    const f = render({
      steps: [
        { key: 'a', label: 'A', status: 'error' },
        { key: 'b', label: 'B', status: 'pending' },
      ],
    });
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons[0].querySelector('svg')).toBeTruthy();
  });

  it('pending step shows its 1-based index', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons[2].textContent?.trim()).toBe('3'); // 'review' is pending at index 3
  });

  it('active step shows its 1-based index', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons[1].textContent?.trim()).toBe('2'); // 'details' is active at index 2
  });

  it('clicking a step emits stepChange with the step key', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    buttons[0].click();
    expect(f.componentInstance.changed).toEqual(['info']);
  });

  it('clicking a step updates activeStep', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    buttons[2].click();
    f.detectChanges();
    expect(f.componentInstance.activeStep).toBe('review');
  });
});

describe('Stepper — content slots', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [ContentHost] }).compileComponents()
  );

  it('shows content for active step only (horizontal)', () => {
    const f = TestBed.createComponent(ContentHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Details panel');
    expect(f.nativeElement.textContent).not.toContain('Info panel');
    expect(f.nativeElement.textContent).not.toContain('Review panel');
  });

  it('switches content when activeStep changes', () => {
    const f = TestBed.createComponent(ContentHost);
    f.detectChanges();
    f.componentInstance.activeStep = 'info';
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Info panel');
    expect(f.nativeElement.textContent).not.toContain('Details panel');
  });
});

describe('Stepper — icon slot', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [IconHost] }).compileComponents()
  );

  it('custom icon overrides the default (no SVG for that step)', () => {
    const f = TestBed.createComponent(IconHost);
    f.detectChanges();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    // 'info' has custom icon ★, no SVG should be rendered
    expect(buttons[0].querySelector('svg')).toBeNull();
    expect(buttons[0].textContent?.trim()).toBe('★');
  });
});

describe('Stepper — linear mode', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [LinearHost] }).compileComponents()
  );

  it('clicking a future step does not update activeStep', () => {
    const f = TestBed.createComponent(LinearHost);
    f.detectChanges();
    // 'review' is at index 2, activeStep is 'details' at index 1 — clicking 'review' is a skip
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    buttons[2].click(); // review
    f.detectChanges();
    expect(f.componentInstance.activeStep).toBe('details'); // unchanged
  });

  it('clicking a past step updates activeStep', () => {
    const f = TestBed.createComponent(LinearHost);
    f.detectChanges();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    buttons[0].click(); // info (past step)
    f.detectChanges();
    expect(f.componentInstance.activeStep).toBe('info');
  });
});

describe('Stepper — vertical orientation', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [VerticalHost] }).compileComponents()
  );

  it('renders all step labels', () => {
    const f = TestBed.createComponent(VerticalHost);
    f.detectChanges();
    const text: string = f.nativeElement.textContent;
    expect(text).toContain('Information');
    expect(text).toContain('Details');
    expect(text).toContain('Review');
  });

  it('renders content inline under the active step', () => {
    const f = TestBed.createComponent(VerticalHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Details panel');
  });

  it('does not render content for inactive steps', () => {
    const f = TestBed.createComponent(VerticalHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).not.toContain('Info panel');
  });
});
```

- [ ] **Step 2: Run tests — expect failures (component doesn't exist yet)**

```bash
npm run nx -- test ui --testFile=libs/ui/src/lib/components/navigation/stepper/stepper.spec.ts --no-coverage
```

Expected: compilation errors (files don't exist yet).

- [ ] **Step 3: Run tests after implementing Tasks 3 & 4 — expect them to pass**

```bash
npm run nx -- test ui --testFile=libs/ui/src/lib/components/navigation/stepper/stepper.spec.ts --no-coverage
```

Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
git add libs/ui/src/lib/components/navigation/stepper/
git commit -m "feat(ui): add Stepper component and tests"
```

---

### Task 6: Barrel exports

**Files:**
- Modify: `libs/ui/src/lib/components/navigation/index.ts`

- [ ] **Step 1: Add stepper to navigation barrel**

Replace content of `libs/ui/src/lib/components/navigation/index.ts`:

```typescript
export * from './breadcrumbs/breadcrumbs';
export * from './stepper/stepper';
```

- [ ] **Step 2: Verify the library builds without errors**

```bash
npm run nx -- build ui
```

Expected: BUILD SUCCESS with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add libs/ui/src/lib/components/navigation/index.ts
git commit -m "feat(ui): export Stepper from navigation barrel"
```

---

## Self-Review

**Spec coverage check:**
- ✅ `StepItem` interface with `key`, `label`, `description?`, `status` — Task 1
- ✅ `steps` input — Task 3
- ✅ `orientation` input (horizontal/vertical) — Tasks 3 & 4
- ✅ `[(activeStep)]` two-way binding via `model()` — Task 3
- ✅ `linear` input — Task 3
- ✅ `stepChange` output — Task 3
- ✅ `libStepContent="key"` slot — Tasks 2 & 4
- ✅ `libStepIcon="key"` slot — Tasks 2 & 4
- ✅ Status icons: pending/active → number, completed → checkmark SVG, error → exclamation SVG — Task 4
- ✅ Purely presentational (parent controls navigation) — design intent preserved
- ✅ Tests cover all above behaviors — Task 5
- ✅ Barrel exports — Task 6

**Placeholder scan:** No TBDs, TODOs, or vague steps found.

**Type consistency:** `StepItem`, `LibStepContentDirective`, `LibStepIconDirective`, `Stepper`, `StepperOrientation` — named consistently across all tasks.
