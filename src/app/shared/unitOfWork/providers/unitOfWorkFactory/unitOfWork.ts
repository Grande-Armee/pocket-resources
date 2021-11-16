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
    this.logger.debug('Starting transaction...');
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction(isolationLevel);
    this.logger.debug('Transaction started.');
  }

  public async commit(): Promise<void> {
    this.logger.debug('Commiting transaction...');
    await this.queryRunner.commitTransaction();
    this.logger.debug('Transaction commited.');

    this.logger.debug('Dispatching domain events...');
    await this.domainEventsDispatcher.dispatch();
    this.logger.debug('Domain events dispached.');
  }

  public async rollback(): Promise<void> {
    this.logger.debug('Rolling back transaction...');
    await this.queryRunner.rollbackTransaction();
    this.logger.debug('Transaction rolled back.');
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
