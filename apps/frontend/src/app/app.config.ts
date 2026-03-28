import { registerLocaleData } from '@angular/common'
import localeEsMx from '@angular/common/locales/es-MX'
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'

import { appRoutes } from './app.routes'

registerLocaleData(localeEsMx)

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(appRoutes),
		{ provide: LOCALE_ID, useValue: 'es-MX' },
	],
}
