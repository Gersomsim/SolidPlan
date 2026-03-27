import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Button } from './button';

@Component({
  standalone: true,
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<lib-button [variant]="variant()" [loading]="loading()" [disabled]="disabled()">Save</lib-button>`,
})
class TestHostComponent {
  variant = signal<'primary' | 'secondary' | 'action' | 'ghost' | 'danger'>('primary');
  loading = signal(false);
  disabled = signal(false);
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders button with label', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.textContent.trim()).toContain('Save');
  });

  it('applies primary variant class by default', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('bg-primary')).toBe(true);
  });

  it('applies danger variant class', () => {
    host.variant.set('danger');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('bg-danger')).toBe(true);
  });

  it('disables button when loading', () => {
    host.loading.set(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(true);
  });

  it('disables button when disabled input is true', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(true);
  });
});
