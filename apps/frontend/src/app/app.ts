import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'

import { Card } from '@org/ui'

@Component({
	imports: [RouterModule, Card],
	selector: 'app-root',
	templateUrl: './app.html',
	styleUrl: './app.css',
})
export class App {}
