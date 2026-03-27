import { Routes } from '@angular/router'

export const projectRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('./project-list-page/project-list-page').then(m => m.ProjectListPage),
	},
	{
		path: ':id',
		loadComponent: () => import('./project-detail-page/project-detail-page').then(m => m.ProjectDetailPage),
		children: [
			{
				path: 'daily-logs',
				loadComponent: () => import('./pages/daily-logs-page/daily-logs-page').then(m => m.DailyLogsPage),
			},
			{
				path: 'resources',
				loadComponent: () => import('./pages/resources/resources').then(m => m.Resources),
			},
			{
				path: 'activities',
				loadComponent: () => import('./pages/activities-page/activities-page').then(m => m.ActivitiesPage),
			},
			{
				path: 'overview',
				loadComponent: () => import('./pages/overview-page/overview-page').then(m => m.OverviewPage),
			},
		],
	},
]
