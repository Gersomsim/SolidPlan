import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  input, output,
  signal,
} from '@angular/core';
import { LibCellDirective } from '../../../directives/cell.directive';
import { LibEmptyStateDirective } from '../../../directives/table-empty-state.directive';
import { LibLoadingDirective } from '../../../directives/table-loading.directive';
import { TableColumn } from '../../../models/table-column.model';

export type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'lib-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
})
export class Table<T extends Record<string, unknown> = Record<string, unknown>> {
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
