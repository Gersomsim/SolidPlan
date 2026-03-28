import { Component, inject } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'

import { Icon, ThemeService } from '@org/ui'

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, Icon],
  templateUrl: './public-layout.html',
})
export class PublicLayout {
  readonly currentYear = new Date().getFullYear()
  readonly themeService = inject(ThemeService)
}
