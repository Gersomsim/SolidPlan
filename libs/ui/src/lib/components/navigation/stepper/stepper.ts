import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  model,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LibStepContentDirective } from '../../../directives/step-content.directive';
import { LibStepIconDirective } from '../../../directives/step-icon.directive';
import { StepItem } from '../../../models/step-item.model';

export type StepperOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'lib-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './stepper.html',
})
export class Stepper {
  readonly steps       = input<StepItem[]>([]);
  readonly orientation = input<StepperOrientation>('horizontal');
  readonly activeStep  = model('');
  readonly linear      = input(false);

  readonly stepChange = output<string>();

  readonly contentSlots = contentChildren(LibStepContentDirective);
  readonly iconSlots    = contentChildren(LibStepIconDirective);

  readonly activeContent = computed(() =>
    this.contentSlots().find(s => s.key() === this.activeStep())
  );

  contentFor(key: string): LibStepContentDirective | undefined {
    return this.contentSlots().find(s => s.key() === key);
  }

  iconFor(key: string): LibStepIconDirective | undefined {
    return this.iconSlots().find(s => s.key() === key);
  }

  stepIndex(step: StepItem): number {
    return this.steps().findIndex(s => s.key === step.key) + 1;
  }

  canClick(step: StepItem): boolean {
    if (!this.linear()) return true;
    const steps    = this.steps();
    const activeIdx = steps.findIndex(s => s.key === this.activeStep());
    const targetIdx = steps.findIndex(s => s.key === step.key);
    return targetIdx <= activeIdx;
  }

  onStepClick(step: StepItem): void {
    if (!this.canClick(step)) return;
    if (step.key === this.activeStep()) return;
    this.activeStep.set(step.key);
    this.stepChange.emit(step.key);
  }

  stepCircleClass(step: StepItem): string {
    const base = 'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 transition-colors focus:outline-none';
    const clickable = this.canClick(step) ? 'cursor-pointer' : 'cursor-default';
    switch (step.status) {
      case 'completed': return `${base} ${clickable} bg-success text-white`;
      case 'active':    return `${base} cursor-default bg-primary text-white`;
      case 'error':     return `${base} ${clickable} bg-danger text-white`;
      default:          return `${base} ${clickable} bg-secondary-bg text-text-secondary border border-border`;
    }
  }

  leftConnectorClass(index: number): string {
    const prev = this.steps()[index - 1];
    const colored = prev?.status === 'completed';
    return colored
      ? 'flex-1 h-0.5 bg-success self-center transition-colors'
      : 'flex-1 h-0.5 bg-border self-center transition-colors';
  }

  rightConnectorClass(step: StepItem): string {
    return step.status === 'completed'
      ? 'flex-1 h-0.5 bg-success self-center transition-colors'
      : 'flex-1 h-0.5 bg-border self-center transition-colors';
  }

  verticalConnectorClass(step: StepItem): string {
    const base = 'w-0.5 flex-1 min-h-6 my-1 transition-colors';
    return step.status === 'completed'
      ? `${base} bg-success`
      : `${base} bg-border`;
  }
}
