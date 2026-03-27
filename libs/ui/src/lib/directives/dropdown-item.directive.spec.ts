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
  it('injects TemplateRef without error', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement).toBeTruthy();
  });
});
