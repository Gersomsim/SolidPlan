import { Routes } from '@angular/router'

export const privateRoutes: Routes = [
	{
		path: 'dashboard',
		loadComponent: () =>
			import('./dashboard-page/dashboard-page').then(m => m.DashboardPage),
	},
	{
		path: 'projects',
		loadChildren: () =>
			import('./projects/project.route').then(m => m.projectRoutes),
	},
	{
		path: 'resources',
		loadComponent: () =>
			import('./resources-page/resources-page').then(m => m.ResourcesPage),
	},
	{
		path: 'members',
		loadComponent: () =>
			import('./members-page/members-page').then(m => m.MembersPage),
	},
	{
		path: 'members/:id',
		loadComponent: () =>
			import('./member-detail-page/member-detail-page').then(m => m.MemberDetailPage),
	},
	{
		path: 'stage-templates',
		loadComponent: () =>
			import('./stage-templates-page/stage-templates-page').then(
				m => m.StageTemplatesPage,
			),
	},
	{
		path: 'activity-states',
		loadComponent: () =>
			import('./activity-states-page/activity-states-page').then(
				m => m.ActivityStatesPage,
			),
	},
	{
		path: 'categories',
		loadComponent: () =>
			import('./categories-page/categories-page').then(m => m.CategoriesPage),
	},
	{
		path: 'settings',
		loadComponent: () =>
			import('./settings-page/settings-page').then(m => m.SettingsPage),
		loadChildren: () =>
			import('./settings-page/settings.routes').then(m => m.settingsRoutes),
	},
]
