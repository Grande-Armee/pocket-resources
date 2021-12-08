import { ConfigService, Joi } from '@grande-armee/pocket-common';

import { PostgresConfig } from './types';

export const postgresConfigFactory = async (configService: ConfigService, joi: Joi): Promise<PostgresConfig> => {
  return configService.validateConfig<PostgresConfig>(
    (envVariables) => ({
      host: envVariables.POSTGRES_HOST,
      port: envVariables.POSTGRES_PORT,
      username: envVariables.POSTGRES_USERNAME,
      password: envVariables.POSTGRES_PASSWORD,
      databaseName: envVariables.POSTGRES_DATABASE_NAME,
      appName: envVariables.APP_NAME,
      isLoggingEnabled: envVariables.POSTGRES_IS_LOGGING_ENABLED,
    }),
    joi.object({
      host: joi.string().required(),
      port: joi.number().required(),
      username: joi.string().required(),
      password: joi.string().required(),
      databaseName: joi.string().required(),
      appName: joi.string().required(),
      isLoggingEnabled: joi.boolean().default(false),
    }),
  );
};
