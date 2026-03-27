import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { LibCardActionsDirective } from '../../../directives/card-actions.directive';
import { LibCardFooterDirective } from '../../../directives/card-footer.directive';
import { LibCardHeaderDirective } from '../../../directives/card-header.directive';
import { LibCardPrefixDirective } from '../../../directives/card-prefix.directive';

@Component({
  standalone: true,
  imports: [CardComponent],
  template: `
    <lib-card
      [title]="title()"
      [subtitle]="subtitle()"
      [loading]="loading()"
      [padding]="padding()"
      [bordered]="bordered()"
      [elevated]="elevated()"
    >
      Contenido base
    </lib-card>
  `,
})
class BasicHostComponent {
  readonly title = signal('Resumen del proyecto');
  readonly subtitle = signal('Seguimiento semanal');
  readonly loading = signal(false);
  readonly padding = signal<'none' | 'sm' | 'md' | 'lg'>('md');
  readonly bordered = signal(true);
  readonly elevated = signal(true);
}

@Component({
  standalone: true,
  imports: [
    CardComponent,
    LibCardActionsDirective,
    LibCardFooterDirective,
    LibCardPrefixDirective,
  ],
  template: `
    <lib-card title="Proyecto">
      <ng-template libCardPrefix><span class="prefix-slot">ICON</span></ng-template>
      <ng-template libCardActions><button type="button">Editar</button></ng-template>
      <ng-template libCardFooter><span class="footer-slot">Pie</span></ng-template>
      Contenido con slots
    </lib-card>
  `,
})
class SlotHostComponent {}

@Component({
  standalone: true,
  imports: [CardComponent, LibCardHeaderDirective],
  template: `
    <lib-card title="Ignorado" subtitle="Ignorado">
      <ng-template libCardHeader>
        <div class="custom-header">Header personalizado</div>
      </ng-template>
      Cuerpo
    </lib-card>
  `,
})
class CustomHeaderHostComponent {}

describe('CardComponent', () => {
  describe('basic rendering', () => {
    let fixture: ComponentFixture<BasicHostComponent>;
    let host: BasicHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [BasicHostComponent] }).compileComponents();
      fixture = TestBed.createComponent(BasicHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('renders title, subtitle, and projected content', () => {
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Resumen del proyecto');
      expect(text).toContain('Seguimiento semanal');
      expect(text).toContain('Contenido base');
    });

    it('uses bordered and elevated styles by default without hover shadow', () => {
      const card = fixture.nativeElement.querySelector('article');
      expect(card.classList.contains('border')).toBe(true);
      expect(card.classList.contains('border-border')).toBe(true);
      expect(card.classList.contains('shadow-card')).toBe(true);
      expect(card.className).not.toContain('hover:shadow-hover');
    });

    it('removes border and shadow when bordered and elevated are false', () => {
      host.bordered.set(false);
      host.elevated.set(false);
      fixture.detectChanges();

      const card = fixture.nativeElement.querySelector('article');
      expect(card.classList.contains('border')).toBe(false);
      expect(card.classList.contains('shadow-card')).toBe(false);
    });

    it('applies the selected padding size', () => {
      host.padding.set('lg');
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('header');
      const body = fixture.nativeElement.querySelector('section');
      expect(header.classList.contains('p-8')).toBe(true);
      expect(body.classList.contains('p-8')).toBe(true);
    });

    it('renders loading overlay when loading is true', () => {
      host.loading.set(true);
      fixture.detectChanges();

      const overlay = fixture.nativeElement.querySelector('[data-testid="card-loading-overlay"]');
      expect(overlay).toBeTruthy();
    });
  });

  describe('slot rendering', () => {
    it('renders prefix, actions, and footer slots', async () => {
      await TestBed.configureTestingModule({ imports: [SlotHostComponent] }).compileComponents();
      const fixture = TestBed.createComponent(SlotHostComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.prefix-slot')?.textContent).toContain('ICON');
      expect(fixture.nativeElement.querySelector('button')?.textContent).toContain('Editar');
      expect(fixture.nativeElement.querySelector('.footer-slot')?.textContent).toContain('Pie');
    });

    it('renders custom header slot instead of the default title/subtitle block', async () => {
      await TestBed.configureTestingModule({ imports: [CustomHeaderHostComponent] }).compileComponents();
      const fixture = TestBed.createComponent(CustomHeaderHostComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.custom-header')?.textContent).toContain('Header personalizado');
      expect(fixture.nativeElement.textContent).not.toContain('Ignorado');
    });
  });
});
