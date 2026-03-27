import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Badge, BadgeVariant } from './badge';

@Component({
  standalone: true,
  imports: [Badge],
  template: `<lib-badge [variant]="variant" [label]="label" [size]="size" [color]="color" />`,
})
class TestHost {
  variant: BadgeVariant = 'planning';
  label = 'Test';
  size: 'sm' | 'md' = 'md';
  color = '';
}

describe('Badge', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const render = (props: Partial<TestHost> = {}) => {
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    Object.assign(host, props);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
  });

  const getSpan = () => fixture.nativeElement.querySelector('span') as HTMLSpanElement;

  it('renders the label', () => {
    render({ label: 'En Progreso' });
    expect(getSpan().textContent?.trim()).toBe('En Progreso');
  });

  it('applies uppercase and pill shape classes', () => {
    render();
    const classes = getSpan().className;
    expect(classes).toContain('uppercase');
    expect(classes).toContain('rounded-badge');
  });

  it.each([
    ['planning',    'text-status-planning'],
    ['in-progress', 'text-accent'],
    ['completed',   'text-success'],
    ['delayed',     'text-danger'],
    ['review',      'text-primary'],
  ] as [BadgeVariant, string][])('variant %s applies correct text class', (variant, textClass) => {
    render({ variant });
    expect(getSpan().className).toContain(textClass);
  });

  it('sm size applies smaller padding', () => {
    render({ size: 'sm' });
    expect(getSpan().className).toContain('px-2');
    expect(getSpan().className).toContain('py-0.5');
  });

  it('md size applies larger padding', () => {
    render({ size: 'md' });
    expect(getSpan().className).toContain('px-3');
    expect(getSpan().className).toContain('py-1');
  });

  it('custom variant applies inline color styles', () => {
    render({ variant: 'custom', color: '#FF5733' });
    const span = getSpan();
    expect(span.style.color).toBeTruthy();
    expect(span.style.backgroundColor).toBeTruthy();
  });

  it('custom variant without color applies no inline styles', () => {
    render({ variant: 'custom', color: '' });
    const span = getSpan();
    expect(span.style.color).toBeFalsy();
    expect(span.style.backgroundColor).toBeFalsy();
  });
});
