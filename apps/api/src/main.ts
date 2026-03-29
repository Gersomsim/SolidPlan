/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'
import { envs } from './config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors()
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: false,
			forbidNonWhitelisted: false,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	)
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: envs.api.version,
	})

	app.setGlobalPrefix(envs.api.prefix)
	const port = envs.api.port
	await app.listen(port, () => {
		Logger.log(`🚀 Application is running on: http://localhost:${port}/${envs.api.prefix}`)
	})
}

bootstrap()
