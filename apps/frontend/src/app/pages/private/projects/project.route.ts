import { Routes } from '@angular/router'

export const projectRoutes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./project-list-page/project-list-page').then(m => m.ProjectListPage),
	},
	{
		path: 'new',
		loadComponent: () =>
			import('./project-form-page/project-form-page').then(m => m.ProjectFormPage),
	},
	{
		path: ':id/edit',
		loadComponent: () =>
			import('./project-form-page/project-form-page').then(m => m.ProjectFormPage),
	},
	{
		path: ':id',
		loadComponent: () =>
			import('./project-detail-page/project-detail-page').then(m => m.ProjectDetailPage),
		children: [
			{
				path: '',
				redirectTo: 'overview',
				pathMatch: 'full',
			},
			{
				path: 'overview',
				loadComponent: () =>
					import('./pages/overview-page/overview-page').then(m => m.OverviewPage),
			},
			{
				path: 'activities',
				loadComponent: () =>
					import('./pages/activities-page/activities-page').then(m => m.ActivitiesPage),
			},
			{
				path: 'daily-logs',
				loadComponent: () =>
					import('./pages/daily-logs-page/daily-logs-page').then(m => m.DailyLogsPage),
			},
			{
				path: 'resources',
				loadComponent: () =>
					import('./pages/resources/resources').then(m => m.Resources),
			},
			{
				path: 'stages',
				loadComponent: () =>
					import('./pages/stages-page/stages-page').then(m => m.StagesPage),
			},
			{
				path: 'stages/:stageId',
				loadComponent: () =>
					import('./pages/stage-detail-page/stage-detail-page').then(m => m.StageDetailPage),
			},
			{
				path: 'members',
				loadComponent: () =>
					import('./pages/project-members/project-members').then(m => m.ProjectMembers),
			},
			{
				path: 'activities/:activityId',
				loadComponent: () =>
					import('./pages/activity-detail-page/activity-detail-page').then(m => m.ActivityDetailPage),
			},
			{
				path: 'activities/:activityId/edit',
				loadComponent: () =>
					import('./pages/activity-edit-page/activity-edit-page').then(m => m.ActivityEditPage),
			},
		],
	},
]
