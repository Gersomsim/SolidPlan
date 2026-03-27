import { Directive, inject, input, TemplateRef } from '@angular/core';
import { TimelineItem } from '../models/timeline-item.model';

@Directive({ selector: '[libTimelineContent]', standalone: true })
export class LibTimelineContentDirective {
  readonly key      = input.required<string>({ alias: 'libTimelineContent' });
  readonly template = inject(TemplateRef<{ $implicit: TimelineItem }>);
}
