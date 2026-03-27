# lib-link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `lib-link` Angular component that auto-detects `href` vs `routerLink`, supports `variant` (default/muted/danger) and `underline` (always/hover/never) styling, and projects slot content.

**Architecture:** Single standalone component that renders an `<a>` tag. Uses `@if (routerLink())` to switch between `[routerLink]` and `[attr.href]` bindings. A `<ng-template #content>` captures the projected `ng-content` so it can be re-used inside either branch via `ngTemplateOutlet`. Styling is driven by two `computed()` class strings.

**Tech Stack:** Angular 21 standalone, Signals API (`input()`, `computed()`), `RouterLink` from `@angular/router`, `NgTemplateOutlet`, Vitest + `@analogjs/vitest-angular`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `libs/ui/src/lib/components/display/link/link.ts` | Create | Component logic + computed classes |
| `libs/ui/src/lib/components/display/link/link.html` | Create | Template with `@if` branch for routerLink vs href |
| `libs/ui/src/lib/components/display/link/link.spec.ts` | Create | Tests |
| `libs/ui/src/lib/components/display/index.ts` | Modify | Add `export * from './link/link'` |

---

### Task 1: Link component — TS + HTML

**Files:**
- Create: `libs/ui/src/lib/components/display/link/link.ts`
- Create: `libs/ui/src/lib/components/display/link/link.html`

- [ ] **Step 1: Create `link.ts`**

```typescript
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type LinkVariant   = 'default' | 'muted' | 'danger';
export type LinkUnderline = 'always' | 'hover' | 'never';
export type LinkTarget    = '_blank' | '_self';

@Component({
  selector: 'lib-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './link.html',
})
export class Link {
  readonly href       = input('');
  readonly routerLink = input<string | unknown[] | null>(null);
  readonly target     = input<LinkTarget>('_self');
  readonly variant    = input<LinkVariant>('default');
  readonly underline  = input<LinkUnderline>('hover');

  readonly linkClass = computed(() => {
    const variantClasses: Record<LinkVariant, string> = {
      default: 'text-primary hover:text-primary-hover',
      muted:   'text-text-muted hover:text-text-primary',
      danger:  'text-danger hover:text-danger',
    };
    const underlineClasses: Record<LinkUnderline, string> = {
      always: 'underline',
      hover:  'no-underline hover:underline',
      never:  'no-underline',
    };
    return `inline transition-colors ${variantClasses[this.variant()]} ${underlineClasses[this.underline()]}`;
  });
}
```

- [ ] **Step 2: Create `link.html`**

```html
<ng-template #content><ng-content /></ng-template>

@if (routerLink()) {
  <a [routerLink]="routerLink()" [target]="target()" [class]="linkClass()">
    <ng-container [ngTemplateOutlet]="content" />
  </a>
} @else {
  <a [attr.href]="href() || null" [target]="target()" [class]="linkClass()">
    <ng-container [ngTemplateOutlet]="content" />
  </a>
}
```

- [ ] **Step 3: Verify no compile errors**

```bash
npx tsc -p libs/ui/tsconfig.json --noEmit
```

Expected: no output (no errors).

- [ ] **Step 4: Commit**

```bash
git add libs/ui/src/lib/components/display/link/link.ts \
        libs/ui/src/lib/components/display/link/link.html
git commit -m "feat(ui): add Link component"
```

---

### Task 2: Tests + barrel export

**Files:**
- Create: `libs/ui/src/lib/components/display/link/link.spec.ts`
- Modify: `libs/ui/src/lib/components/display/index.ts`

- [ ] **Step 1: Create `link.spec.ts`**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Link, LinkVariant, LinkUnderline } from './link';

@Component({
  standalone: true,
  imports: [Link],
  template: `
    <lib-link [href]="href" [routerLink]="routerLink" [target]="target"
              [variant]="variant" [underline]="underline">
      Click me
    </lib-link>
  `,
})
class TestHost {
  href       = '';
  routerLink: string | null = null;
  target: '_blank' | '_self' = '_self';
  variant: LinkVariant    = 'default';
  underline: LinkUnderline = 'hover';
}

describe('Link', () => {
  const render = (props: Partial<TestHost> = {}) => {
    const fixture = TestBed.createComponent(TestHost);
    Object.assign(fixture.componentInstance, props);
    fixture.detectChanges();
    return fixture;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  const anchor = (f: ComponentFixture<TestHost>) =>
    f.nativeElement.querySelector('a') as HTMLAnchorElement;

  it('renders slot content', () => {
    const f = render({ href: '/about' });
    expect(anchor(f).textContent?.trim()).toBe('Click me');
  });

  it('renders href anchor when href is set', () => {
    const f = render({ href: 'https://example.com' });
    expect(anchor(f).getAttribute('href')).toBe('https://example.com');
  });

  it('renders no href when neither href nor routerLink is set', () => {
    const f = render();
    expect(anchor(f).getAttribute('href')).toBeNull();
  });

  it('renders routerLink anchor when routerLink is set', () => {
    const f = render({ routerLink: '/dashboard' });
    expect(anchor(f).getAttribute('href')).toBe('/dashboard');
  });

  it('applies target attribute', () => {
    const f = render({ href: 'https://example.com', target: '_blank' });
    expect(anchor(f).getAttribute('target')).toBe('_blank');
  });

  it.each([
    ['default', 'text-primary'],
    ['muted',   'text-text-muted'],
    ['danger',  'text-danger'],
  ] as [LinkVariant, string][])('variant %s applies correct class', (variant, cls) => {
    const f = render({ variant });
    expect(anchor(f).className).toContain(cls);
  });

  it.each([
    ['always', 'underline'],
    ['hover',  'no-underline'],
    ['never',  'no-underline'],
  ] as [LinkUnderline, string][])('underline %s applies correct class', (underline, cls) => {
    const f = render({ underline });
    expect(anchor(f).className).toContain(cls);
  });

  it('underline=hover also adds hover:underline class', () => {
    const f = render({ underline: 'hover' });
    expect(anchor(f).className).toContain('hover:underline');
  });
});
```

- [ ] **Step 2: Run the tests**

```bash
npm exec nx test ui -- --no-watch --testFile=src/lib/components/display/link/link.spec.ts
```

Expected: all tests pass.

- [ ] **Step 3: Update `display/index.ts`**

Edit `libs/ui/src/lib/components/display/index.ts`:

```typescript
export * from './badge/badge';
export * from './card/card';
export * from './dropdown/dropdown';
export * from './link/link';
export * from './table/table';
export * from './tabs/tab';
export * from './tabs/tabs';
```

- [ ] **Step 4: Run full suite**

```bash
npm exec nx test ui -- --no-watch
```

Expected: all tests pass (102 existing + new link tests).

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/components/display/link/ \
        libs/ui/src/lib/components/display/index.ts
git commit -m "feat(ui): add Link tests and barrel export"
```
