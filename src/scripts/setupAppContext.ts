import { LoggerService } from '@grande-armee/pocket-common';
import { INestApplicationContext, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { DatabaseModule } from '@shared/database/databaseModule';
import { LoggerModule } from '@shared/logger/loggerModule';

// import { AppModule } from '../app/appModule';

@Module({
  imports: [DatabaseModule, LoggerModule],
})
class ScriptsModule {}

export const setupAppContext = async (): Promise<INestApplicationContext> => {
  const app = await NestFactory.createApplicationContext(ScriptsModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(LoggerService));
  app.flushLogs();

  return app;
};
