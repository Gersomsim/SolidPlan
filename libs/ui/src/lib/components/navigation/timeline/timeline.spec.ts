// libs/ui/src/lib/components/navigation/timeline/timeline.spec.ts
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LibTimelineContentDirective } from '../../../directives/timeline-content.directive';
import { LibTimelineItemDirective } from '../../../directives/timeline-item.directive';
import { TimelineItem } from '../../../models/timeline-item.model';
import { Timeline } from './timeline';

const ITEMS: TimelineItem[] = [
  { id: 'e1', label: 'Project created', status: 'completed', date: new Date(2024, 0, 15) },
  { id: 'e2', label: 'In progress',     status: 'active',    description: 'Doing work' },
  { id: 'e3', label: 'Pending review',  status: 'pending' },
];

// ── Basic vertical host ────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline],
  template: `<lib-timeline [items]="items" />`,
})
class TestHost {
  items = [...ITEMS];
}

// ── Host with content slot ─────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline, LibTimelineContentDirective],
  template: `
    <lib-timeline [items]="items">
      <ng-template libTimelineContent="e2" let-item>Custom: {{ item.label }}</ng-template>
    </lib-timeline>
  `,
})
class ContentHost {
  items = [...ITEMS];
}

// ── Host with item slot ────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline, LibTimelineItemDirective],
  template: `
    <lib-timeline [items]="items">
      <ng-template libTimelineItem="e1" let-item>Override: {{ item.label }}</ng-template>
    </lib-timeline>
  `,
})
class ItemHost {
  items = [...ITEMS];
}

// ── Host with custom color ─────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline],
  template: `<lib-timeline [items]="items" />`,
})
class ColorHost {
  items: TimelineItem[] = [
    { id: 'c1', label: 'Custom color', status: 'active', color: '#FF6B35' },
    { id: 'c2', label: 'Normal',       status: 'pending' },
  ];
}

// ── Horizontal host ────────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline],
  template: `<lib-timeline [items]="items" orientation="horizontal" />`,
})
class HorizontalHost {
  items = [...ITEMS];
}

// ── Host with icon field ───────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline],
  template: `<lib-timeline [items]="items" />`,
})
class IconHost {
  items: TimelineItem[] = [
    { id: 'i1', label: 'With icon', status: 'completed', icon: '★' },
    { id: 'i2', label: 'No icon',   status: 'pending' },
  ];
}

// ── Error status host ──────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Timeline],
  template: `<lib-timeline [items]="items" />`,
})
class ErrorHost {
  items: TimelineItem[] = [
    { id: 'err', label: 'Failed step', status: 'error' },
    { id: 'ok',  label: 'Done',        status: 'completed' },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────

describe('Timeline — vertical (default)', () => {
  const render = (props: Partial<TestHost> = {}) => {
    const f = TestBed.createComponent(TestHost);
    Object.assign(f.componentInstance, props);
    f.detectChanges();
    return f;
  };

  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents()
  );

  it('renders one dot circle per item', () => {
    const f = render();
    const dots = f.nativeElement.querySelectorAll('[data-testid="timeline-dot"]');
    expect(dots.length).toBe(3);
  });

  it('renders each item label', () => {
    const f = render();
    const text: string = f.nativeElement.textContent;
    expect(text).toContain('Project created');
    expect(text).toContain('In progress');
    expect(text).toContain('Pending review');
  });

  it('renders description when provided', () => {
    const f = render();
    expect(f.nativeElement.textContent).toContain('Doing work');
  });

  it('formats date using DatePipe mediumDate', () => {
    const f = render();
    // new Date(2024, 0, 15) → "Jan 15, 2024" in en-US locale
    const text: string = f.nativeElement.textContent;
    expect(text).toContain('Jan');
    expect(text).toContain('2024');
  });

  it('does not render raw date string', () => {
    const f = render();
    // DatePipe should transform the Date object — raw toString would contain "GMT"
    expect(f.nativeElement.textContent).not.toContain('GMT');
  });

  it('completed item shows checkmark SVG', () => {
    const f = render();
    const dots = f.nativeElement.querySelectorAll('[data-testid="timeline-dot"]');
    const completedDot = dots[0]; // e1 is completed
    expect(completedDot.querySelector('[data-testid="icon-completed"]')).toBeTruthy();
  });

  it('pending item shows no SVG', () => {
    const f = render();
    const dots = f.nativeElement.querySelectorAll('[data-testid="timeline-dot"]');
    const pendingDot = dots[2]; // e3 is pending
    expect(pendingDot.querySelector('[data-testid="icon-completed"], [data-testid="icon-error"]')).toBeNull();
  });

  it('active item shows no SVG', () => {
    const f = render();
    const dots = f.nativeElement.querySelectorAll('[data-testid="timeline-dot"]');
    const activeDot = dots[1]; // e2 is active
    expect(activeDot.querySelector('[data-testid="icon-completed"], [data-testid="icon-error"]')).toBeNull();
  });

  it('renders connector lines between items but not after last', () => {
    const f = render();
    // Vertical connectors have data-testid="timeline-connector"
    const connectors = f.nativeElement.querySelectorAll('[data-testid="timeline-connector"]');
    expect(connectors.length).toBe(2); // 3 items → 2 connectors
  });
});

describe('Timeline — error status', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [ErrorHost] }).compileComponents()
  );

  it('error item shows exclamation SVG', () => {
    const f = TestBed.createComponent(ErrorHost);
    f.detectChanges();
    const dots = f.nativeElement.querySelectorAll('[data-testid="timeline-dot"]');
    const errorDot = dots[0];
    expect(errorDot.querySelector('[data-testid="icon-error"]')).toBeTruthy();
  });
});

describe('Timeline — icon field', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [IconHost] }).compileComponents()
  );

  it('renders icon text inside dot instead of status SVG', () => {
    const f = TestBed.createComponent(IconHost);
    f.detectChanges();
    const dots = f.nativeElement.querySelectorAll('[data-testid="timeline-dot"]');
    const iconDot = dots[0]; // i1 has icon '★'
    expect(iconDot.textContent?.trim()).toBe('★');
    expect(iconDot.querySelector('[data-testid="icon-completed"], [data-testid="icon-error"]')).toBeNull();
  });

  it('item without icon still shows no SVG for pending status', () => {
    const f = TestBed.createComponent(IconHost);
    f.detectChanges();
    // i2 is pending — no svg, no icon text
    const dots = f.nativeElement.querySelectorAll('[data-testid="timeline-dot"]');
    const pendingDot = dots[1];
    expect(pendingDot.querySelector('svg')).toBeNull();
    expect(pendingDot.textContent?.trim()).toBe('');
  });
});

describe('Timeline — custom color', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [ColorHost] }).compileComponents()
  );

  it('applies custom color as backgroundColor inline style on the dot', () => {
    const f = TestBed.createComponent(ColorHost);
    f.detectChanges();
    const dots = f.nativeElement.querySelectorAll<HTMLElement>('[data-testid="timeline-dot"]');
    const customDot = dots[0]; // c1 has color '#FF6B35'
    expect(customDot.style.backgroundColor).toBeTruthy();
  });

  it('item without custom color has no backgroundColor inline style', () => {
    const f = TestBed.createComponent(ColorHost);
    f.detectChanges();
    const dots = f.nativeElement.querySelectorAll<HTMLElement>('[data-testid="timeline-dot"]');
    const normalDot = dots[1]; // c2 has no color
    expect(normalDot.style.backgroundColor).toBe('');
  });
});

describe('Timeline — content slot', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [ContentHost] }).compileComponents()
  );

  it('renders custom content for the slotted item', () => {
    const f = TestBed.createComponent(ContentHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Custom: In progress');
  });

  it('still renders the dot circle for the slotted item', () => {
    const f = TestBed.createComponent(ContentHost);
    f.detectChanges();
    // All 3 dots still present (content slot only replaces content, not dot)
    const dots = f.nativeElement.querySelectorAll('[data-testid="timeline-dot"]');
    expect(dots.length).toBe(3);
  });

  it('renders default content for non-slotted items', () => {
    const f = TestBed.createComponent(ContentHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Project created');
    expect(f.nativeElement.textContent).toContain('Pending review');
  });
});

describe('Timeline — item slot', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [ItemHost] }).compileComponents()
  );

  it('renders the slot template for the overridden item', () => {
    const f = TestBed.createComponent(ItemHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Override: Project created');
  });

  it('passes the item as $implicit context', () => {
    const f = TestBed.createComponent(ItemHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Project created');
  });

  it('renders other items normally (not slotted)', () => {
    const f = TestBed.createComponent(ItemHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('In progress');
    expect(f.nativeElement.textContent).toContain('Pending review');
  });

  it('overridden item has no component-managed dot circle', () => {
    const f = TestBed.createComponent(ItemHost);
    f.detectChanges();
    // 3 items total, e1 is fully overridden (no component dot)
    // Only e2 and e3 contribute component-managed dots
    const dots = f.nativeElement.querySelectorAll('[data-testid="timeline-dot"]');
    expect(dots.length).toBe(2);
  });
});

describe('Timeline — horizontal orientation', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [HorizontalHost] }).compileComponents()
  );

  it('renders all item labels', () => {
    const f = TestBed.createComponent(HorizontalHost);
    f.detectChanges();
    const text: string = f.nativeElement.textContent;
    expect(text).toContain('Project created');
    expect(text).toContain('In progress');
    expect(text).toContain('Pending review');
  });

  it('renders one dot circle per item', () => {
    const f = TestBed.createComponent(HorizontalHost);
    f.detectChanges();
    const dots = f.nativeElement.querySelectorAll('[data-testid="timeline-dot"]');
    expect(dots.length).toBe(3);
  });

  it('renders horizontal connector lines between items', () => {
    const f = TestBed.createComponent(HorizontalHost);
    f.detectChanges();
    // Horizontal connectors have data-testid="timeline-connector"
    const connectors = f.nativeElement.querySelectorAll('[data-testid="timeline-connector"]');
    expect(connectors.length).toBeGreaterThanOrEqual(2);
  });
});
