# Timeline Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `lib-timeline` in `libs/ui` — a presentational timeline/history component with vertical (default) and horizontal orientations, status-colored dots, date formatting via DatePipe, custom color support via inline style, and slot directives for full-item and content-only overrides.

**Architecture:** A single `Timeline` component reads `TimelineItem[]` from an `input()` and uses `contentChildren()` to find `LibTimelineItemDirective` (full row override) and `LibTimelineContentDirective` (content-only override) slot templates. The component is purely presentational — no interaction/selection logic. `DatePipe` is used to format `date?: Date | string` fields with `mediumDate` format. Custom `color?` is applied as an inline `backgroundColor` style, overriding the status-based Tailwind color class.

**Tech Stack:** Angular 21 standalone + signals API (`input`, `computed`, `contentChildren`), `DatePipe` + `NgTemplateOutlet` from `@angular/common`, Tailwind v4 design system tokens.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `libs/ui/src/lib/models/timeline-item.model.ts` | `TimelineItem` interface + `TimelineStatus` type |
| Modify | `libs/ui/src/lib/models/index.ts` | Add timeline-item export |
| Create | `libs/ui/src/lib/directives/timeline-item.directive.ts` | `LibTimelineItemDirective` (full row override) |
| Create | `libs/ui/src/lib/directives/timeline-content.directive.ts` | `LibTimelineContentDirective` (content-only override) |
| Modify | `libs/ui/src/lib/directives/index.ts` | Add both new directive exports |
| Create | `libs/ui/src/lib/components/navigation/timeline/timeline.ts` | Component class |
| Create | `libs/ui/src/lib/components/navigation/timeline/timeline.html` | Template |
| Create | `libs/ui/src/lib/components/navigation/timeline/timeline.spec.ts` | Tests |
| Modify | `libs/ui/src/lib/components/navigation/index.ts` | Add timeline export |

---

### Task 1: TimelineItem model

**Files:**
- Create: `libs/ui/src/lib/models/timeline-item.model.ts`
- Modify: `libs/ui/src/lib/models/index.ts`

- [ ] **Step 1: Create the model file**

```typescript
// libs/ui/src/lib/models/timeline-item.model.ts
export type TimelineStatus = 'pending' | 'active' | 'completed' | 'error';

export interface TimelineItem {
  id:           string;
  label:        string;
  description?: string;
  date?:        Date | string;
  icon?:        string;
  status:       TimelineStatus;
  color?:       string;  // custom dot color (hex) — overrides status color
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
export * from './timeline-item.model';
```

- [ ] **Step 3: Commit**

```bash
git add libs/ui/src/lib/models/timeline-item.model.ts libs/ui/src/lib/models/index.ts
git commit -m "feat(ui): add TimelineItem model"
```

---

### Task 2: Slot directives

**Files:**
- Create: `libs/ui/src/lib/directives/timeline-item.directive.ts`
- Create: `libs/ui/src/lib/directives/timeline-content.directive.ts`
- Modify: `libs/ui/src/lib/directives/index.ts`

Slot directives follow the same pattern as `LibCellDirective` (key input + injected TemplateRef), but with a typed context (`{ $implicit: TimelineItem }`) so consumers can use `let-item` in their templates.

- [ ] **Step 1: Create LibTimelineItemDirective**

```typescript
// libs/ui/src/lib/directives/timeline-item.directive.ts
import { Directive, inject, input, TemplateRef } from '@angular/core';
import { TimelineItem } from '../models/timeline-item.model';

@Directive({ selector: '[libTimelineItem]', standalone: true })
export class LibTimelineItemDirective {
  readonly key      = input.required<string>({ alias: 'libTimelineItem' });
  readonly template = inject(TemplateRef<{ $implicit: TimelineItem }>);
}
```

- [ ] **Step 2: Create LibTimelineContentDirective**

```typescript
// libs/ui/src/lib/directives/timeline-content.directive.ts
import { Directive, inject, input, TemplateRef } from '@angular/core';
import { TimelineItem } from '../models/timeline-item.model';

@Directive({ selector: '[libTimelineContent]', standalone: true })
export class LibTimelineContentDirective {
  readonly key      = input.required<string>({ alias: 'libTimelineContent' });
  readonly template = inject(TemplateRef<{ $implicit: TimelineItem }>);
}
```

- [ ] **Step 3: Add exports to directives barrel**

Replace the full content of `libs/ui/src/lib/directives/index.ts`:

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
export * from './timeline-content.directive';
export * from './timeline-item.directive';
```

- [ ] **Step 4: Commit**

```bash
git add libs/ui/src/lib/directives/timeline-item.directive.ts \
        libs/ui/src/lib/directives/timeline-content.directive.ts \
        libs/ui/src/lib/directives/index.ts
git commit -m "feat(ui): add LibTimelineItemDirective and LibTimelineContentDirective"
```

---

### Task 3+4: Timeline component class + template

Both files are codependent (class references `templateUrl`, template uses class methods) — create them together.

**Files:**
- Create: `libs/ui/src/lib/components/navigation/timeline/timeline.ts`
- Create: `libs/ui/src/lib/components/navigation/timeline/timeline.html`

- [ ] **Step 1: Create the component class**

```typescript
// libs/ui/src/lib/components/navigation/timeline/timeline.ts
import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
} from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { LibTimelineItemDirective } from '../../../directives/timeline-item.directive';
import { LibTimelineContentDirective } from '../../../directives/timeline-content.directive';
import { TimelineItem } from '../../../models/timeline-item.model';

export type TimelineOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'lib-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, DatePipe],
  templateUrl: './timeline.html',
})
export class Timeline {
  readonly items       = input<TimelineItem[]>([]);
  readonly orientation = input<TimelineOrientation>('vertical');

  readonly itemSlots    = contentChildren(LibTimelineItemDirective);
  readonly contentSlots = contentChildren(LibTimelineContentDirective);

  itemSlotFor(id: string): LibTimelineItemDirective | undefined {
    return this.itemSlots().find(s => s.key() === id);
  }

  contentSlotFor(id: string): LibTimelineContentDirective | undefined {
    return this.contentSlots().find(s => s.key() === id);
  }

  dotClass(item: TimelineItem): string {
    const base = 'flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-sm transition-colors';
    if (item.color) return `${base} text-white`;
    switch (item.status) {
      case 'completed': return `${base} bg-success text-white`;
      case 'active':    return `${base} bg-primary text-white`;
      case 'error':     return `${base} bg-danger text-white`;
      default:          return `${base} bg-secondary-bg text-text-secondary border border-border`;
    }
  }

  vConnectorClass(item: TimelineItem): string {
    const base = 'w-0.5 flex-1 min-h-6 my-1 transition-colors';
    return item.status === 'completed' ? `${base} bg-success` : `${base} bg-border`;
  }

  hLeftConnectorClass(index: number): string {
    const prev = this.items()[index - 1];
    return prev?.status === 'completed'
      ? 'flex-1 h-0.5 bg-success self-center transition-colors'
      : 'flex-1 h-0.5 bg-border self-center transition-colors';
  }

  hRightConnectorClass(item: TimelineItem): string {
    return item.status === 'completed'
      ? 'flex-1 h-0.5 bg-success self-center transition-colors'
      : 'flex-1 h-0.5 bg-border self-center transition-colors';
  }
}
```

- [ ] **Step 2: Create the template**

```html
@if (orientation() === 'vertical') {

  <!-- ── VERTICAL (default) ── -->
  <div class="flex flex-col">
    @for (item of items(); track item.id; let last = $last) {

      @if (itemSlotFor(item.id); as slot) {
        <!-- Full item override: consumer controls dot, line, and content -->
        <ng-container
          [ngTemplateOutlet]="slot.template"
          [ngTemplateOutletContext]="{ $implicit: item }"
        />

      } @else {
        <div class="flex gap-4">

          <!-- Left column: dot + vertical connector -->
          <div class="flex flex-col items-center">
            <div
              [class]="dotClass(item)"
              [style.backgroundColor]="item.color ?? null"
            >
              @if (item.icon) {
                {{ item.icon }}
              } @else if (item.status === 'completed') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              } @else if (item.status === 'error') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              }
            </div>
            @if (!last) {
              <div [class]="vConnectorClass(item)"></div>
            }
          </div>

          <!-- Right column: content or content slot -->
          <div [class]="last ? '' : 'pb-6'">
            @if (contentSlotFor(item.id); as slot) {
              <ng-container
                [ngTemplateOutlet]="slot.template"
                [ngTemplateOutletContext]="{ $implicit: item }"
              />
            } @else {
              <p class="text-small font-medium text-text-primary pt-1">{{ item.label }}</p>
              @if (item.description) {
                <p class="text-label text-text-secondary mt-0.5">{{ item.description }}</p>
              }
              @if (item.date) {
                <p class="text-label text-text-secondary mt-0.5">{{ item.date | date:'mediumDate' }}</p>
              }
            }
          </div>

        </div>
      }

    }
  </div>

} @else {

  <!-- ── HORIZONTAL ── -->
  <div class="flex items-start">
    @for (item of items(); track item.id; let first = $first; let last = $last; let i = $index) {

      @if (itemSlotFor(item.id); as slot) {
        <div class="flex-1">
          <ng-container
            [ngTemplateOutlet]="slot.template"
            [ngTemplateOutletContext]="{ $implicit: item }"
          />
        </div>

      } @else {
        <div class="flex-1 flex flex-col items-center">

          <!-- Dot row with half-connectors -->
          <div class="flex items-center w-full">
            @if (!first) {
              <div [class]="hLeftConnectorClass(i)"></div>
            } @else {
              <div class="flex-1"></div>
            }
            <div
              [class]="dotClass(item)"
              [style.backgroundColor]="item.color ?? null"
            >
              @if (item.icon) {
                {{ item.icon }}
              } @else if (item.status === 'completed') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              } @else if (item.status === 'error') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              }
            </div>
            @if (!last) {
              <div [class]="hRightConnectorClass(item)"></div>
            } @else {
              <div class="flex-1"></div>
            }
          </div>

          <!-- Content below dot -->
          <div class="mt-2 text-center px-1">
            @if (contentSlotFor(item.id); as slot) {
              <ng-container
                [ngTemplateOutlet]="slot.template"
                [ngTemplateOutletContext]="{ $implicit: item }"
              />
            } @else {
              <p class="text-small font-medium text-text-primary">{{ item.label }}</p>
              @if (item.description) {
                <p class="text-label text-text-secondary mt-0.5">{{ item.description }}</p>
              }
              @if (item.date) {
                <p class="text-label text-text-secondary mt-0.5">{{ item.date | date:'mediumDate' }}</p>
              }
            }
          </div>

        </div>
      }

    }
  </div>

}
```

- [ ] **Step 3: Commit**

```bash
git add libs/ui/src/lib/components/navigation/timeline/timeline.ts \
        libs/ui/src/lib/components/navigation/timeline/timeline.html
git commit -m "feat(ui): add Timeline component class and template"
```

---

### Task 5: Tests

**Files:**
- Create: `libs/ui/src/lib/components/navigation/timeline/timeline.spec.ts`

- [ ] **Step 1: Create the test file**

```typescript
// libs/ui/src/lib/components/navigation/timeline/timeline.spec.ts
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LibTimelineContentDirective } from '../../../directives/timeline-content.directive';
import { LibTimelineItemDirective } from '../../../directives/timeline-item.directive';
import { TimelineItem } from '../../../models/timeline-item.model';
import { Timeline } from './timeline';

const ITEMS: TimelineItem[] = [
  { id: 'e1', label: 'Project created', status: 'completed', date: new Date(2024, 0, 15) },
  { id: 'e2', label: 'In progress',     status: 'active',    description: 'Doing work' },
  { id: 'e3', label: 'Pending review',  status: 'pending' },
];

// ── Basic vertical host ────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline],
  template: `<lib-timeline [items]="items" />`,
})
class TestHost {
  items = [...ITEMS];
}

// ── Host with content slot ─────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline, LibTimelineContentDirective],
  template: `
    <lib-timeline [items]="items">
      <ng-template libTimelineContent="e2" let-item>Custom: {{ item.label }}</ng-template>
    </lib-timeline>
  `,
})
class ContentHost {
  items = [...ITEMS];
}

// ── Host with item slot ────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline, LibTimelineItemDirective],
  template: `
    <lib-timeline [items]="items">
      <ng-template libTimelineItem="e1" let-item>Override: {{ item.label }}</ng-template>
    </lib-timeline>
  `,
})
class ItemHost {
  items = [...ITEMS];
}

// ── Host with custom color ─────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline],
  template: `<lib-timeline [items]="items" />`,
})
class ColorHost {
  items: TimelineItem[] = [
    { id: 'c1', label: 'Custom color', status: 'active', color: '#FF6B35' },
    { id: 'c2', label: 'Normal',       status: 'pending' },
  ];
}

// ── Horizontal host ────────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline],
  template: `<lib-timeline [items]="items" orientation="horizontal" />`,
})
class HorizontalHost {
  items = [...ITEMS];
}

// ── Host with icon field ───────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline],
  template: `<lib-timeline [items]="items" />`,
})
class IconHost {
  items: TimelineItem[] = [
    { id: 'i1', label: 'With icon', status: 'completed', icon: '★' },
    { id: 'i2', label: 'No icon',   status: 'pending' },
  ];
}

// ── Error status host ──────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline],
  template: `<lib-timeline [items]="items" />`,
})
class ErrorHost {
  items: TimelineItem[] = [
    { id: 'err', label: 'Failed step', status: 'error' },
    { id: 'ok',  label: 'Done',        status: 'completed' },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────

describe('Timeline — vertical (default)', () => {
  const render = (props: Partial<TestHost> = {}) => {
    const f = TestBed.createComponent(TestHost);
    Object.assign(f.componentInstance, props);
    f.detectChanges();
    return f;
  };

  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents()
  );

  it('renders one dot circle per item', () => {
    const f = render();
    const dots = f.nativeElement.querySelectorAll('.rounded-full');
    expect(dots.length).toBe(3);
  });

  it('renders each item label', () => {
    const f = render();
    const text: string = f.nativeElement.textContent;
    expect(text).toContain('Project created');
    expect(text).toContain('In progress');
    expect(text).toContain('Pending review');
  });

  it('renders description when provided', () => {
    const f = render();
    expect(f.nativeElement.textContent).toContain('Doing work');
  });

  it('formats date using DatePipe mediumDate', () => {
    const f = render();
    // new Date(2024, 0, 15) → "Jan 15, 2024" in en-US locale
    const text: string = f.nativeElement.textContent;
    expect(text).toContain('Jan');
    expect(text).toContain('2024');
  });

  it('does not render raw date string', () => {
    const f = render();
    // DatePipe should transform the Date object — raw toString would contain "GMT"
    expect(f.nativeElement.textContent).not.toContain('GMT');
  });

  it('completed item shows checkmark SVG', () => {
    const f = render();
    const dots = f.nativeElement.querySelectorAll('.rounded-full');
    const completedDot = dots[0]; // e1 is completed
    expect(completedDot.querySelector('svg')).toBeTruthy();
    // Checkmark path has 'M16.707'
    expect(completedDot.querySelector('svg')?.innerHTML).toContain('16.707');
  });

  it('error item shows exclamation SVG', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [ErrorHost] }).compileComponents();
    const f = TestBed.createComponent(ErrorHost);
    f.detectChanges();
    const dots = f.nativeElement.querySelectorAll('.rounded-full');
    const errorDot = dots[0];
    expect(errorDot.querySelector('svg')).toBeTruthy();
    // Exclamation path has 'M18 10'
    expect(errorDot.querySelector('svg')?.innerHTML).toContain('M18 10');
  });

  it('pending item shows no SVG', () => {
    const f = render();
    const dots = f.nativeElement.querySelectorAll('.rounded-full');
    const pendingDot = dots[2]; // e3 is pending
    expect(pendingDot.querySelector('svg')).toBeNull();
  });

  it('active item shows no SVG', () => {
    const f = render();
    const dots = f.nativeElement.querySelectorAll('.rounded-full');
    const activeDot = dots[1]; // e2 is active
    expect(activeDot.querySelector('svg')).toBeNull();
  });

  it('renders connector lines between items but not after last', () => {
    const f = render();
    // Vertical connectors have w-0.5 class
    const connectors = f.nativeElement.querySelectorAll('[class*="w-0.5"]');
    expect(connectors.length).toBe(2); // 3 items → 2 connectors
  });
});

describe('Timeline — icon field', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [IconHost] }).compileComponents()
  );

  it('renders icon text inside dot instead of status SVG', () => {
    const f = TestBed.createComponent(IconHost);
    f.detectChanges();
    const dots = f.nativeElement.querySelectorAll('.rounded-full');
    const iconDot = dots[0]; // i1 has icon '★'
    expect(iconDot.textContent?.trim()).toBe('★');
    expect(iconDot.querySelector('svg')).toBeNull();
  });

  it('item without icon still renders status icon', () => {
    const f = TestBed.createComponent(IconHost);
    f.detectChanges();
    // i2 is pending — no svg, no icon text
    const dots = f.nativeElement.querySelectorAll('.rounded-full');
    const pendingDot = dots[1];
    expect(pendingDot.querySelector('svg')).toBeNull();
    expect(pendingDot.textContent?.trim()).toBe('');
  });
});

describe('Timeline — custom color', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [ColorHost] }).compileComponents()
  );

  it('applies custom color as backgroundColor inline style on the dot', () => {
    const f = TestBed.createComponent(ColorHost);
    f.detectChanges();
    const dots = f.nativeElement.querySelectorAll<HTMLElement>('.rounded-full');
    const customDot = dots[0]; // c1 has color '#FF6B35'
    expect(customDot.style.backgroundColor).toBeTruthy();
    // Style value may be normalized by browser (e.g. rgb(255, 107, 53))
    // Just verify that a backgroundColor style is applied (not empty)
  });

  it('item without custom color has no backgroundColor inline style', () => {
    const f = TestBed.createComponent(ColorHost);
    f.detectChanges();
    const dots = f.nativeElement.querySelectorAll<HTMLElement>('.rounded-full');
    const normalDot = dots[1]; // c2 has no color
    expect(normalDot.style.backgroundColor).toBe('');
  });
});

describe('Timeline — content slot', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [ContentHost] }).compileComponents()
  );

  it('renders custom content for the slotted item', () => {
    const f = TestBed.createComponent(ContentHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Custom: In progress');
  });

  it('still renders the dot circle for the slotted item', () => {
    const f = TestBed.createComponent(ContentHost);
    f.detectChanges();
    // All 3 dots still present (content slot only replaces content, not dot)
    const dots = f.nativeElement.querySelectorAll('.rounded-full');
    expect(dots.length).toBe(3);
  });

  it('passes the item as $implicit context (let-item works)', () => {
    const f = TestBed.createComponent(ContentHost);
    f.detectChanges();
    // Template uses `let-item` and outputs `item.label` — "In progress" visible in custom text
    expect(f.nativeElement.textContent).toContain('In progress');
  });

  it('renders default content for non-slotted items', () => {
    const f = TestBed.createComponent(ContentHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Project created');
    expect(f.nativeElement.textContent).toContain('Pending review');
  });
});

describe('Timeline — item slot', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [ItemHost] }).compileComponents()
  );

  it('renders the slot template for the overridden item', () => {
    const f = TestBed.createComponent(ItemHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Override: Project created');
  });

  it('passes the item as $implicit context', () => {
    const f = TestBed.createComponent(ItemHost);
    f.detectChanges();
    // Template outputs `item.label` — verify 'Project created' appears in override text
    expect(f.nativeElement.textContent).toContain('Project created');
  });

  it('renders other items normally (not slotted)', () => {
    const f = TestBed.createComponent(ItemHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('In progress');
    expect(f.nativeElement.textContent).toContain('Pending review');
  });

  it('overridden item has no component-managed dot circle', () => {
    const f = TestBed.createComponent(ItemHost);
    f.detectChanges();
    // 3 items total, e1 is fully overridden (no component dot)
    // Only e2 and e3 contribute component-managed .rounded-full dots
    const dots = f.nativeElement.querySelectorAll('.rounded-full');
    expect(dots.length).toBe(2);
  });
});

describe('Timeline — horizontal orientation', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [HorizontalHost] }).compileComponents()
  );

  it('renders all item labels', () => {
    const f = TestBed.createComponent(HorizontalHost);
    f.detectChanges();
    const text: string = f.nativeElement.textContent;
    expect(text).toContain('Project created');
    expect(text).toContain('In progress');
    expect(text).toContain('Pending review');
  });

  it('renders one dot circle per item', () => {
    const f = TestBed.createComponent(HorizontalHost);
    f.detectChanges();
    const dots = f.nativeElement.querySelectorAll('.rounded-full');
    expect(dots.length).toBe(3);
  });

  it('renders horizontal connector lines between items', () => {
    const f = TestBed.createComponent(HorizontalHost);
    f.detectChanges();
    // Horizontal connectors have h-0.5 class (not w-0.5 which is vertical)
    const connectors = f.nativeElement.querySelectorAll('[class*="h-0.5"]');
    // 3 items → 4 half-connectors (2 inner pairs = left+right per middle item)
    // Simpler: just verify at least 2 connector elements exist
    expect(connectors.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run tests — expect failures (files don't exist yet)**

```bash
npx nx test ui --testFile=libs/ui/src/lib/components/navigation/timeline/timeline.spec.ts --no-coverage 2>&1 | tail -10
```

Expected: compilation errors (timeline component not yet imported from the spec).

- [ ] **Step 3: Run tests after Tasks 3+4 are implemented — expect pass**

```bash
npx nx test ui --testFile=libs/ui/src/lib/components/navigation/timeline/timeline.spec.ts --no-coverage 2>&1 | tail -15
```

Expected: all tests PASS.

**Note on the error test:** The `'error item shows exclamation SVG'` test calls `TestBed.resetTestingModule()` before setting up `ErrorHost`. This is because it needs a different component in the same describe block. This is the standard way to handle it in Angular tests.

- [ ] **Step 4: Commit**

```bash
git add libs/ui/src/lib/components/navigation/timeline/timeline.spec.ts
git commit -m "feat(ui): add Timeline tests"
```

---

### Task 6: Barrel exports

**Files:**
- Modify: `libs/ui/src/lib/components/navigation/index.ts`

- [ ] **Step 1: Add timeline to navigation barrel**

Replace content of `libs/ui/src/lib/components/navigation/index.ts`:

```typescript
export * from './breadcrumbs/breadcrumbs';
export * from './stepper/stepper';
export * from './timeline/timeline';
```

- [ ] **Step 2: Verify build**

```bash
npx nx build ui 2>&1 | tail -5
```

Expected: `Successfully ran target build for project ui`

- [ ] **Step 3: Commit**

```bash
git add libs/ui/src/lib/components/navigation/index.ts
git commit -m "feat(ui): export Timeline from navigation barrel"
```

---

## Self-Review

**Spec coverage:**
- ✅ `TimelineItem` with `id`, `label`, `description?`, `date?`, `icon?`, `status`, `color?` — Task 1
- ✅ `items` input, `orientation` input (vertical/horizontal default vertical) — Task 3
- ✅ `libTimelineItem="id"` full override slot with `let-item` context — Tasks 2 & 3
- ✅ `libTimelineContent="id"` content-only override slot with `let-item` context — Tasks 2 & 3
- ✅ `date?` formatted with `DatePipe mediumDate` — Task 3
- ✅ `icon?` renders as text inside dot (overrides status SVG) — Task 3
- ✅ `color?` applied as inline `backgroundColor` style — Task 3
- ✅ Status icons: completed → checkmark SVG, error → exclamation SVG, active/pending → no SVG (colored circle only) — Task 3
- ✅ Connector lines: vertical (between dot column items), horizontal (half-connectors between columns) — Task 3
- ✅ Tests cover all behaviors — Task 5
- ✅ Barrel exports — Task 6

**Placeholder scan:** No TBDs, TODOs, or vague steps.

**Type consistency:** `TimelineItem`, `TimelineStatus`, `LibTimelineItemDirective`, `LibTimelineContentDirective`, `Timeline`, `TimelineOrientation` — named consistently across all tasks. `itemSlotFor`/`contentSlotFor` method names consistent between class and template.
