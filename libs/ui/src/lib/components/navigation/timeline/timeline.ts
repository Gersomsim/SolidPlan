import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
} from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { LibTimelineItemDirective } from '../../../directives/timeline-item.directive';
import { LibTimelineContentDirective } from '../../../directives/timeline-content.directive';
import { TimelineItem } from '../../../models/timeline-item.model';

export type TimelineOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'lib-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, DatePipe],
  templateUrl: './timeline.html',
})
export class Timeline {
  readonly items       = input<TimelineItem[]>([]);
  readonly orientation = input<TimelineOrientation>('vertical');

  readonly itemSlots    = contentChildren(LibTimelineItemDirective);
  readonly contentSlots = contentChildren(LibTimelineContentDirective);

  itemSlotFor(id: string): LibTimelineItemDirective | undefined {
    return this.itemSlots().find(s => s.key() === id);
  }

  contentSlotFor(id: string): LibTimelineContentDirective | undefined {
    return this.contentSlots().find(s => s.key() === id);
  }

  dotClass(item: TimelineItem): string {
    const base = 'flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-sm transition-colors';
    if (item.color) return `${base} text-white`;
    switch (item.status) {
      case 'completed': return `${base} bg-success text-white`;
      case 'active':    return `${base} bg-primary text-white`;
      case 'error':     return `${base} bg-danger text-white`;
      default:          return `${base} bg-secondary-bg text-text-secondary border border-border`;
    }
  }

  vConnectorClass(item: TimelineItem): string {
    const base = 'w-0.5 flex-1 min-h-6 my-1 transition-colors';
    return item.status === 'completed' ? `${base} bg-success` : `${base} bg-border`;
  }

  hLeftConnectorClass(index: number): string {
    const prev = this.items()[index - 1];
    return prev?.status === 'completed'
      ? 'flex-1 h-0.5 bg-success self-center transition-colors'
      : 'flex-1 h-0.5 bg-border self-center transition-colors';
  }

  hRightConnectorClass(item: TimelineItem): string {
    return item.status === 'completed'
      ? 'flex-1 h-0.5 bg-success self-center transition-colors'
      : 'flex-1 h-0.5 bg-border self-center transition-colors';
  }
}
