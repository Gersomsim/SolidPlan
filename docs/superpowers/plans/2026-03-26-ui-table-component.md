# lib-table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `lib-table` — a sortable, selectable data table for `libs/ui` per the approved design spec.

**Architecture:** A standalone Angular 21 component that accepts `TableColumn[]` config and generic `T[]` data. Sorting and selection state are managed internally with signals and exposed via `output()` emitters. Custom cell rendering uses `ng-template` slots identified by `libCell="key"` directives, queried via `contentChildren()`. Pagination is intentionally outside the component.

**Tech Stack:** Angular 21 standalone, Signals (`input()`, `output()`, `signal()`, `computed()`, `contentChildren()`, `contentChild()`), `NgTemplateOutlet`, Tailwind v4 design system tokens, Vitest + `@analogjs/vitest-angular`

---

### Task 1: TableColumn model + slot directives

**Files:**
- Create: `libs/ui/src/lib/models/table-column.model.ts`
- Create: `libs/ui/src/lib/directives/cell.directive.ts`
- Create: `libs/ui/src/lib/directives/table-empty-state.directive.ts`
- Create: `libs/ui/src/lib/directives/table-loading.directive.ts`
- Create: `libs/ui/src/lib/directives/cell.directive.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `libs/ui/src/lib/directives/cell.directive.spec.ts`:

```typescript
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LibCellDirective } from './cell.directive';
import { LibEmptyStateDirective } from './table-empty-state.directive';
import { LibLoadingDirective } from './table-loading.directive';

@Component({
  standalone: true,
  imports: [LibCellDirective, LibEmptyStateDirective, LibLoadingDirective],
  template: `
    <ng-template libCell="name">name cell</ng-template>
    <ng-template libEmptyState>empty</ng-template>
    <ng-template libLoading>loading</ng-template>
  `,
})
class TestHostComponent {}

describe('Table slot directives', () => {
  it('LibCellDirective, LibEmptyStateDirective, LibLoadingDirective compile without errors', async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm exec nx test ui -- --testFile=libs/ui/src/lib/directives/cell.directive.spec.ts
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Create TableColumn model**

Create `libs/ui/src/lib/models/table-column.model.ts`:

```typescript
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}
```

- [ ] **Step 4: Create LibCellDirective**

Create `libs/ui/src/lib/directives/cell.directive.ts`:

```typescript
import { Directive, inject, TemplateRef, input } from '@angular/core';

@Directive({ selector: '[libCell]', standalone: true })
export class LibCellDirective {
  readonly key = input.required<string>({ alias: 'libCell' });
  readonly template = inject(TemplateRef<{ $implicit: unknown }>);
}
```

- [ ] **Step 5: Create LibEmptyStateDirective**

Create `libs/ui/src/lib/directives/table-empty-state.directive.ts`:

```typescript
import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: '[libEmptyState]', standalone: true })
export class LibEmptyStateDirective {
  readonly template = inject(TemplateRef<void>);
}
```

- [ ] **Step 6: Create LibLoadingDirective**

Create `libs/ui/src/lib/directives/table-loading.directive.ts`:

```typescript
import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({ selector: '[libLoading]', standalone: true })
export class LibLoadingDirective {
  readonly template = inject(TemplateRef<void>);
}
```

- [ ] **Step 7: Run test to verify it passes**

```bash
npm exec nx test ui -- --testFile=libs/ui/src/lib/directives/cell.directive.spec.ts
```

Expected: PASS — 1 test.

- [ ] **Step 8: Commit**

```bash
git add libs/ui/src/lib/models/table-column.model.ts \
        libs/ui/src/lib/directives/cell.directive.ts \
        libs/ui/src/lib/directives/table-empty-state.directive.ts \
        libs/ui/src/lib/directives/table-loading.directive.ts \
        libs/ui/src/lib/directives/cell.directive.spec.ts
git commit -m "feat(ui): TableColumn model + libCell/libEmptyState/libLoading slot directives"
```

---

### Task 2: Table component — rendering, empty state, loading, custom cells

**Files:**
- Create: `libs/ui/src/lib/components/display/table/table.component.ts`
- Create: `libs/ui/src/lib/components/display/table/table.component.html`
- Create: `libs/ui/src/lib/components/display/table/table.component.spec.ts`

- [ ] **Step 1: Write the failing tests**

Create `libs/ui/src/lib/components/display/table/table.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TableComponent } from './table.component';
import { TableColumn } from '../../../models/table-column.model';
import { LibCellDirective } from '../../../directives/cell.directive';

interface Project { id: number; name: string; status: string; }

const COLUMNS: TableColumn[] = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'status', label: 'Estado' },
];
const DATA: Project[] = [
  { id: 1, name: 'Torre Norte', status: 'Activo' },
  { id: 2, name: 'Puente Central', status: 'Progreso' },
];

@Component({
  standalone: true,
  imports: [TableComponent],
  template: `<lib-table [columns]="cols" [data]="rows" />`,
})
class BasicHostComponent { cols = COLUMNS; rows = DATA; }

@Component({
  standalone: true,
  imports: [TableComponent],
  template: `<lib-table [columns]="cols" [data]="[]" emptyMessage="Sin resultados" />`,
})
class EmptyHostComponent { cols = COLUMNS; }

@Component({
  standalone: true,
  imports: [TableComponent],
  template: `<lib-table [columns]="cols" [data]="[]" [loading]="true" />`,
})
class LoadingHostComponent { cols = COLUMNS; }

@Component({
  standalone: true,
  imports: [TableComponent, LibCellDirective],
  template: `
    <lib-table [columns]="cols" [data]="rows">
      <ng-template libCell="name" let-row>CUSTOM:{{ row.name }}</ng-template>
    </lib-table>
  `,
})
class CustomCellHostComponent { cols = COLUMNS; rows = DATA; }

describe('TableComponent', () => {
  describe('basic rendering', () => {
    let fixture: ComponentFixture<BasicHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [BasicHostComponent] }).compileComponents();
      fixture = TestBed.createComponent(BasicHostComponent);
      fixture.detectChanges();
    });

    it('renders column headers', () => {
      const ths = fixture.nativeElement.querySelectorAll('th');
      expect(ths[0].textContent).toContain('Nombre');
      expect(ths[1].textContent).toContain('Estado');
    });

    it('renders a row per data item', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });

    it('renders cell values', () => {
      const cells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
      expect(cells[0].textContent).toContain('Torre Norte');
      expect(cells[1].textContent).toContain('Activo');
    });
  });

  describe('empty state', () => {
    it('shows emptyMessage when data is empty', async () => {
      await TestBed.configureTestingModule({ imports: [EmptyHostComponent] }).compileComponents();
      const fixture = TestBed.createComponent(EmptyHostComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Sin resultados');
    });
  });

  describe('loading state', () => {
    it('shows skeleton rows when loading is true', async () => {
      await TestBed.configureTestingModule({ imports: [LoadingHostComponent] }).compileComponents();
      const fixture = TestBed.createComponent(LoadingHostComponent);
      fixture.detectChanges();
      const skeletons = fixture.nativeElement.querySelectorAll('[data-testid="skeleton-row"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('custom cell slot', () => {
    it('renders custom cell template for the given key', async () => {
      await TestBed.configureTestingModule({ imports: [CustomCellHostComponent] }).compileComponents();
      const fixture = TestBed.createComponent(CustomCellHostComponent);
      fixture.detectChanges();
      const firstNameCell = fixture.nativeElement.querySelectorAll('tbody tr:first-child td')[0];
      expect(firstNameCell.textContent).toContain('CUSTOM:Torre Norte');
    });
  });
});
```

- [ ] **Step 2: Run test to verify they fail**

```bash
npm exec nx test ui -- --testFile=libs/ui/src/lib/components/display/table/table.component.spec.ts
```

Expected: FAIL — TableComponent not found.

- [ ] **Step 3: Create table.component.ts**

Create `libs/ui/src/lib/components/display/table/table.component.ts`:

```typescript
import {
  Component, input, output, contentChildren, contentChild,
  signal, computed, ChangeDetectionStrategy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TableColumn } from '../../../models/table-column.model';
import { LibCellDirective } from '../../../directives/cell.directive';
import { LibEmptyStateDirective } from '../../../directives/table-empty-state.directive';
import { LibLoadingDirective } from '../../../directives/table-loading.directive';

export type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'lib-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
})
export class TableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly columns      = input<TableColumn[]>([]);
  readonly data         = input<T[]>([]);
  readonly loading      = input(false);
  readonly emptyMessage = input('No hay registros');
  readonly selectable   = input(false);
  readonly striped      = input(false);
  readonly stickyHeader = input(false);

  readonly sortChange      = output<{ key: string; direction: SortDirection }>();
  readonly rowClick        = output<T>();
  readonly selectionChange = output<T[]>();

  readonly cellSlots   = contentChildren(LibCellDirective);
  readonly emptySlot   = contentChild(LibEmptyStateDirective);
  readonly loadingSlot = contentChild(LibLoadingDirective);

  readonly sortKey       = signal<string | null>(null);
  readonly sortDirection = signal<SortDirection>(null);
  readonly selectedRows  = signal<T[]>([]);

  readonly allSelected = computed(() => {
    const d = this.data();
    return d.length > 0 && this.selectedRows().length === d.length;
  });

  getCellSlot(key: string): LibCellDirective | undefined {
    return this.cellSlots().find(s => s.key() === key);
  }

  getAlignClass(col: TableColumn): string {
    switch (col.align) {
      case 'center': return 'text-center';
      case 'right':  return 'text-right';
      default:       return 'text-left';
    }
  }

  getSortIcon(col: TableColumn): string {
    if (!col.sortable) return '';
    if (this.sortKey() !== col.key) return '↕';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  onSortClick(col: TableColumn): void {
    if (!col.sortable) return;
    const key = col.key;
    if (this.sortKey() !== key) {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    } else if (this.sortDirection() === 'asc') {
      this.sortDirection.set('desc');
    } else {
      this.sortKey.set(null);
      this.sortDirection.set(null);
    }
    this.sortChange.emit({ key, direction: this.sortDirection() });
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  toggleRowSelection(row: T): void {
    const current = this.selectedRows();
    const idx = current.indexOf(row);
    const next = idx === -1 ? [...current, row] : current.filter((_, i) => i !== idx);
    this.selectedRows.set(next);
    this.selectionChange.emit(next);
  }

  toggleAllSelection(): void {
    const next = this.allSelected() ? [] : [...this.data()];
    this.selectedRows.set(next);
    this.selectionChange.emit(next);
  }

  isRowSelected(row: T): boolean {
    return this.selectedRows().includes(row);
  }

  isRowStriped(index: number): boolean {
    return this.striped() && index % 2 !== 0;
  }
}
```

- [ ] **Step 4: Create table.component.html**

Create `libs/ui/src/lib/components/display/table/table.component.html`:

```html
<div class="w-full overflow-x-auto rounded-card border border-border-light">
  <table class="w-full border-collapse text-sm">

    <thead
      [class.sticky]="stickyHeader()"
      [class.top-0]="stickyHeader()"
      [class.z-10]="stickyHeader()"
    >
      <tr class="bg-secondary-bg text-text-secondary border-b border-border-light">
        @if (selectable()) {
          <th class="w-9 px-3 py-3 text-left">
            <input
              type="checkbox"
              [checked]="allSelected()"
              (change)="toggleAllSelection()"
              class="cursor-pointer rounded accent-primary"
            />
          </th>
        }
        @for (col of columns(); track col.key) {
          <th
            [style.width]="col.width || null"
            [class]="'px-4 py-3 font-semibold uppercase tracking-wide text-xs ' + getAlignClass(col)"
            [class.cursor-pointer]="col.sortable"
            (click)="onSortClick(col)"
          >
            {{ col.label }}
            @if (col.sortable) {
              <span class="ml-1 text-text-muted">{{ getSortIcon(col) }}</span>
            }
          </th>
        }
      </tr>
    </thead>

    <tbody>
      @if (loading()) {
        @if (loadingSlot()) {
          <tr>
            <td [attr.colspan]="columns().length + (selectable() ? 1 : 0)">
              <ng-container *ngTemplateOutlet="loadingSlot()!.template" />
            </td>
          </tr>
        } @else {
          @for (s of [1, 2, 3, 4, 5]; track s) {
            <tr data-testid="skeleton-row" class="border-b border-border-light animate-pulse">
              @if (selectable()) {
                <td class="px-3 py-4"><div class="h-4 w-4 rounded bg-border-light"></div></td>
              }
              @for (col of columns(); track col.key) {
                <td class="px-4 py-4"><div class="h-4 rounded bg-border-light w-3/4"></div></td>
              }
            </tr>
          }
        }
      } @else if (data().length === 0) {
        @if (emptySlot()) {
          <tr>
            <td [attr.colspan]="columns().length + (selectable() ? 1 : 0)">
              <ng-container *ngTemplateOutlet="emptySlot()!.template" />
            </td>
          </tr>
        } @else {
          <tr>
            <td
              [attr.colspan]="columns().length + (selectable() ? 1 : 0)"
              class="px-4 py-8 text-center text-text-muted"
            >
              {{ emptyMessage() }}
            </td>
          </tr>
        }
      } @else {
        @for (row of data(); track $index; let i = $index) {
          <tr
            [class]="'border-b border-border-light transition-colors hover:bg-secondary-bg cursor-pointer' + (isRowSelected(row) ? ' bg-primary/10' : '') + (isRowStriped(i) ? ' bg-secondary-bg' : '')"
            (click)="onRowClick(row)"
          >
            @if (selectable()) {
              <td class="px-3 py-4" (click)="$event.stopPropagation()">
                <input
                  type="checkbox"
                  [checked]="isRowSelected(row)"
                  (change)="toggleRowSelection(row)"
                  class="cursor-pointer rounded accent-primary"
                />
              </td>
            }
            @for (col of columns(); track col.key) {
              <td [class]="'px-4 py-4 text-text-primary ' + getAlignClass(col)">
                @if (getCellSlot(col.key); as slot) {
                  <ng-container *ngTemplateOutlet="slot.template; context: { $implicit: row }" />
                } @else {
                  {{ row[col.key] }}
                }
              </td>
            }
          </tr>
        }
      }
    </tbody>

  </table>
</div>
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm exec nx test ui -- --testFile=libs/ui/src/lib/components/display/table/table.component.spec.ts
```

Expected: PASS — all 7 tests pass.

- [ ] **Step 6: Commit**

```bash
git add libs/ui/src/lib/components/display/table/
git commit -m "feat(ui): lib-table component with column rendering, empty state, loading, custom cell slots"
```

---

### Task 3: Sorting, row click, and selection interaction tests

**Files:**
- Modify: `libs/ui/src/lib/components/display/table/table.component.spec.ts`

- [ ] **Step 1: Add host components and interaction tests to the spec file**

Open `libs/ui/src/lib/components/display/table/table.component.spec.ts`.

Add the `SortDirection` type import at the top of the file (after the existing imports):

```typescript
import type { SortDirection } from './table.component';
```

Add these two host components after `CustomCellHostComponent` (before the `describe` block):

```typescript
@Component({
  standalone: true,
  imports: [TableComponent],
  template: `
    <lib-table
      [columns]="cols"
      [data]="rows"
      (sortChange)="lastSort = $event"
      (rowClick)="lastRow = $event"
    />
  `,
})
class SortAndClickHostComponent {
  cols: TableColumn[] = [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'status', label: 'Estado' },
  ];
  rows: Project[] = DATA;
  lastSort: { key: string; direction: SortDirection } | null = null;
  lastRow: Project | null = null;
}

@Component({
  standalone: true,
  imports: [TableComponent],
  template: `
    <lib-table
      [columns]="cols"
      [data]="rows"
      [selectable]="true"
      (selectionChange)="selected = $event"
    />
  `,
})
class SelectableHostComponent {
  cols: TableColumn[] = [{ key: 'name', label: 'Nombre' }];
  rows: Project[] = DATA;
  selected: Project[] = [];
}
```

Add these three `describe` blocks at the end of the outer `describe('TableComponent', () => { ... })` block:

```typescript
  describe('sorting', () => {
    let fixture: ComponentFixture<SortAndClickHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [SortAndClickHostComponent] }).compileComponents();
      fixture = TestBed.createComponent(SortAndClickHostComponent);
      fixture.detectChanges();
    });

    it('emits sortChange with asc on first click of sortable column', () => {
      const th = fixture.nativeElement.querySelectorAll('th')[0];
      th.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.lastSort).toEqual({ key: 'name', direction: 'asc' });
    });

    it('emits sortChange with desc on second click', () => {
      const th = fixture.nativeElement.querySelectorAll('th')[0];
      th.click(); fixture.detectChanges();
      th.click(); fixture.detectChanges();
      expect(fixture.componentInstance.lastSort).toEqual({ key: 'name', direction: 'desc' });
    });

    it('emits sortChange with null direction on third click (reset)', () => {
      const th = fixture.nativeElement.querySelectorAll('th')[0];
      th.click(); fixture.detectChanges();
      th.click(); fixture.detectChanges();
      th.click(); fixture.detectChanges();
      expect(fixture.componentInstance.lastSort).toEqual({ key: 'name', direction: null });
    });

    it('does not emit sortChange for non-sortable column', () => {
      const th = fixture.nativeElement.querySelectorAll('th')[1]; // Estado — not sortable
      th.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.lastSort).toBeNull();
    });
  });

  describe('rowClick', () => {
    let fixture: ComponentFixture<SortAndClickHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [SortAndClickHostComponent] }).compileComponents();
      fixture = TestBed.createComponent(SortAndClickHostComponent);
      fixture.detectChanges();
    });

    it('emits rowClick with the row data when a row is clicked', () => {
      const row = fixture.nativeElement.querySelector('tbody tr');
      row.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.lastRow?.name).toBe('Torre Norte');
    });
  });

  describe('selection', () => {
    let fixture: ComponentFixture<SelectableHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [SelectableHostComponent] }).compileComponents();
      fixture = TestBed.createComponent(SelectableHostComponent);
      fixture.detectChanges();
    });

    it('renders a header checkbox when selectable is true', () => {
      const headerCheckbox = fixture.nativeElement.querySelector('thead input[type="checkbox"]');
      expect(headerCheckbox).toBeTruthy();
    });

    it('emits selectionChange with the row when a row checkbox is changed', () => {
      const rowCheckbox = fixture.nativeElement.querySelector('tbody input[type="checkbox"]');
      rowCheckbox.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.selected.length).toBe(1);
      expect(fixture.componentInstance.selected[0].name).toBe('Torre Norte');
    });

    it('selects all rows when header checkbox is clicked', () => {
      const headerCheckbox = fixture.nativeElement.querySelector('thead input[type="checkbox"]');
      headerCheckbox.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.selected.length).toBe(2);
    });

    it('deselects all rows on second header checkbox click', () => {
      const headerCheckbox = fixture.nativeElement.querySelector('thead input[type="checkbox"]');
      headerCheckbox.click(); fixture.detectChanges();
      headerCheckbox.click(); fixture.detectChanges();
      expect(fixture.componentInstance.selected.length).toBe(0);
    });
  });
```

- [ ] **Step 2: Run the full test file to verify all tests pass**

```bash
npm exec nx test ui -- --testFile=libs/ui/src/lib/components/display/table/table.component.spec.ts
```

Expected: PASS — all tests pass (including the new sorting, rowClick, and selection tests).

- [ ] **Step 3: Commit**

```bash
git add libs/ui/src/lib/components/display/table/table.component.spec.ts
git commit -m "test(ui): sorting, rowClick and selection interaction tests for lib-table"
```

---

### Task 4: Barrel exports + full suite verification

**Files:**
- Modify: `libs/ui/src/index.ts`

- [ ] **Step 1: Add exports to libs/ui/src/index.ts**

Open `libs/ui/src/index.ts` and append the following at the end of the file:

```typescript
// Models — table
export type { TableColumn } from './lib/models/table-column.model';

// Directives — table slots
export { LibCellDirective } from './lib/directives/cell.directive';
export { LibEmptyStateDirective } from './lib/directives/table-empty-state.directive';
export { LibLoadingDirective } from './lib/directives/table-loading.directive';

// Display components
export { TableComponent } from './lib/components/display/table/table.component';
export type { SortDirection } from './lib/components/display/table/table.component';
```

- [ ] **Step 2: Run the full ui test suite**

```bash
npm exec nx test ui
```

Expected: All tests pass across all spec files.

- [ ] **Step 3: Commit**

```bash
git add libs/ui/src/index.ts
git commit -m "feat(ui): export lib-table, TableColumn, and table slot directives from @org/ui"
```
