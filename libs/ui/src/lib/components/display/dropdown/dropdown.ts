import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  contentChild,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ConnectedPosition, Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { LibDropdownItemDirective } from '../../../directives/dropdown-item.directive';
import { DropdownItem } from '../../../models/dropdown-item.model';

export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

const POSITIONS: Record<DropdownPlacement, ConnectedPosition[]> = {
  'bottom-end':   [{ originX: 'end',   originY: 'bottom', overlayX: 'end',   overlayY: 'top'    }],
  'bottom-start': [{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'    }],
  'top-end':      [{ originX: 'end',   originY: 'top',    overlayX: 'end',   overlayY: 'bottom' }],
  'top-start':    [{ originX: 'start', originY: 'top',    overlayX: 'start', overlayY: 'bottom' }],
};

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, OverlayModule],
  templateUrl: './dropdown.html',
})
export class Dropdown {
  readonly items     = input<DropdownItem[]>([]);
  readonly placement = input<DropdownPlacement>('bottom-end');
  readonly trigger   = input<'click' | 'hover'>('click');
  readonly disabled  = input(false);

  readonly itemClick = output<DropdownItem>();

  readonly customItemSlot  = contentChild(LibDropdownItemDirective);
  readonly triggerEl       = viewChild.required<ElementRef>('triggerEl');
  readonly panelTemplate   = viewChild.required<TemplateRef<void>>('panel');

  readonly isOpen = signal(false);

  private overlayRef: OverlayRef | null = null;
  private hoverTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly overlay = inject(Overlay);
  private readonly vcr     = inject(ViewContainerRef);

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.hoverTimer!);
      this.overlayRef?.dispose();
    });
  }

  open(): void {
    if (this.isOpen() || this.disabled()) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.triggerEl())
      .withPositions(POSITIONS[this.placement()]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: this.trigger() === 'click',
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.keyCode === ESCAPE && !hasModifierKey(event)) this.close();
    });

    this.overlayRef.attach(new TemplatePortal(this.panelTemplate(), this.vcr));
    this.isOpen.set(true);
  }

  close(): void {
    if (!this.overlayRef || !this.isOpen()) return;
    this.overlayRef.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  onItemClick(item: DropdownItem): void {
    if (item.disabled || item.divider) return;
    this.itemClick.emit(item);
    this.close();
  }

  onTriggerMouseEnter(): void {
    if (this.trigger() !== 'hover' || this.disabled()) return;
    clearTimeout(this.hoverTimer!);
    this.open();
  }

  onTriggerMouseLeave(): void {
    if (this.trigger() !== 'hover') return;
    this.hoverTimer = setTimeout(() => this.close(), 150);
  }

  onPanelMouseEnter(): void {
    if (this.trigger() !== 'hover') return;
    clearTimeout(this.hoverTimer!);
  }

  onPanelMouseLeave(): void {
    if (this.trigger() !== 'hover') return;
    this.hoverTimer = setTimeout(() => this.close(), 150);
  }

  itemClasses(item: DropdownItem): string {
    const base = 'flex w-full items-center px-4 py-2 text-sm text-left transition-colors';
    if (item.disabled) return `${base} text-text-muted dark:text-dark-text/40 cursor-not-allowed opacity-50`;
    return `${base} text-text-primary dark:text-dark-text hover:bg-hover-row dark:hover:bg-dark-hover-row cursor-pointer`;
  }
}
