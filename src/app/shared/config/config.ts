import * as dotenv from 'dotenv';

const loadEnvVariables = (): Record<string, string> => {
  const { parsed: envVariables, error } = dotenv.config();

  if (!envVariables) {
    throw error;
  }

  return envVariables;
};

const envVariables = loadEnvVariables();

// TODO: move to common
const getEnvVariable = <T>(envVariableKey: string): T => {
  const value = envVariables[envVariableKey];

  if (!value) {
    throw new Error(`Env variable ${envVariableKey} not set!`);
  }

  return value as any;
};

const e = getEnvVariable;

export const config = {
  appName: 'pocket-resources',
  database: {
    host: e<string>('POSTGRES_HOST'),
    port: e<number>('POSTGRES_PORT'),
    username: e<string>('POSTGRES_USERNAME'),
    password: e<string>('POSTGRES_PASSWORD'),
    databaseName: e<string>('POSTGRES_DATABASE_NAME'),
    isLoggingEnabled: Boolean(e<boolean>('POSTGRES_IS_LOGGING_ENABLED')),
  },
  broker: {
    uri: e<string>('RABBITMQ_URI'),
  },
  logger: {
    prettifyLogs: Boolean(e<boolean>('LOGGER_SHOULD_PRETTIFY_LOGS')),
    logLevel: e<string>('LOGGER_LOG_LEVEL'),
  },
};
