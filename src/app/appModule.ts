import { Module } from '@nestjs/common';

import { BrokerApiModule } from './brokerApi/brokerApiModule';
import { DomainModule } from './domain/domainModule';
import { BrokerModule } from './shared/broker/brokerModule';
import { DatabaseModule } from './shared/database/databaseModule';
import { LoggerModule } from './shared/logger/loggerModule';
import { UnitOfWorkModule } from './shared/unitOfWork/unitOfWorkModule';

@Module({
  imports: [BrokerModule, DatabaseModule, UnitOfWorkModule, LoggerModule, DomainModule, BrokerApiModule],
})
export class AppModule {}
