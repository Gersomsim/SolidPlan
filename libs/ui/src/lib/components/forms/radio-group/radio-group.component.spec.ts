import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RadioGroupComponent } from './radio-group.component';
import { RadioComponent } from './radio.component';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  standalone: true,
  imports: [RadioGroupComponent, RadioComponent, ReactiveFormsModule],
  template: `
    <lib-radio-group label="Status" [formControl]="ctrl">
      <lib-radio value="active" label="Active" />
      <lib-radio value="inactive" label="Inactive" />
    </lib-radio-group>
  `,
})
class TestHostComponent {
  ctrl = new FormControl('active');
}

describe('RadioGroupComponent', () => {
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

  it('renders group label', () => {
    const legend = fixture.nativeElement.querySelector('legend');
    expect(legend.textContent.trim()).toBe('Status');
  });

  it('marks the matching radio as checked', () => {
    const radios = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);
  });

  it('updates control value when radio is clicked', () => {
    const radios = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    radios[1].click();
    fixture.detectChanges();
    expect(host.ctrl.value).toBe('inactive');
  });
});
