import { Directive, inject, input, TemplateRef } from '@angular/core';
import { TimelineItem } from '../models/timeline-item.model';

@Directive({ selector: '[libTimelineItem]', standalone: true })
export class LibTimelineItemDirective {
  readonly key      = input.required<string>({ alias: 'libTimelineItem' });
  readonly template = inject(TemplateRef<{ $implicit: TimelineItem }>);
}
