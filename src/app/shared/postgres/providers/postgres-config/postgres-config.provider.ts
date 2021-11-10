import { ConfigService, JOI } from '@grande-armee/pocket-common';
import { Provider } from '@nestjs/common';

import { postgresConfigFactory } from './postgres-config.factory';

export const POSTGRES_CONFIG = Symbol('POSTGRES_CONFIG');

export const postgresConfigProvider: Provider = {
  provide: POSTGRES_CONFIG,
  useFactory: postgresConfigFactory,
  inject: [ConfigService, JOI],
};
