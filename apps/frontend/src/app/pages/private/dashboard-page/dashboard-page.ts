import { Component, signal } from '@angular/core'

import { AdminDashboard } from './components/admin-dashboard/admin-dashboard'
import { UserDashboard } from './components/user-dashboard/user-dashboard'

export type DashboardView = 'admin' | 'user'

@Component({
	selector: 'app-dashboard-page',
	imports: [AdminDashboard, UserDashboard],
	templateUrl: './dashboard-page.html',
})
export class DashboardPage {
	readonly view = signal<DashboardView>('admin')

	setView(v: DashboardView): void {
		this.view.set(v)
	}
}
