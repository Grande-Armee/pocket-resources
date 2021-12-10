import { getConnectionToken } from '@nestjs/typeorm';
import { Connection, MigrationExecutor } from 'typeorm';

import { ScriptHandler } from '../types';

export const migrationRevertHandler: ScriptHandler = async (appContext) => {
  const connection = appContext.get<Connection>(getConnectionToken());

  const queryRunner = connection.createQueryRunner();

  const migrationExecutor = new MigrationExecutor(connection, queryRunner);

  const executedMigrations = await migrationExecutor.getExecutedMigrations();

  await executedMigrations.reduce(async (result: Promise<void>) => {
    await result;

    await migrationExecutor.undoLastMigration();
  }, Promise.resolve());
};
