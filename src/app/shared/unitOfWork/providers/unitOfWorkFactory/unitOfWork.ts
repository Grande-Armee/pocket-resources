import { IntegrationEventsDispatcher, LoggerService, UnitOfWork } from '@grande-armee/pocket-common';
import { QueryRunner } from 'typeorm';

import { TransactionalEntityManager, TransactionIsolationLevel } from './interfaces';

export class PostgresUnitOfWork extends UnitOfWork {
  public constructor(
    protected override readonly logger: LoggerService,
    protected override readonly integrationEventsDispatcher: IntegrationEventsDispatcher,
    protected readonly queryRunner: QueryRunner,
  ) {
    super(logger, integrationEventsDispatcher);
  }

  public async init(isolationLevel?: TransactionIsolationLevel): Promise<void> {
    await this.queryRunner.startTransaction(isolationLevel);
  }

  public async commit(): Promise<void> {
    await this.queryRunner.commitTransaction();

    await this.integrationEventsDispatcher.dispatch();
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
