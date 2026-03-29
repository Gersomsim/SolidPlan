import 'dotenv/config'
import * as joi from 'joi'

interface EnvSchema {
	URL_DATABASE: string
	API_PORT: number
	API_VERSION: string
	API_PREFIX: string
}

const envsSchema = joi
	.object({
		URL_DATABASE: joi.string().required(),
		API_PORT: joi.number().required(),
		API_VERSION: joi.string().required(),
		API_PREFIX: joi.string().required(),
	})
	.unknown()

const { error, value } = envsSchema.validate(process.env) as {
	error: joi.ValidationError | null
	value: EnvSchema
}

if (error) {
	throw new Error(error.message)
}

export const envs = {
	api: {
		version: value.API_VERSION,
		port: value.API_PORT,
		prefix: value.API_PREFIX,
	},
	db: {
		url: value.URL_DATABASE,
	},
}
