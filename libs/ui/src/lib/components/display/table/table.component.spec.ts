import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Table } from './table.component';
import type { SortDirection } from './table.component';
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
  imports: [Table],
  template: `<lib-table [columns]="cols" [data]="rows" />`,
})
class BasicHostComponent { cols = COLUMNS; rows = DATA; }

@Component({
  standalone: true,
  imports: [Table],
  template: `<lib-table [columns]="cols" [data]="[]" emptyMessage="Sin resultados" />`,
})
class EmptyHostComponent { cols = COLUMNS; }

@Component({
  standalone: true,
  imports: [Table],
  template: `<lib-table [columns]="cols" [data]="[]" [loading]="true" />`,
})
class LoadingHostComponent { cols = COLUMNS; }

@Component({
  standalone: true,
  imports: [Table, LibCellDirective],
  template: `
    <lib-table [columns]="cols" [data]="rows">
      <ng-template libCell="name" let-row>CUSTOM:{{ row.name }}</ng-template>
    </lib-table>
  `,
})
class CustomCellHostComponent { cols = COLUMNS; rows = DATA; }

@Component({
  standalone: true,
  imports: [Table],
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
  imports: [Table],
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
});
