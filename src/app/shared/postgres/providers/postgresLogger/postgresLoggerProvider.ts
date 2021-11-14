import { Provider } from '@nestjs/common';

import { PostgresLogger } from './postgresLogger';

export const postgresLoggerProvider: Provider = {
  provide: PostgresLogger,
  useClass: PostgresLogger,
};
