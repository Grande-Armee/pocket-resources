import { IntegrationEventsStoreModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { DatabaseModule } from '@shared/database/databaseModule';
import { LoggerModule } from '@shared/logger/loggerModule';

import { UnitOfWorkFactory } from './providers/unitOfWorkFactory';

@Module({
  imports: [LoggerModule, DatabaseModule, IntegrationEventsStoreModule],
  providers: [UnitOfWorkFactory],
  exports: [UnitOfWorkFactory],
})
export class UnitOfWorkModule {}
