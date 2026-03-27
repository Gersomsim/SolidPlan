import { Routes } from '@angular/router'

export const privateRoutes: Routes = [
	{
		path: 'dashboard',
		loadComponent: () => import('./dashboard-page/dashboard-page').then(m => m.DashboardPage),
	},
	{
		path: 'projects',
		loadChildren: () => import('./projects/project.route').then(m => m.projectRoutes),
	},
	{
		path: 'settings',
		loadComponent: () => import('./settings-page/settings-page').then(m => m.SettingsPage),
	},
]
