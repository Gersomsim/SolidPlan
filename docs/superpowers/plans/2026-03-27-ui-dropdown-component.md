# lib-dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `lib-dropdown` Angular component using `@angular/cdk/overlay` with click/hover triggers, configurable placement, custom item rendering via slot directive, and keyboard/backdrop close.

**Architecture:** The component wraps a trigger slot (`ng-content`) in a reference div and attaches a CDK overlay panel on open. The panel is a `<ng-template #panel>` inside the component rendered as a `TemplatePortal`. Overlay is created fresh on each open and disposed on close. A `LibDropdownItemDirective` provides the optional custom item template slot.

**Tech Stack:** Angular 21 standalone components, Signals API (`input()`, `output()`, `signal()`, `viewChild()`), `@angular/cdk/overlay`, `@angular/cdk/portal`, Vitest + `@analogjs/vitest-angular`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `libs/ui/src/lib/models/dropdown-item.model.ts` | Create | `DropdownItem` interface |
| `libs/ui/src/lib/directives/dropdown-item.directive.ts` | Create | `LibDropdownItemDirective` — template slot |
| `libs/ui/src/lib/components/display/dropdown/dropdown.ts` | Create | Component logic + CDK overlay |
| `libs/ui/src/lib/components/display/dropdown/dropdown.html` | Create | Trigger wrapper + panel `<ng-template>` |
| `libs/ui/src/lib/components/display/dropdown/dropdown.spec.ts` | Create | Tests |
| `libs/ui/src/lib/components/display/index.ts` | Modify | Add `export * from './dropdown/dropdown'` |
| `libs/ui/src/lib/directives/index.ts` | Modify | Add `export * from './dropdown-item.directive'` |
| `libs/ui/src/lib/models/index.ts` | Modify | Add `export * from './dropdown-item.model'` |

---

### Task 1: DropdownItem model + LibDropdownItemDirective

**Files:**
- Create: `libs/ui/src/lib/models/dropdown-item.model.ts`
- Create: `libs/ui/src/lib/directives/dropdown-item.directive.ts`

- [ ] **Step 1: Write the failing test for the directive**

Create `libs/ui/src/lib/directives/dropdown-item.directive.spec.ts`:

```typescript
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LibDropdownItemDirective } from './dropdown-item.directive';

@Component({
  standalone: true,
  imports: [LibDropdownItemDirective],
  template: `<ng-template libDropdownItem>item</ng-template>`,
})
class TestHost {}

describe('LibDropdownItemDirective', () => {
  it('injects TemplateRef', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    // If the directive instantiates without error, TemplateRef injection works
    expect(fixture.nativeElement).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm exec nx test ui -- --no-watch --testFile=src/lib/directives/dropdown-item.directive.spec.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create the model**

Create `libs/ui/src/lib/models/dropdown-item.model.ts`:

```typescript
export interface DropdownItem {
  label:     string;
  icon?:     string;
  action?:   string;
  disabled?: boolean;
  divider?:  boolean;
}
```

- [ ] **Step 4: Create the directive**

Create `libs/ui/src/lib/directives/dropdown-item.directive.ts`:

```typescript
import { Directive, inject, TemplateRef } from '@angular/core';
import { DropdownItem } from '../models/dropdown-item.model';

@Directive({ selector: '[libDropdownItem]', standalone: true })
export class LibDropdownItemDirective {
  readonly template = inject(TemplateRef<{ $implicit: DropdownItem }>);
}
```

- [ ] **Step 5: Run to verify it passes**

```bash
npm exec nx test ui -- --no-watch --testFile=src/lib/directives/dropdown-item.directive.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add libs/ui/src/lib/models/dropdown-item.model.ts \
        libs/ui/src/lib/directives/dropdown-item.directive.ts \
        libs/ui/src/lib/directives/dropdown-item.directive.spec.ts
git commit -m "feat(ui): add DropdownItem model and LibDropdownItemDirective"
```

---

### Task 2: Dropdown component — TS + HTML + CDK overlay

**Files:**
- Create: `libs/ui/src/lib/components/display/dropdown/dropdown.ts`
- Create: `libs/ui/src/lib/components/display/dropdown/dropdown.html`

- [ ] **Step 1: Create the component TS**

Create `libs/ui/src/lib/components/display/dropdown/dropdown.ts`:

```typescript
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  contentChild,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ConnectedPosition, Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { LibDropdownItemDirective } from '../../../directives/dropdown-item.directive';
import { DropdownItem } from '../../../models/dropdown-item.model';

export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

const POSITIONS: Record<DropdownPlacement, ConnectedPosition[]> = {
  'bottom-end':   [{ originX: 'end',   originY: 'bottom', overlayX: 'end',   overlayY: 'top'    }],
  'bottom-start': [{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'    }],
  'top-end':      [{ originX: 'end',   originY: 'top',    overlayX: 'end',   overlayY: 'bottom' }],
  'top-start':    [{ originX: 'start', originY: 'top',    overlayX: 'start', overlayY: 'bottom' }],
};

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, OverlayModule],
  templateUrl: './dropdown.html',
})
export class Dropdown {
  readonly items     = input<DropdownItem[]>([]);
  readonly placement = input<DropdownPlacement>('bottom-end');
  readonly trigger   = input<'click' | 'hover'>('click');
  readonly disabled  = input(false);

  readonly itemClick = output<DropdownItem>();

  readonly customItemSlot = contentChild(LibDropdownItemDirective);

  readonly triggerEl    = viewChild.required<ElementRef>('triggerEl');
  readonly panelTemplate = viewChild.required<TemplateRef<void>>('panel');

  readonly isOpen = signal(false);

  private overlayRef: OverlayRef | null = null;
  private hoverTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly overlay    = inject(Overlay);
  private readonly vcr        = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.hoverTimer!);
      this.overlayRef?.dispose();
    });
  }

  open(): void {
    if (this.isOpen() || this.disabled()) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.triggerEl())
      .withPositions(POSITIONS[this.placement()]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: this.trigger() === 'click',
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.keyCode === ESCAPE && !hasModifierKey(event)) this.close();
    });

    this.overlayRef.attach(new TemplatePortal(this.panelTemplate(), this.vcr));
    this.isOpen.set(true);
  }

  close(): void {
    if (!this.overlayRef || !this.isOpen()) return;
    this.overlayRef.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  onItemClick(item: DropdownItem): void {
    if (item.disabled || item.divider) return;
    this.itemClick.emit(item);
    this.close();
  }

  onTriggerMouseEnter(): void {
    if (this.trigger() !== 'hover' || this.disabled()) return;
    clearTimeout(this.hoverTimer!);
    this.open();
  }

  onTriggerMouseLeave(): void {
    if (this.trigger() !== 'hover') return;
    this.hoverTimer = setTimeout(() => this.close(), 150);
  }

  onPanelMouseEnter(): void {
    if (this.trigger() !== 'hover') return;
    clearTimeout(this.hoverTimer!);
  }

  onPanelMouseLeave(): void {
    if (this.trigger() !== 'hover') return;
    this.hoverTimer = setTimeout(() => this.close(), 150);
  }

  itemClasses(item: DropdownItem): string {
    const base = 'flex w-full items-center px-4 py-2 text-sm text-left transition-colors';
    if (item.disabled) return `${base} text-text-muted cursor-not-allowed opacity-50`;
    return `${base} text-text-primary hover:bg-hover-row cursor-pointer`;
  }
}
```

- [ ] **Step 2: Create the template**

Create `libs/ui/src/lib/components/display/dropdown/dropdown.html`:

```html
<div
  #triggerEl
  class="inline-block"
  (click)="trigger() === 'click' && !disabled() ? toggle() : null"
  (mouseenter)="onTriggerMouseEnter()"
  (mouseleave)="onTriggerMouseLeave()"
>
  <ng-content />
</div>

<ng-template #panel>
  <div
    class="min-w-[160px] rounded-card border border-border bg-surface shadow-hover py-1 z-50"
    (mouseenter)="onPanelMouseEnter()"
    (mouseleave)="onPanelMouseLeave()"
  >
    @for (item of items(); track item.label) {
      @if (item.divider) {
        <hr class="my-1 border-border" />
      } @else if (customItemSlot(); as slot) {
        <div
          role="menuitem"
          [class]="itemClasses(item)"
          (click)="onItemClick(item)"
        >
          <ng-container
            [ngTemplateOutlet]="slot.template"
            [ngTemplateOutletContext]="{ $implicit: item }"
          />
        </div>
      } @else {
        <button
          type="button"
          role="menuitem"
          [class]="itemClasses(item)"
          [disabled]="item.disabled ?? false"
          (click)="onItemClick(item)"
        >
          @if (item.icon) {
            <span class="mr-2 text-base leading-none">{{ item.icon }}</span>
          }
          {{ item.label }}
        </button>
      }
    }
  </div>
</ng-template>
```

- [ ] **Step 3: Build to verify no compile errors**

```bash
npm exec nx build ui 2>&1 | tail -10
```

Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add libs/ui/src/lib/components/display/dropdown/dropdown.ts \
        libs/ui/src/lib/components/display/dropdown/dropdown.html
git commit -m "feat(ui): add Dropdown component with CDK overlay"
```

---

### Task 3: Tests + barrel exports

**Files:**
- Create: `libs/ui/src/lib/components/display/dropdown/dropdown.spec.ts`
- Modify: `libs/ui/src/lib/components/display/index.ts`
- Modify: `libs/ui/src/lib/directives/index.ts`
- Modify: `libs/ui/src/lib/models/index.ts`

- [ ] **Step 1: Write the tests**

Create `libs/ui/src/lib/components/display/dropdown/dropdown.spec.ts`:

```typescript
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Dropdown, DropdownPlacement } from './dropdown';
import { LibDropdownItemDirective } from '../../../directives/dropdown-item.directive';
import { DropdownItem } from '../../../models/dropdown-item.model';

const ITEMS: DropdownItem[] = [
  { label: 'Edit',   action: 'edit' },
  { label: 'Delete', action: 'delete' },
  { label: 'Disabled item', disabled: true },
  { divider: true, label: '' },
  { label: 'Archive', action: 'archive' },
];

@Component({
  standalone: true,
  imports: [Dropdown],
  template: `
    <lib-dropdown [items]="items" [placement]="placement" [disabled]="disabled" [trigger]="triggerType"
                  (itemClick)="clicked = $event">
      <button>Open</button>
    </lib-dropdown>
  `,
})
class TestHost {
  items: DropdownItem[]      = ITEMS;
  placement: DropdownPlacement = 'bottom-end';
  disabled                   = false;
  triggerType: 'click'|'hover' = 'click';
  clicked: DropdownItem | null = null;
}

@Component({
  standalone: true,
  imports: [Dropdown, LibDropdownItemDirective],
  template: `
    <lib-dropdown [items]="items" (itemClick)="clicked = $event">
      <button>Open</button>
      <ng-template libDropdownItem let-item>
        <span class="custom">{{ item.label }}</span>
      </ng-template>
    </lib-dropdown>
  `,
})
class CustomSlotHost {
  items: DropdownItem[] = [{ label: 'Custom', action: 'c' }];
  clicked: DropdownItem | null = null;
}

describe('Dropdown', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  const openDropdown = () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
  };

  it('renders the trigger slot', () => {
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });

  it('panel is not visible initially', () => {
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
  });

  it('opens panel on trigger click', () => {
    openDropdown();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeTruthy();
  });

  it('renders all non-divider items', () => {
    openDropdown();
    const buttons = overlayEl.querySelectorAll('button[role="menuitem"]');
    expect(buttons.length).toBe(4); // Edit, Delete, Disabled, Archive
  });

  it('renders divider as <hr>', () => {
    openDropdown();
    expect(overlayEl.querySelector('hr')).toBeTruthy();
  });

  it('emits itemClick and closes when item clicked', () => {
    openDropdown();
    const btn = overlayEl.querySelector<HTMLButtonElement>('button[role="menuitem"]')!;
    btn.click();
    fixture.detectChanges();
    expect(host.clicked?.action).toBe('edit');
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
  });

  it('does not emit itemClick for disabled items', () => {
    openDropdown();
    const buttons = overlayEl.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]');
    const disabledBtn = buttons[2]; // "Disabled item"
    disabledBtn.click();
    fixture.detectChanges();
    expect(host.clicked).toBeNull();
  });

  it('does not open when disabled', () => {
    host.disabled = true;
    fixture.detectChanges();
    openDropdown();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
  });

  it('closes on Escape key', () => {
    openDropdown();
    const event = new KeyboardEvent('keydown', { keyCode: 27, bubbles: true });
    document.dispatchEvent(event);
    fixture.detectChanges();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
  });

  it('closes on backdrop click', () => {
    openDropdown();
    const backdrop = document.querySelector<HTMLElement>('.cdk-overlay-transparent-backdrop')!;
    backdrop.click();
    fixture.detectChanges();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
  });
});

describe('Dropdown — hover trigger', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    host.triggerType = 'hover';
    fixture.detectChanges();
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  it('opens on mouseenter', fakeAsync(() => {
    const wrapper = fixture.nativeElement.querySelector('div');
    wrapper.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeTruthy();
  }));

  it('closes after mouseleave delay', fakeAsync(() => {
    const wrapper = fixture.nativeElement.querySelector('div');
    wrapper.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    wrapper.dispatchEvent(new MouseEvent('mouseleave'));
    tick(150);
    fixture.detectChanges();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
  }));
});

describe('Dropdown — custom item slot', () => {
  let fixture: ComponentFixture<CustomSlotHost>;
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CustomSlotHost] }).compileComponents();
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
    fixture = TestBed.createComponent(CustomSlotHost);
    fixture.detectChanges();
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  it('renders custom template for item', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(overlayEl.querySelector('.custom')?.textContent?.trim()).toBe('Custom');
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm exec nx test ui -- --no-watch
```

Expected: all tests pass (78 existing + new dropdown tests).

- [ ] **Step 3: Update barrel files**

Edit `libs/ui/src/lib/components/display/index.ts`:

```typescript
export * from './badge/badge';
export * from './card/card';
export * from './dropdown/dropdown';
export * from './table/table';
```

Edit `libs/ui/src/lib/directives/index.ts` — add line:

```typescript
export * from './dropdown-item.directive';
```

(Keep all existing exports, insert alphabetically among the others.)

Edit `libs/ui/src/lib/models/index.ts` — add line:

```typescript
export * from './dropdown-item.model';
```

- [ ] **Step 4: Run full test suite to confirm nothing broken**

```bash
npm exec nx test ui -- --no-watch
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/components/display/dropdown/ \
        libs/ui/src/lib/components/display/index.ts \
        libs/ui/src/lib/directives/index.ts \
        libs/ui/src/lib/models/index.ts
git commit -m "feat(ui): add Dropdown tests and barrel exports"
```
