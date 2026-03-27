import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Breadcrumbs } from './breadcrumbs';
import { LibSeparatorDirective } from '../../../directives/separator.directive';
import { BreadcrumbItem } from '../../../models/breadcrumb-item.model';

const ITEMS: BreadcrumbItem[] = [
  { label: 'Home',     routerLink: '/' },
  { label: 'Projects', routerLink: '/projects' },
  { label: 'Details' },
];

@Component({
  standalone: true,
  imports: [Breadcrumbs],
  template: `<lib-breadcrumbs [items]="items" [separator]="separator" />`,
})
class TestHost {
  items: BreadcrumbItem[]       = ITEMS;
  separator: 'slash' | 'chevron' = 'chevron';
}

@Component({
  standalone: true,
  imports: [Breadcrumbs, LibSeparatorDirective],
  template: `
    <lib-breadcrumbs [items]="items">
      <ng-template libSeparator>•</ng-template>
    </lib-breadcrumbs>
  `,
})
class CustomSepHost {
  items: BreadcrumbItem[] = ITEMS;
}

describe('Breadcrumbs', () => {
  const render = (props: Partial<TestHost> = {}) => {
    const f = TestBed.createComponent(TestHost);
    Object.assign(f.componentInstance, props);
    f.detectChanges();
    return f;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders a nav with aria-label', () => {
    const f = render();
    const nav = f.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('breadcrumb');
  });

  it('renders one <li> per item', () => {
    const f = render();
    expect(f.nativeElement.querySelectorAll('li').length).toBe(3);
  });

  it('last item is plain text with aria-current="page"', () => {
    const f = render();
    const span = f.nativeElement.querySelector('[aria-current="page"]') as HTMLElement;
    expect(span.textContent?.trim()).toBe('Details');
  });

  it('last item has no anchor', () => {
    const f = render();
    const anchors = f.nativeElement.querySelectorAll('a');
    const anchorTexts = Array.from(anchors).map((a: Element) => a.textContent?.trim());
    expect(anchorTexts).not.toContain('Details');
  });

  it('items with routerLink render as anchors', () => {
    const f = render();
    const anchors = f.nativeElement.querySelectorAll<HTMLAnchorElement>('a');
    expect(anchors.length).toBe(2);
    expect(anchors[0].getAttribute('href')).toBe('/');
    expect(anchors[1].getAttribute('href')).toBe('/projects');
  });

  it('renders chevron separator by default', () => {
    const f = render();
    const seps = f.nativeElement.querySelectorAll('[aria-hidden="true"]');
    expect(seps[0].textContent?.trim()).toBe('›');
  });

  it('renders slash separator when separator=slash', () => {
    const f = render({ separator: 'slash' });
    const seps = f.nativeElement.querySelectorAll('[aria-hidden="true"]');
    expect(seps[0].textContent?.trim()).toBe('/');
  });

  it('renders separator between items but not after last', () => {
    const f = render();
    const seps = f.nativeElement.querySelectorAll('[aria-hidden="true"]');
    expect(seps.length).toBe(2); // 3 items → 2 separators
  });

  it('renders icon when item has icon', () => {
    const f = render({
      items: [{ label: 'Home', routerLink: '/', icon: '🏠' }, { label: 'End' }],
    });
    expect(f.nativeElement.textContent).toContain('🏠');
  });
});

describe('Breadcrumbs — custom separator', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSepHost],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders custom separator template', () => {
    const f = TestBed.createComponent(CustomSepHost);
    f.detectChanges();
    const seps = f.nativeElement.querySelectorAll('[aria-hidden="true"]');
    expect(seps[0].textContent?.trim()).toBe('•');
  });
});
