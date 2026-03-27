import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  standalone: true,
  imports: [CheckboxComponent, ReactiveFormsModule],
  template: `<lib-checkbox label="Accept terms" [formControl]="ctrl" />`,
})
class TestHostComponent {
  ctrl = new FormControl(false);
}

describe('CheckboxComponent', () => {
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
    expect(fixture.nativeElement.querySelector('label').textContent.trim()).toContain('Accept terms');
  });

  it('is unchecked initially when control value is false', () => {
    const cb = fixture.nativeElement.querySelector('input[type="checkbox"]');
    expect(cb.checked).toBe(false);
  });

  it('is checked when control value is true', () => {
    host.ctrl.setValue(true);
    fixture.detectChanges();
    const cb = fixture.nativeElement.querySelector('input[type="checkbox"]');
    expect(cb.checked).toBe(true);
  });

  it('updates control value when clicked', () => {
    const cb = fixture.nativeElement.querySelector('input[type="checkbox"]');
    cb.click();
    fixture.detectChanges();
    expect(host.ctrl.value).toBe(true);
  });
});
