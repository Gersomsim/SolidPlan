import { Routes } from '@angular/router'

export const settingsRoutes: Routes = [
	{
		path: '',
		redirectTo: 'profile',
		pathMatch: 'full',
	},
	{
		path: 'profile',
		loadComponent: () =>
			import('./pages/profile/profile-settings').then(m => m.ProfileSettings),
	},
	{
		path: 'password',
		loadComponent: () =>
			import('./pages/password/password-settings').then(m => m.PasswordSettings),
	},
	{
		path: 'organization',
		loadComponent: () =>
			import('./pages/organization/organization-settings').then(m => m.OrganizationSettings),
	},
	{
		path: 'preferences',
		loadComponent: () =>
			import('./pages/preferences/preferences-settings').then(m => m.PreferencesSettings),
	},
	{
		path: 'plan',
		loadComponent: () =>
			import('./pages/plan/plan-settings').then(m => m.PlanSettings),
	},
	{
		path: 'billing',
		loadComponent: () =>
			import('./pages/billing/billing-settings').then(m => m.BillingSettings),
	},
]
