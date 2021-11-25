import { DomainEventsDispatcher, LoggerService, GenericUnitOfWork } from '@grande-armee/pocket-common';
import { QueryRunner } from 'typeorm';

import { TransactionalEntityManager, TransactionIsolationLevel } from './interfaces';

export class PostgresUnitOfWork extends GenericUnitOfWork {
  public constructor(
    protected override readonly logger: LoggerService,
    protected override readonly domainEventsDispatcher: DomainEventsDispatcher,
    protected readonly queryRunner: QueryRunner,
  ) {
    super(logger, domainEventsDispatcher);
  }

  public async init(isolationLevel?: TransactionIsolationLevel): Promise<void> {
    await this.queryRunner.startTransaction(isolationLevel);
  }

  public async commit(): Promise<void> {
    await this.queryRunner.commitTransaction();

    await this.domainEventsDispatcher.dispatch();
  }

  public async rollback(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
  }

  public async cleanUp(): Promise<void> {
    await this.queryRunner.release();
  }

  public getEntityManager(): TransactionalEntityManager {
    return this.queryRunner.manager;
  }
}
