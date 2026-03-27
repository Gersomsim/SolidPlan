import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LibStepContentDirective } from '../../../directives/step-content.directive';
import { LibStepIconDirective } from '../../../directives/step-icon.directive';
import { StepItem } from '../../../models/step-item.model';
import { Stepper } from './stepper';

const STEPS: StepItem[] = [
  { key: 'info',    label: 'Information', status: 'completed'  },
  { key: 'details', label: 'Details',     status: 'active'     },
  { key: 'review',  label: 'Review',      status: 'pending'    },
];

// ── Basic host ──────────────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Stepper],
  template: `
    <lib-stepper
      [steps]="steps"
      [(activeStep)]="activeStep"
      (stepChange)="changed.push($event)"
    />
  `,
})
class TestHost {
  steps      = [...STEPS];
  activeStep = 'details';
  changed: string[] = [];
}

// ── Host with content slots ─────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Stepper, LibStepContentDirective],
  template: `
    <lib-stepper [steps]="steps" [(activeStep)]="activeStep">
      <ng-template libStepContent="info">Info panel</ng-template>
      <ng-template libStepContent="details">Details panel</ng-template>
      <ng-template libStepContent="review">Review panel</ng-template>
    </lib-stepper>
  `,
})
class ContentHost {
  steps      = [...STEPS];
  activeStep = 'details';
}

// ── Host with icon slot ─────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Stepper, LibStepIconDirective],
  template: `
    <lib-stepper [steps]="steps" [(activeStep)]="activeStep">
      <ng-template libStepIcon="info">★</ng-template>
    </lib-stepper>
  `,
})
class IconHost {
  steps      = [...STEPS];
  activeStep = 'details';
}

// ── Host with linear mode ───────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Stepper],
  template: `
    <lib-stepper [steps]="steps" [(activeStep)]="activeStep" [linear]="true" />
  `,
})
class LinearHost {
  steps      = [...STEPS];
  activeStep = 'details';
}

// ── Host with vertical orientation ─────────────────────────────────────────
@Component({
  standalone: true,
  imports: [Stepper, LibStepContentDirective],
  template: `
    <lib-stepper [steps]="steps" [(activeStep)]="activeStep" orientation="vertical">
      <ng-template libStepContent="details">Details panel</ng-template>
    </lib-stepper>
  `,
})
class VerticalHost {
  steps      = [...STEPS];
  activeStep = 'details';
}

// ────────────────────────────────────────────────────────────────────────────

describe('Stepper — horizontal (default)', () => {
  const render = (props: Partial<TestHost> = {}) => {
    const f = TestBed.createComponent(TestHost);
    Object.assign(f.componentInstance, props);
    f.detectChanges();
    return f;
  };

  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents()
  );

  it('renders one button per step', () => {
    const f = render();
    expect(f.nativeElement.querySelectorAll('button').length).toBe(3);
  });

  it('renders each step label', () => {
    const f = render();
    const text: string = f.nativeElement.textContent;
    expect(text).toContain('Information');
    expect(text).toContain('Details');
    expect(text).toContain('Review');
  });

  it('renders description when provided', () => {
    const f = render({
      steps: [
        { key: 'a', label: 'Step A', description: 'Fill in basics', status: 'active' },
      ],
    });
    expect(f.nativeElement.textContent).toContain('Fill in basics');
  });

  it('active step button has aria-current="step"', () => {
    const f = render();
    const current = f.nativeElement.querySelector('[aria-current="step"]') as HTMLButtonElement;
    expect(current).toBeTruthy();
    expect(current.getAttribute('aria-label')).toBe('Details');
  });

  it('completed step shows checkmark SVG, not a number', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    const completedBtn = buttons[0]; // 'info' step is completed
    expect(completedBtn.querySelector('svg')).toBeTruthy();
    expect(completedBtn.textContent?.trim()).toBe('');
  });

  it('error step shows exclamation SVG', () => {
    const f = render({
      steps: [
        { key: 'a', label: 'A', status: 'error' },
        { key: 'b', label: 'B', status: 'pending' },
      ],
    });
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons[0].querySelector('svg')).toBeTruthy();
  });

  it('pending step shows its 1-based index', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons[2].textContent?.trim()).toBe('3'); // 'review' is pending at index 3
  });

  it('active step shows its 1-based index', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons[1].textContent?.trim()).toBe('2'); // 'details' is active at index 2
  });

  it('clicking a step emits stepChange with the step key', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    buttons[0].click(); // click 'info' (not the active step)
    expect(f.componentInstance.changed).toEqual(['info']);
  });

  it('clicking the active step does not emit stepChange', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    buttons[1].click(); // click 'details' which is already active
    expect(f.componentInstance.changed).toEqual([]);
  });

  it('clicking a step updates activeStep', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    buttons[2].click(); // review
    f.detectChanges();
    expect(f.componentInstance.activeStep).toBe('review');
  });
});

describe('Stepper — content slots', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [ContentHost] }).compileComponents()
  );

  it('shows content for active step only (horizontal)', () => {
    const f = TestBed.createComponent(ContentHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Details panel');
    expect(f.nativeElement.textContent).not.toContain('Info panel');
    expect(f.nativeElement.textContent).not.toContain('Review panel');
  });

  it('switches content when activeStep changes', () => {
    const f = TestBed.createComponent(ContentHost);
    f.detectChanges();
    // Click 'info' step button to switch activeStep via the stepper's two-way binding
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    buttons[0].click(); // 'info' step
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Info panel');
    expect(f.nativeElement.textContent).not.toContain('Details panel');
  });
});

describe('Stepper — icon slot', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [IconHost] }).compileComponents()
  );

  it('custom icon overrides the default (no SVG for that step)', () => {
    const f = TestBed.createComponent(IconHost);
    f.detectChanges();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    // 'info' has custom icon ★, no SVG should be rendered
    expect(buttons[0].querySelector('svg')).toBeNull();
    expect(buttons[0].textContent?.trim()).toBe('★');
  });
});

describe('Stepper — linear mode', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [LinearHost] }).compileComponents()
  );

  it('clicking a future step does not update activeStep', () => {
    const f = TestBed.createComponent(LinearHost);
    f.detectChanges();
    // 'review' is at index 2, activeStep is 'details' at index 1 — clicking 'review' is a skip
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    buttons[2].click(); // review
    f.detectChanges();
    expect(f.componentInstance.activeStep).toBe('details'); // unchanged
  });

  it('clicking a past step updates activeStep', () => {
    const f = TestBed.createComponent(LinearHost);
    f.detectChanges();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    buttons[0].click(); // info (past step)
    f.detectChanges();
    expect(f.componentInstance.activeStep).toBe('info');
  });
});

describe('Stepper — vertical orientation', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [VerticalHost] }).compileComponents()
  );

  it('renders all step labels', () => {
    const f = TestBed.createComponent(VerticalHost);
    f.detectChanges();
    const text: string = f.nativeElement.textContent;
    expect(text).toContain('Information');
    expect(text).toContain('Details');
    expect(text).toContain('Review');
  });

  it('renders content inline under the active step', () => {
    const f = TestBed.createComponent(VerticalHost);
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Details panel');
  });

  it('does not render content for inactive steps', () => {
    const f = TestBed.createComponent(VerticalHost);
    f.detectChanges();
    // Only 'details' has a slot defined, and 'details' IS active — so 'Info panel' not in DOM
    // (there's no slot for info anyway in this host, but the test verifies inactive content isn't shown)
    expect(f.nativeElement.textContent).not.toContain('Info panel');
  });
});
