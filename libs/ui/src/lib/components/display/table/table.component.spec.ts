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
