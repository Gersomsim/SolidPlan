import { Component, inject } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'

import { Icon, Link, ThemeService } from '@org/ui'

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, Icon, Link],
  templateUrl: './public-layout.html',
})
export class PublicLayout {
  readonly currentYear = new Date().getFullYear()
  readonly themeService = inject(ThemeService)
}
