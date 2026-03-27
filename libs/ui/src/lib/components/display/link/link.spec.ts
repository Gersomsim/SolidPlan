import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Link, LinkVariant, LinkUnderline } from './link';

@Component({
  standalone: true,
  imports: [Link],
  template: `
    <lib-link [href]="href" [routerLink]="routerLink" [target]="target"
              [variant]="variant" [underline]="underline">
      Click me
    </lib-link>
  `,
})
class TestHost {
  href        = '';
  routerLink: string | null = null;
  target: '_blank' | '_self' = '_self';
  variant: LinkVariant    = 'default';
  underline: LinkUnderline = 'hover';
}

describe('Link', () => {
  const render = (props: Partial<TestHost> = {}) => {
    const fixture = TestBed.createComponent(TestHost);
    Object.assign(fixture.componentInstance, props);
    fixture.detectChanges();
    return fixture;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  const anchor = (f: ComponentFixture<TestHost>) =>
    f.nativeElement.querySelector('a') as HTMLAnchorElement;

  it('renders slot content', () => {
    const f = render({ href: '/about' });
    expect(anchor(f).textContent?.trim()).toBe('Click me');
  });

  it('renders href anchor when href is set', () => {
    const f = render({ href: 'https://example.com' });
    expect(anchor(f).getAttribute('href')).toBe('https://example.com');
  });

  it('renders no href when neither href nor routerLink is set', () => {
    const f = render();
    expect(anchor(f).getAttribute('href')).toBeNull();
  });

  it('renders routerLink anchor when routerLink is set', () => {
    const f = render({ routerLink: '/dashboard' });
    expect(anchor(f).getAttribute('href')).toBe('/dashboard');
  });

  it('applies target attribute', () => {
    const f = render({ href: 'https://example.com', target: '_blank' });
    expect(anchor(f).getAttribute('target')).toBe('_blank');
  });

  it.each([
    ['default', 'text-primary'],
    ['muted',   'text-text-muted'],
    ['danger',  'text-danger'],
  ] as [LinkVariant, string][])('variant %s applies correct class', (variant, cls) => {
    const f = render({ variant });
    expect(anchor(f).className).toContain(cls);
  });

  it.each([
    ['always', 'underline'],
    ['hover',  'no-underline'],
    ['never',  'no-underline'],
  ] as [LinkUnderline, string][])('underline %s applies correct class', (underline, cls) => {
    const f = render({ underline });
    expect(anchor(f).className).toContain(cls);
  });

  it('underline=hover also adds hover:underline class', () => {
    const f = render({ underline: 'hover' });
    expect(anchor(f).className).toContain('hover:underline');
  });
});
