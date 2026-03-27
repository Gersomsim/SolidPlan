import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Dropdown, DropdownPlacement } from './dropdown';
import { LibDropdownItemDirective } from '../../../directives/dropdown-item.directive';
import { DropdownItem } from '../../../models/dropdown-item.model';

const ITEMS: DropdownItem[] = [
  { label: 'Edit',   action: 'edit' },
  { label: 'Delete', action: 'delete' },
  { label: 'Disabled item', disabled: true },
  { divider: true, label: '' },
  { label: 'Archive', action: 'archive' },
];

@Component({
  standalone: true,
  imports: [Dropdown],
  template: `
    <lib-dropdown
      [items]="items"
      [placement]="placement"
      [disabled]="disabled"
      [trigger]="triggerType"
      (itemClick)="clicked = $event"
    >
      <button>Open</button>
    </lib-dropdown>
  `,
})
class TestHost {
  items: DropdownItem[]        = ITEMS;
  placement: DropdownPlacement = 'bottom-end';
  disabled                     = false;
  triggerType: 'click' | 'hover' = 'click';
  clicked: DropdownItem | null = null;
}

@Component({
  standalone: true,
  imports: [Dropdown, LibDropdownItemDirective],
  template: `
    <lib-dropdown [items]="items" (itemClick)="clicked = $event">
      <button>Open</button>
      <ng-template libDropdownItem let-item>
        <span class="custom">{{ item.label }}</span>
      </ng-template>
    </lib-dropdown>
  `,
})
class CustomSlotHost {
  items: DropdownItem[]        = [{ label: 'Custom', action: 'c' }];
  clicked: DropdownItem | null = null;
}

describe('Dropdown — click trigger', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let overlayEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    overlayEl = TestBed.inject(OverlayContainer).getContainerElement();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const open = () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
  };

  it('renders the trigger slot', () => {
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });

  it('panel is not in DOM initially', () => {
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
  });

  it('opens panel on click', () => {
    open();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeTruthy();
  });

  it('renders all non-divider items', () => {
    open();
    const btns = overlayEl.querySelectorAll('button[role="menuitem"]');
    expect(btns.length).toBe(4); // Edit, Delete, Disabled item, Archive
  });

  it('renders divider as <hr>', () => {
    open();
    expect(overlayEl.querySelector('hr')).toBeTruthy();
  });

  it('emits itemClick and closes when item clicked', () => {
    open();
    (overlayEl.querySelector<HTMLButtonElement>('button[role="menuitem"]'))!.click();
    fixture.detectChanges();
    expect(host.clicked?.action).toBe('edit');
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
  });

  it('does not emit itemClick for disabled items', () => {
    open();
    const btns = overlayEl.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]');
    btns[2].click(); // "Disabled item"
    fixture.detectChanges();
    expect(host.clicked).toBeNull();
  });

  it('does not open when disabled', () => {
    const f = TestBed.createComponent(TestHost);
    f.componentInstance.disabled = true;
    f.detectChanges();
    f.nativeElement.querySelector('button').click();
    f.detectChanges();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
  });

  it('closes on Escape key', () => {
    open();
    overlayEl.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27, bubbles: true }));
    fixture.detectChanges();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
  });

  it('closes on backdrop click', () => {
    open();
    document.querySelector<HTMLElement>('.cdk-overlay-transparent-backdrop')!.click();
    fixture.detectChanges();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
  });
});

describe('Dropdown — hover trigger', () => {
  let fixture: ComponentFixture<TestHost>;
  let overlayEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    overlayEl = TestBed.inject(OverlayContainer).getContainerElement();
    fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.triggerType = 'hover';
    fixture.detectChanges();
  });

  const triggerWrapper = () => fixture.nativeElement.querySelector('div') as HTMLElement;

  it('opens on mouseenter', () => {
    triggerWrapper().dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeTruthy();
  });

  it('closes after mouseleave delay', () => {
    vi.useFakeTimers();
    triggerWrapper().dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    triggerWrapper().dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(150);
    fixture.detectChanges();
    expect(overlayEl.querySelector('button[role="menuitem"]')).toBeNull();
    vi.useRealTimers();
  });
});

describe('Dropdown — custom item slot', () => {
  let fixture: ComponentFixture<CustomSlotHost>;
  let overlayEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CustomSlotHost] }).compileComponents();
    overlayEl = TestBed.inject(OverlayContainer).getContainerElement();
    fixture = TestBed.createComponent(CustomSlotHost);
    fixture.detectChanges();
  });

  it('renders custom template for item', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(overlayEl.querySelector('.custom')?.textContent?.trim()).toBe('Custom');
  });
});
