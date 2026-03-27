import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaComponent } from './textarea.component';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  standalone: true,
  imports: [TextareaComponent, ReactiveFormsModule],
  template: `<lib-textarea label="Notes" [rows]="4" [formControl]="ctrl" />`,
})
class TestHostComponent {
  ctrl = new FormControl('', [Validators.required]);
}

describe('TextareaComponent', () => {
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
    expect(fixture.nativeElement.querySelector('label').textContent.trim()).toBe('Notes');
  });

  it('shows required error when touched', () => {
    host.ctrl.markAsTouched();
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('[data-error]');
    expect(error.textContent.trim()).toBe('Este campo es obligatorio');
  });

  it('sets rows attribute', () => {
    const ta = fixture.nativeElement.querySelector('textarea');
    expect(ta.getAttribute('rows')).toBe('4');
  });

  it('writes value to textarea', () => {
    host.ctrl.setValue('hello');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('textarea').value).toBe('hello');
  });
});
