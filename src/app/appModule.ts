import { Module } from '@nestjs/common';

import { DomainModule } from '@domain/domainModule';
import { BrokerModule } from '@shared/broker/brokerModule';
import { DatabaseModule } from '@shared/database/databaseModule';
import { LoggerModule } from '@shared/logger/loggerModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { BrokerApiModule } from './brokerApi/brokerApiModule';

@Module({
  imports: [BrokerModule, DatabaseModule, UnitOfWorkModule, LoggerModule, DomainModule, BrokerApiModule],
})
export class AppModule {}
