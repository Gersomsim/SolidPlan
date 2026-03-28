import { Routes } from '@angular/router'

export const authRoutes: Routes = [
	{
		path: 'login',
		loadComponent: () => import('./login-page/login-page').then(m => m.LoginPage),
	},
	{
		path: 'register',
		loadComponent: () => import('./register-page/register-page').then(m => m.RegisterPage),
	},
	{
		path: 'forgot-password',
		loadComponent: () => import('./forgot-password-page/forgot-password-page').then(m => m.ForgotPasswordPage),
	},
	{
		path: 'reset-password',
		loadComponent: () => import('./reset-password-page/reset-password-page').then(m => m.ResetPasswordPage),
	},
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
]
