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
