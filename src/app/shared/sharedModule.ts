import { CommonModule } from '@grande-armee/pocket-common';
import { Global, Module } from '@nestjs/common';

import { DomainEventsDispatcherModule } from './domainEventsDispatcher/domainEventsDispatcher';
import { PostgresModule } from './postgres/postgresModule';
import { UnitOfWorkModule } from './unitOfWork/unitOfWorkModule';

@Global()
@Module({
  imports: [CommonModule, PostgresModule, DomainEventsDispatcherModule, UnitOfWorkModule],
  exports: [CommonModule, PostgresModule, DomainEventsDispatcherModule, UnitOfWorkModule],
})
export class SharedModule {}
