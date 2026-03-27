import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LibSeparatorDirective } from '../../../directives/separator.directive';
import { BreadcrumbItem } from '../../../models/breadcrumb-item.model';

export type BreadcrumbSeparator = 'slash' | 'chevron';

@Component({
  selector: 'lib-breadcrumbs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './breadcrumbs.html',
})
export class Breadcrumbs {
  readonly items     = input<BreadcrumbItem[]>([]);
  readonly separator = input<BreadcrumbSeparator>('chevron');

  readonly customSeparator = contentChild(LibSeparatorDirective);

  readonly separatorChar = computed(() =>
    this.separator() === 'slash' ? '/' : '›'
  );
}
