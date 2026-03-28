import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

import { Button, Card, Icon, Input, Link } from '@org/ui'

@Component({
	selector: 'app-login-page',
	imports: [RouterLink, Card, Input, Button, Icon, Link],
	templateUrl: './login-page.html',
	styleUrl: './login-page.css',
})
export class LoginPage {}
