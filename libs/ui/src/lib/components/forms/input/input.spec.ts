import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Input } from './input';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  standalone: true,
  imports: [Input, ReactiveFormsModule],
  template: `
    <lib-input label="Name" hint="Your full name" [formControl]="ctrl" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl('', [Validators.required]);
}

describe('InputComponent', () => {
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
    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent.trim()).toBe('Name');
  });

  it('renders hint', () => {
    const hint = fixture.nativeElement.querySelector('[data-hint]');
    expect(hint.textContent.trim()).toBe('Your full name');
  });

  it('shows error message when control is touched and invalid', () => {
    host.ctrl.markAsTouched();
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('[data-error]');
    expect(error).not.toBeNull();
    expect(error.textContent.trim()).toBe('Este campo es obligatorio');
  });

  it('does not show error when control is not touched', () => {
    const error = fixture.nativeElement.querySelector('[data-error]');
    expect(error).toBeNull();
  });

  it('writes value to the native input', () => {
    host.ctrl.setValue('Hello');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Hello');
  });
});
