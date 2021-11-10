import { CommonModule } from '@grande-armee/pocket-common';
import { Global, Module } from '@nestjs/common';

import { DomainEventsDispatcherModule } from './domain-events-dispatcher/domain-events-dispatcher.module';
import { PostgresModule } from './postgres/postgres.module';
import { UnitOfWorkModule } from './unit-of-work/unit-of-work.module';

@Global()
@Module({
  imports: [CommonModule, PostgresModule, DomainEventsDispatcherModule, UnitOfWorkModule],
  exports: [CommonModule, PostgresModule, DomainEventsDispatcherModule, UnitOfWorkModule],
})
export class SharedModule {}
