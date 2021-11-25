import { DomainEventsDispatcherFactory, LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { PostgresUnitOfWork } from './unitOfWork';

@Injectable()
export class UnitOfWorkFactory {
  public constructor(
    @InjectConnection() private connection: Connection,
    private readonly domainEventsDispatcherFactory: DomainEventsDispatcherFactory,
    private readonly logger: LoggerService,
  ) {}

  public async create(): Promise<PostgresUnitOfWork> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    const domainEventsDispatcher = this.domainEventsDispatcherFactory.create();

    return new PostgresUnitOfWork(this.logger, domainEventsDispatcher, queryRunner);
  }
}
