import { EnvParser } from '@grande-armee/pocket-common';

const envParser = new EnvParser();

const e = envParser.get.bind(envParser);

export const config = {
  appName: 'pocket-resources',
  database: {
    host: e('POSTGRES_HOST'),
    port: Number(e('POSTGRES_PORT')),
    username: e('POSTGRES_USERNAME'),
    password: e('POSTGRES_PASSWORD'),
    databaseName: e('POSTGRES_DATABASE_NAME'),
    isLoggingEnabled: Boolean(e('POSTGRES_IS_LOGGING_ENABLED')),
  },
  broker: {
    uri: e('RABBITMQ_URI'),
  },
  logger: {
    prettifyLogs: Boolean(e('LOGGER_SHOULD_PRETTIFY_LOGS')),
    logLevel: e('LOGGER_LOG_LEVEL'),
  },
};
