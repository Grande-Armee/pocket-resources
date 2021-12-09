import { LoggerService } from '@grande-armee/pocket-common';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app/appModule';

export const setupAppContext = async (): Promise<INestApplicationContext> => {
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(LoggerService));
  app.flushLogs();

  return app;
};
