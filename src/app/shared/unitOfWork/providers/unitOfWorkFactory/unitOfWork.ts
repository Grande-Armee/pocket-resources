import { IntegrationEventsStore, LoggerService, UnitOfWork } from '@grande-armee/pocket-common';
import { QueryRunner } from 'typeorm';

import { TransactionalEntityManager, TransactionIsolationLevel } from './interfaces';

export class PostgresUnitOfWork extends UnitOfWork {
  public readonly entityManager: TransactionalEntityManager;

  public constructor(
    protected override readonly logger: LoggerService,
    public override readonly integrationEventsStore: IntegrationEventsStore,
    protected readonly queryRunner: QueryRunner,
  ) {
    super(logger, integrationEventsStore);

    this.entityManager = this.queryRunner.manager;
  }

  public async init(isolationLevel?: TransactionIsolationLevel): Promise<void> {
    await this.queryRunner.startTransaction(isolationLevel);
  }

  public async commit(): Promise<void> {
    await this.queryRunner.commitTransaction();
  }

  public async rollback(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
  }

  public async cleanUp(): Promise<void> {
    await this.queryRunner.release();
  }
}
