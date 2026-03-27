import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from './select.component';
import { ErrorMessageService } from '../../../services/error-message.service';
import { SelectOption } from '../../../models/select-option.model';

@Component({
  standalone: true,
  imports: [Select, ReactiveFormsModule],
  template: `
    <lib-select label="Status" [options]="options" [formControl]="ctrl" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl(null, [Validators.required]);
  options: SelectOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [ErrorMessageService],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders label', () => {
    expect(fixture.nativeElement.querySelector('label').textContent.trim()).toBe('Status');
  });

  it('renders options', () => {
    const opts = fixture.nativeElement.querySelectorAll('option');
    // +1 for placeholder option
    expect(opts.length).toBeGreaterThanOrEqual(2);
  });

  it('shows required error when touched and empty', () => {
    host.ctrl.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-error]')).not.toBeNull();
  });

  it('updates control value on selection', () => {
    const select = fixture.nativeElement.querySelector('select');
    select.value = 'active';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(host.ctrl.value).toBe('active');
  });
});
