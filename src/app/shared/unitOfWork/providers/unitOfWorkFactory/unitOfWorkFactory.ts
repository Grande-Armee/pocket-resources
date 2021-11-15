import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { DomainEventsDispatcherFactory } from '@shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

import { UnitOfWork } from './unitOfWork';

@Injectable()
export class UnitOfWorkFactory {
  public constructor(
    @InjectConnection() private connection: Connection,
    private readonly domainEventsDispatcherFactory: DomainEventsDispatcherFactory,
    private readonly logger: LoggerService,
  ) {}

  public async create(): Promise<UnitOfWork> {
    const queryRunner = this.connection.createQueryRunner();
    const domainEventsDispatcher = this.domainEventsDispatcherFactory.create();

    return new UnitOfWork(this.logger, queryRunner, domainEventsDispatcher);
  }
}
