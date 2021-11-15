import { LoggerService } from '@grande-armee/pocket-common';
import { QueryRunner } from 'typeorm';

import { DomainEventsDispatcher } from '@shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

import { TransactionalEntityManager, TransactionIsolationLevel } from './interfaces';

export type TransactionalCallback<Result> = (unitOfWork: UnitOfWork) => Promise<Result>;

export class UnitOfWork {
  public constructor(
    private readonly logger: LoggerService,
    private readonly queryRunner: QueryRunner,
    private readonly domainEventsDispatcher: DomainEventsDispatcher,
  ) {}

  public async init(isolationLevel?: TransactionIsolationLevel): Promise<void> {
    this.logger.log('Starting transaction...');
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction(isolationLevel);
    this.logger.log('Transaction started.');
  }

  public async commit(): Promise<void> {
    this.logger.log('Commiting transaction...');
    await this.queryRunner.commitTransaction();
    this.logger.log('Transaction commited.');

    this.logger.log('Dispatching domain events...');
    await this.domainEventsDispatcher.dispatch();
    this.logger.log('Domain events dispached.');
  }

  public async rollback(): Promise<void> {
    this.logger.log('Rolling back transaction...');
    await this.queryRunner.rollbackTransaction();
    this.logger.log('Transaction rolled back.');
  }

  public async release(): Promise<void> {
    await this.queryRunner.release();
  }

  public getEntityManager(): TransactionalEntityManager {
    return this.queryRunner.manager;
  }

  public getDomainEventsDispatcher(): DomainEventsDispatcher {
    return this.domainEventsDispatcher;
  }

  public async runInTransaction<Result>(
    callback: TransactionalCallback<Result>,
    isolationLevel?: TransactionIsolationLevel,
  ): Promise<Result> {
    try {
      await this.init(isolationLevel);

      const result = await callback(this);

      await this.commit();
      await this.release();

      return result;
    } catch (e) {
      await this.rollback();
      await this.release();

      throw e;
    }
  }
}
