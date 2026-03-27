import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Tabs } from './tabs';
import { Tab } from './tab';

@Component({
  standalone: true,
  imports: [Tabs, Tab],
  template: `
    <lib-tabs [(activeTab)]="active">
      <lib-tab key="a" label="Alpha">Panel A</lib-tab>
      <lib-tab key="b" label="Beta">Panel B</lib-tab>
      <lib-tab key="c" label="Gamma" [disabled]="true">Panel C</lib-tab>
    </lib-tabs>
  `,
})
class TestHost {
  active = 'a';
}

@Component({
  standalone: true,
  imports: [Tabs, Tab],
  template: `
    <lib-tabs [(activeTab)]="active" orientation="vertical">
      <lib-tab key="x" label="X">Panel X</lib-tab>
      <lib-tab key="y" label="Y" icon="★" [badge]="3">Panel Y</lib-tab>
    </lib-tabs>
  `,
})
class VerticalHost {
  active = 'x';
}

describe('Tabs', () => {
  const render = (props: Partial<TestHost> = {}) => {
    const fixture = TestBed.createComponent(TestHost);
    Object.assign(fixture.componentInstance, props);
    fixture.detectChanges();
    return fixture;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
  });

  it('renders a button for each tab', () => {
    const f = render();
    expect(f.nativeElement.querySelectorAll('button[role="tab"]').length).toBe(3);
  });

  it('shows the active panel and hides others', () => {
    const f = render({ active: 'a' });
    const panels = f.nativeElement.querySelectorAll<HTMLElement>('[role="tabpanel"]');
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(true);
    expect(panels[2].hidden).toBe(true);
  });

  it('active tab button has aria-selected="true"', () => {
    const f = render({ active: 'b' });
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
    expect(buttons[0].getAttribute('aria-selected')).toBe('false');
  });

  it('clicking a tab updates activeTab and shows its panel', () => {
    const f = render({ active: 'a' });
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
    buttons[1].click();
    f.detectChanges();
    expect(f.componentInstance.active).toBe('b');
    const panels = f.nativeElement.querySelectorAll<HTMLElement>('[role="tabpanel"]');
    expect(panels[1].hidden).toBe(false);
    expect(panels[0].hidden).toBe(true);
  });

  it('clicking a disabled tab does not change active tab', () => {
    const f = render({ active: 'a' });
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
    buttons[2].click();
    f.detectChanges();
    expect(f.componentInstance.active).toBe('a');
  });

  it('disabled tab button has aria-disabled attribute', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
    expect(buttons[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('renders tab labels in buttons', () => {
    const f = render();
    const buttons = f.nativeElement.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
    expect(buttons[0].textContent?.trim()).toContain('Alpha');
    expect(buttons[1].textContent?.trim()).toContain('Beta');
  });
});

describe('Tabs — vertical orientation', () => {
  let fixture: ComponentFixture<VerticalHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VerticalHost] }).compileComponents();
    fixture = TestBed.createComponent(VerticalHost);
    fixture.detectChanges();
  });

  it('tab bar has flex-col class', () => {
    const tabBar = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    expect(tabBar.className).toContain('flex-col');
  });

  it('renders icon when provided', () => {
    const buttons = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
    expect(buttons[1].textContent).toContain('★');
  });

  it('renders badge when provided', () => {
    const badge = fixture.nativeElement.querySelector('.rounded-badge') as HTMLElement;
    expect(badge?.textContent?.trim()).toBe('3');
  });
});
