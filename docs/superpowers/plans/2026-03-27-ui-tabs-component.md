# lib-tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `lib-tabs` + `lib-tab` Angular components: a tab bar with horizontal/vertical orientation, icon/badge support, disabled state, and two-way `[(activeTab)]` binding.

**Architecture:** `Tabs` is the parent component that renders the tab bar by reading `contentChildren(Tab)`. It provides itself via `InjectionToken` so each `Tab` child can inject it and check if it's active. `Tab` wraps its `ng-content` in a panel div and uses `[hidden]` to show/hide based on the active state — all panels stay in the DOM. Two-way binding uses Angular's `model()` signal (`activeTab`).

**Tech Stack:** Angular 21 standalone components, Signals API (`input()`, `model()`, `contentChildren()`, `signal()`), `InjectionToken`, Vitest + `@analogjs/vitest-angular`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `libs/ui/src/lib/components/display/tabs/tab.ts` | Create | `Tab` child component — injects parent, shows/hides panel |
| `libs/ui/src/lib/components/display/tabs/tab.html` | Create | Panel div with `[hidden]` |
| `libs/ui/src/lib/components/display/tabs/tabs.ts` | Create | `Tabs` parent — tab bar, `model()`, reads `contentChildren(Tab)` |
| `libs/ui/src/lib/components/display/tabs/tabs.html` | Create | Tab bar buttons + `<ng-content>` for panels |
| `libs/ui/src/lib/components/display/tabs/tabs.spec.ts` | Create | Tests |
| `libs/ui/src/lib/components/display/index.ts` | Modify | Add `export * from './tabs/tabs'` and `export * from './tabs/tab'` |

---

### Task 1: Tab child component

**Files:**
- Create: `libs/ui/src/lib/components/display/tabs/tab.ts`
- Create: `libs/ui/src/lib/components/display/tabs/tab.html`

- [ ] **Step 1: Create `tab.ts`**

```typescript
import { ChangeDetectionStrategy, Component, InjectionToken, inject, input } from '@angular/core';

// Forward declaration — Tabs will provide this token
export const TABS = new InjectionToken<{ activeTab: () => string }>('TABS');

@Component({
  selector: 'lib-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './tab.html',
})
export class Tab {
  readonly key      = input.required<string>();
  readonly label    = input.required<string>();
  readonly icon     = input('');
  readonly disabled = input(false);
  readonly badge    = input<number | null>(null);

  readonly tabs = inject(TABS);

  get isActive(): boolean {
    return this.tabs.activeTab() === this.key();
  }
}
```

- [ ] **Step 2: Create `tab.html`**

```html
<div role="tabpanel" [hidden]="!isActive" class="w-full">
  <ng-content />
</div>
```

- [ ] **Step 3: Commit**

```bash
git add libs/ui/src/lib/components/display/tabs/tab.ts \
        libs/ui/src/lib/components/display/tabs/tab.html
git commit -m "feat(ui): add Tab child component"
```

---

### Task 2: Tabs parent component

**Files:**
- Create: `libs/ui/src/lib/components/display/tabs/tabs.ts`
- Create: `libs/ui/src/lib/components/display/tabs/tabs.html`

- [ ] **Step 1: Create `tabs.ts`**

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  input,
  model,
} from '@angular/core';
import { Tab, TABS } from './tab';

export type TabsOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'lib-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './tabs.html',
  providers: [{ provide: TABS, useExisting: forwardRef(() => Tabs) }],
})
export class Tabs {
  readonly activeTab   = model('');
  readonly orientation = input<TabsOrientation>('horizontal');

  readonly tabs = contentChildren(Tab);

  readonly containerClass = computed(() =>
    this.orientation() === 'vertical'
      ? 'flex flex-row gap-0'
      : 'flex flex-col gap-0'
  );

  readonly tabBarClass = computed(() =>
    this.orientation() === 'vertical'
      ? 'flex flex-col border-r border-border min-w-[160px] shrink-0'
      : 'flex flex-row border-b border-border'
  );

  readonly panelClass = computed(() =>
    this.orientation() === 'vertical' ? 'flex-1 pl-6 pt-0' : 'pt-4'
  );

  tabButtonClass(tab: Tab): string {
    const isActive = this.activeTab() === tab.key();
    const base = 'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none whitespace-nowrap';

    if (tab.disabled()) {
      return `${base} text-text-muted cursor-not-allowed opacity-50`;
    }

    if (this.orientation() === 'vertical') {
      return isActive
        ? `${base} border-l-2 border-primary text-primary bg-primary/5 cursor-pointer`
        : `${base} border-l-2 border-transparent text-text-secondary hover:text-text-primary hover:bg-hover-row cursor-pointer`;
    }

    return isActive
      ? `${base} border-b-2 border-primary text-primary cursor-pointer`
      : `${base} border-b-2 border-transparent text-text-secondary hover:text-text-primary cursor-pointer`;
  }

  onTabClick(tab: Tab): void {
    if (tab.disabled()) return;
    this.activeTab.set(tab.key());
  }
}
```

- [ ] **Step 2: Create `tabs.html`**

```html
<div [class]="containerClass()">
  <div [class]="tabBarClass()" role="tablist">
    @for (tab of tabs(); track tab.key()) {
      <button
        type="button"
        role="tab"
        [attr.aria-selected]="activeTab() === tab.key()"
        [attr.aria-disabled]="tab.disabled() || null"
        [class]="tabButtonClass(tab)"
        (click)="onTabClick(tab)"
      >
        @if (tab.icon()) {
          <span class="text-base leading-none">{{ tab.icon() }}</span>
        }
        {{ tab.label() }}
        @if (tab.badge()) {
          <span class="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-badge bg-primary px-1.5 text-xs font-semibold text-white">
            {{ tab.badge() }}
          </span>
        }
      </button>
    }
  </div>
  <div [class]="panelClass()">
    <ng-content />
  </div>
</div>
```

- [ ] **Step 3: Build to verify no compile errors**

```bash
npm exec nx build ui 2>&1 | grep -E "error TS|Error:|✓|built"
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add libs/ui/src/lib/components/display/tabs/tabs.ts \
        libs/ui/src/lib/components/display/tabs/tabs.html
git commit -m "feat(ui): add Tabs parent component with CDK-free tab bar"
```

---

### Task 3: Tests + barrel exports

**Files:**
- Create: `libs/ui/src/lib/components/display/tabs/tabs.spec.ts`
- Modify: `libs/ui/src/lib/components/display/index.ts`

- [ ] **Step 1: Create `tabs.spec.ts`**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Tabs } from './tabs';
import { Tab } from './tab';

@Component({
  standalone: true,
  imports: [Tabs, Tab],
  template: `
    <lib-tabs [(activeTab)]="active">
      <lib-tab key="a" label="Alpha">Panel A</lib-tab>
      <lib-tab key="b" label="Beta">Panel B</lib-tab>
      <lib-tab key="c" label="Gamma" [disabled]="true">Panel C</lib-tab>
    </lib-tabs>
  `,
})
class TestHost {
  active = 'a';
}

@Component({
  standalone: true,
  imports: [Tabs, Tab],
  template: `
    <lib-tabs [(activeTab)]="active" orientation="vertical">
      <lib-tab key="x" label="X">Panel X</lib-tab>
      <lib-tab key="y" label="Y" icon="★" [badge]="3">Panel Y</lib-tab>
    </lib-tabs>
  `,
})
class VerticalHost {
  active = 'x';
}

describe('Tabs', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const render = (props: Partial<TestHost> = {}) => {
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    Object.assign(host, props);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
  });

  const buttons = () => fixture.nativeElement.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
  const panels  = () => fixture.nativeElement.querySelectorAll<HTMLElement>('[role="tabpanel"]');

  it('renders a button for each tab', () => {
    render();
    expect(buttons().length).toBe(3);
  });

  it('shows the active panel and hides others', () => {
    render({ active: 'a' });
    expect(panels()[0].hidden).toBe(false);
    expect(panels()[1].hidden).toBe(true);
    expect(panels()[2].hidden).toBe(true);
  });

  it('tab button has aria-selected="true" for active tab', () => {
    render({ active: 'b' });
    expect(buttons()[1].getAttribute('aria-selected')).toBe('true');
    expect(buttons()[0].getAttribute('aria-selected')).toBe('false');
  });

  it('clicking a tab updates activeTab and shows its panel', () => {
    render({ active: 'a' });
    buttons()[1].click();
    fixture.detectChanges();
    expect(host.active).toBe('b');
    expect(panels()[1].hidden).toBe(false);
    expect(panels()[0].hidden).toBe(true);
  });

  it('clicking a disabled tab does not change active tab', () => {
    render({ active: 'a' });
    buttons()[2].click();
    fixture.detectChanges();
    expect(host.active).toBe('a');
  });

  it('disabled tab button has aria-disabled attribute', () => {
    render();
    expect(buttons()[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('renders tab labels', () => {
    render();
    expect(buttons()[0].textContent?.trim()).toContain('Alpha');
    expect(buttons()[1].textContent?.trim()).toContain('Beta');
  });
});

describe('Tabs — vertical orientation', () => {
  let fixture: ComponentFixture<VerticalHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VerticalHost] }).compileComponents();
    fixture = TestBed.createComponent(VerticalHost);
    fixture.detectChanges();
  });

  it('tab bar has vertical layout class', () => {
    const tabBar = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    expect(tabBar.className).toContain('flex-col');
  });

  it('renders icon when provided', () => {
    const btn = fixture.nativeElement.querySelectorAll('button[role="tab"]')[1] as HTMLButtonElement;
    expect(btn.textContent).toContain('★');
  });

  it('renders badge when provided', () => {
    const badge = fixture.nativeElement.querySelector('.rounded-badge') as HTMLElement;
    expect(badge.textContent?.trim()).toBe('3');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm exec nx test ui -- --no-watch --testFile=src/lib/components/display/tabs/tabs.spec.ts
```

Expected: all tests pass.

- [ ] **Step 3: Update `display/index.ts`**

Edit `libs/ui/src/lib/components/display/index.ts`:

```typescript
export * from './badge/badge';
export * from './card/card';
export * from './dropdown/dropdown';
export * from './tab/tab';
export * from './tabs/tabs';
export * from './table/table';
```

Wait — both files live in the same `tabs/` folder. Use:

```typescript
export * from './badge/badge';
export * from './card/card';
export * from './dropdown/dropdown';
export * from './table/table';
export * from './tabs/tab';
export * from './tabs/tabs';
```

- [ ] **Step 4: Run full suite**

```bash
npm exec nx test ui -- --no-watch
```

Expected: all tests pass (92 existing + new tabs tests).

- [ ] **Step 5: Commit**

```bash
git add libs/ui/src/lib/components/display/tabs/ \
        libs/ui/src/lib/components/display/index.ts \
        docs/superpowers/plans/2026-03-27-ui-tabs-component.md
git commit -m "feat(ui): add Tabs component with tests and barrel exports"
```
