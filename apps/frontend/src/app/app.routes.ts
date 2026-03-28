import { Route } from '@angular/router'

export const appRoutes: Route[] = [
	{
		path: '',
		loadComponent: () =>
			import('./shared/ui/layouts/public-layout/public-layout').then(
				m => m.PublicLayout,
			),
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./pages/public/home-page/home-page').then(m => m.HomePage),
			},
			{
				path: 'auth',
				loadChildren: () =>
					import('./pages/public/auth/auth.routes').then(m => m.authRoutes),
			},
		],
	},
	{
		path: 'system',
		loadComponent: () =>
			import('./shared/ui/layouts/private-layout/private-layout').then(
				m => m.PrivateLayout,
			),
		children: [
			{
				path: '',
				loadChildren: () =>
					import('./pages/private/private.routes').then(m => m.privateRoutes),
			},
		],
	},
]
