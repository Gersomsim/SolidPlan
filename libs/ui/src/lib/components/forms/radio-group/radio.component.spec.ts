import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { Radio } from './radio.component';
import { RADIO_GROUP } from './radio-group.component';

describe('RadioComponent (isolated)', () => {
  let fixture: ComponentFixture<Radio>;
  let component: Radio;
  let mockSelect: ReturnType<typeof vi.fn>;
  let selectedValue: ReturnType<typeof signal<unknown>>;
  let effectiveDisabled: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    mockSelect = vi.fn();
    selectedValue = signal<unknown>(null);
    effectiveDisabled = signal(false);

    const mockGroup = {
      selectedValue,
      effectiveDisabled,
      select: mockSelect,
    };

    await TestBed.configureTestingModule({
      imports: [Radio],
      providers: [
        { provide: RADIO_GROUP, useValue: mockGroup },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Radio);
    component = fixture.componentInstance;
  });

  it('renders label text', () => {
    fixture.componentRef.setInput('label', 'Option A');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent.trim()).toBe('Option A');
  });

  it('is not checked when group.selectedValue() does not match', () => {
    fixture.componentRef.setInput('value', 'b');
    selectedValue.set('a');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="radio"]');
    expect(input.checked).toBe(false);
  });

  it('is checked when group.selectedValue() matches the radio value', () => {
    fixture.componentRef.setInput('value', 'a');
    selectedValue.set('a');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="radio"]');
    expect(input.checked).toBe(true);
  });

  it('calls group.select() when clicked and radio is not disabled', () => {
    fixture.componentRef.setInput('value', 'a');
    fixture.componentRef.setInput('disabled', false);
    effectiveDisabled.set(false);
    fixture.detectChanges();

    component.select();

    expect(mockSelect).toHaveBeenCalledTimes(1);
    expect(mockSelect).toHaveBeenCalledWith('a');
  });

  it('does NOT call group.select() when the radio disabled input is true', () => {
    fixture.componentRef.setInput('value', 'a');
    fixture.componentRef.setInput('disabled', true);
    effectiveDisabled.set(false);
    fixture.detectChanges();

    component.select();

    expect(mockSelect).not.toHaveBeenCalled();
  });
});
