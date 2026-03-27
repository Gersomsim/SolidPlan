# lib-breadcrumbs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `lib-breadcrumbs` component that renders a navigation trail from a `BreadcrumbItem[]`, with slash/chevron separators, optional custom separator slot, optional icons per item, and the last item always rendered as plain text.

**Architecture:** Single standalone component using `RouterLink` for clickable items and `@for` with `$last` to distinguish the final item. A `LibSeparatorDirective` captures a custom `<ng-template>` slot via `TemplateRef`; when absent the built-in separator character is shown. Component lives in a new `navigation/` folder alongside future navigation components.

**Tech Stack:** Angular 21 standalone, Signals API (`input()`, `computed()`, `contentChild()`), `RouterLink`, `NgTemplateOutlet`, Vitest + `@analogjs/vitest-angular`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `libs/ui/src/lib/models/breadcrumb-item.model.ts` | Create | `BreadcrumbItem` interface |
| `libs/ui/src/lib/directives/separator.directive.ts` | Create | `LibSeparatorDirective` — custom separator slot |
| `libs/ui/src/lib/components/navigation/breadcrumbs/breadcrumbs.ts` | Create | Component logic |
| `libs/ui/src/lib/components/navigation/breadcrumbs/breadcrumbs.html` | Create | Template: item loop, separator, last-item plain text |
| `libs/ui/src/lib/components/navigation/breadcrumbs/breadcrumbs.spec.ts` | Create | Tests |
| `libs/ui/src/lib/components/navigation/index.ts` | Create | Navigation barrel |
| `libs/ui/src/lib/components/index.ts` | Modify | Add `export * from './navigation'` |
| `libs/ui/src/lib/directives/index.ts` | Modify | Add `export * from './separator.directive'` |
| `libs/ui/src/lib/models/index.ts` | Modify | Add `export * from './breadcrumb-item.model'` |

---

### Task 1: BreadcrumbItem model + LibSeparatorDirective

**Files:**
- Create: `libs/ui/src/lib/models/breadcrumb-item.model.ts`
- Create: `libs/ui/src/lib/directives/separator.directive.ts`

- [ ] **Step 1: Create the model**

```typescript
// libs/ui/src/lib/models/breadcrumb-item.model.ts
export interface BreadcrumbItem {
  label:       string;
  routerLink?: string | unknown[];
  icon?:       string;
}
```

- [ ] **Step 2: Create the directive**

```typescript
// libs/ui/src/lib/directives/separator.directive.ts
import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: '[libSeparator]', standalone: true })
export class LibSeparatorDirective {
  readonly template = inject(TemplateRef<void>);
}
```

- [ ] **Step 3: Verify compile**

```bash
npx tsc -p libs/ui/tsconfig.json --noEmit
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add libs/ui/src/lib/models/breadcrumb-item.model.ts \
        libs/ui/src/lib/directives/separator.directive.ts
git commit -m "feat(ui): add BreadcrumbItem model and LibSeparatorDirective"
```

---

### Task 2: Breadcrumbs component — TS + HTML

**Files:**
- Create: `libs/ui/src/lib/components/navigation/breadcrumbs/breadcrumbs.ts`
- Create: `libs/ui/src/lib/components/navigation/breadcrumbs/breadcrumbs.html`

- [ ] **Step 1: Create `breadcrumbs.ts`**

```typescript
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LibSeparatorDirective } from '../../../directives/separator.directive';
import { BreadcrumbItem } from '../../../models/breadcrumb-item.model';

export type BreadcrumbSeparator = 'slash' | 'chevron';

@Component({
  selector: 'lib-breadcrumbs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './breadcrumbs.html',
})
export class Breadcrumbs {
  readonly items     = input<BreadcrumbItem[]>([]);
  readonly separator = input<BreadcrumbSeparator>('chevron');

  readonly customSeparator = contentChild(LibSeparatorDirective);

  readonly separatorChar = computed(() =>
    this.separator() === 'slash' ? '/' : '›'
  );
}
```

- [ ] **Step 2: Create `breadcrumbs.html`**

```html
<nav aria-label="breadcrumb">
  <ol class="flex items-center flex-wrap text-sm">
    @for (item of items(); track item.label; let last = $last) {
      <li class="flex items-center">
        @if (last) {
          @if (item.icon) {
            <span class="mr-1">{{ item.icon }}</span>
          }
          <span class="text-text-primary font-medium" aria-current="page">{{ item.label }}</span>
        } @else {
          @if (item.routerLink) {
            <a
              [routerLink]="item.routerLink"
              class="text-text-secondary hover:text-primary transition-colors"
            >
              @if (item.icon) {
                <span class="mr-1">{{ item.icon }}</span>
              }
              {{ item.label }}
            </a>
          } @else {
            <span class="text-text-secondary">
              @if (item.icon) {
                <span class="mr-1">{{ item.icon }}</span>
              }
              {{ item.label }}
            </span>
          }
          <span class="mx-2 text-text-muted select-none" aria-hidden="true">
            @if (customSeparator(); as slot) {
              <ng-container [ngTemplateOutlet]="slot.template" />
            } @else {
              {{ separatorChar() }}
            }
          </span>
        }
      </li>
    }
  </ol>
</nav>
```

- [ ] **Step 3: Verify compile**

```bash
npx tsc -p libs/ui/tsconfig.json --noEmit
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add libs/ui/src/lib/components/navigation/breadcrumbs/breadcrumbs.ts \
        libs/ui/src/lib/components/navigation/breadcrumbs/breadcrumbs.html
git commit -m "feat(ui): add Breadcrumbs component"
```

---

### Task 3: Tests + barrel exports

**Files:**
- Create: `libs/ui/src/lib/components/navigation/breadcrumbs/breadcrumbs.spec.ts`
- Create: `libs/ui/src/lib/components/navigation/index.ts`
- Modify: `libs/ui/src/lib/components/index.ts`
- Modify: `libs/ui/src/lib/directives/index.ts`
- Modify: `libs/ui/src/lib/models/index.ts`

- [ ] **Step 1: Create `breadcrumbs.spec.ts`**

```typescript
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Breadcrumbs } from './breadcrumbs';
import { LibSeparatorDirective } from '../../../directives/separator.directive';
import { BreadcrumbItem } from '../../../models/breadcrumb-item.model';

const ITEMS: BreadcrumbItem[] = [
  { label: 'Home',     routerLink: '/' },
  { label: 'Projects', routerLink: '/projects' },
  { label: 'Details' },
];

@Component({
  standalone: true,
  imports: [Breadcrumbs],
  template: `<lib-breadcrumbs [items]="items" [separator]="separator" />`,
})
class TestHost {
  items: BreadcrumbItem[]       = ITEMS;
  separator: 'slash' | 'chevron' = 'chevron';
}

@Component({
  standalone: true,
  imports: [Breadcrumbs, LibSeparatorDirective],
  template: `
    <lib-breadcrumbs [items]="items">
      <ng-template libSeparator>•</ng-template>
    </lib-breadcrumbs>
  `,
})
class CustomSepHost {
  items: BreadcrumbItem[] = ITEMS;
}

describe('Breadcrumbs', () => {
  const render = (props: Partial<TestHost> = {}) => {
    const f = TestBed.createComponent(TestHost);
    Object.assign(f.componentInstance, props);
    f.detectChanges();
    return f;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders a nav with aria-label', () => {
    const f = render();
    const nav = f.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('breadcrumb');
  });

  it('renders one <li> per item', () => {
    const f = render();
    expect(f.nativeElement.querySelectorAll('li').length).toBe(3);
  });

  it('last item is plain text with aria-current="page"', () => {
    const f = render();
    const span = f.nativeElement.querySelector('[aria-current="page"]') as HTMLElement;
    expect(span.textContent?.trim()).toBe('Details');
  });

  it('last item has no anchor', () => {
    const f = render();
    const anchors = f.nativeElement.querySelectorAll('a');
    const anchorTexts = Array.from(anchors).map((a: Element) => a.textContent?.trim());
    expect(anchorTexts).not.toContain('Details');
  });

  it('items with routerLink render as anchors', () => {
    const f = render();
    const anchors = f.nativeElement.querySelectorAll<HTMLAnchorElement>('a');
    expect(anchors.length).toBe(2);
    expect(anchors[0].getAttribute('href')).toBe('/');
    expect(anchors[1].getAttribute('href')).toBe('/projects');
  });

  it('renders chevron separator by default', () => {
    const f = render();
    const seps = f.nativeElement.querySelectorAll('[aria-hidden="true"]');
    expect(seps[0].textContent?.trim()).toBe('›');
  });

  it('renders slash separator when separator=slash', () => {
    const f = render({ separator: 'slash' });
    const seps = f.nativeElement.querySelectorAll('[aria-hidden="true"]');
    expect(seps[0].textContent?.trim()).toBe('/');
  });

  it('renders separator between items but not after last', () => {
    const f = render();
    const seps = f.nativeElement.querySelectorAll('[aria-hidden="true"]');
    expect(seps.length).toBe(2); // 3 items → 2 separators
  });

  it('renders icon when item has icon', () => {
    const f = render({
      items: [{ label: 'Home', routerLink: '/', icon: '🏠' }, { label: 'End' }],
    });
    expect(f.nativeElement.textContent).toContain('🏠');
  });
});

describe('Breadcrumbs — custom separator', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSepHost],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders custom separator template', () => {
    const f = TestBed.createComponent(CustomSepHost);
    f.detectChanges();
    const seps = f.nativeElement.querySelectorAll('[aria-hidden="true"]');
    expect(seps[0].textContent?.trim()).toBe('•');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm exec nx test ui -- --no-watch --testFile=src/lib/components/navigation/breadcrumbs/breadcrumbs.spec.ts
```

Expected: all tests pass.

- [ ] **Step 3: Create navigation barrel**

Create `libs/ui/src/lib/components/navigation/index.ts`:

```typescript
export * from './breadcrumbs/breadcrumbs';
```

- [ ] **Step 4: Update `components/index.ts`**

Read `libs/ui/src/lib/components/index.ts`. It currently contains:

```typescript
export * from './display';
export * from './forms';
```

Add the navigation export:

```typescript
export * from './display';
export * from './forms';
export * from './navigation';
```

- [ ] **Step 5: Update `directives/index.ts`**

Add `export * from './separator.directive';` in alphabetical position (after `prefix`, before `suffix`):

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
export * from './suffix.directive';
export * from './table-empty-state.directive';
export * from './table-loading.directive';
```

- [ ] **Step 6: Update `models/index.ts`**

Add `export * from './breadcrumb-item.model';` at the top:

```typescript
export * from './breadcrumb-item.model';
export * from './dropdown-item.model';
export * from './select-option.model';
export * from './table-column.model';
```

- [ ] **Step 7: Run full suite**

```bash
npm exec nx test ui -- --no-watch
```

Expected: all tests pass (114 existing + new breadcrumbs tests).

- [ ] **Step 8: Commit**

```bash
git add libs/ui/src/lib/components/navigation/ \
        libs/ui/src/lib/components/index.ts \
        libs/ui/src/lib/directives/index.ts \
        libs/ui/src/lib/models/index.ts
git commit -m "feat(ui): add Breadcrumbs tests and barrel exports"
```
