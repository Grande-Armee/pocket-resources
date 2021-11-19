import { getConnectionToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ScriptHandler } from '../interfaces';

export const migrationRunHandler: ScriptHandler = async (appContext) => {
  const connection = appContext.get<Connection>(getConnectionToken());

  await connection.runMigrations({
    transaction: 'all',
  });
};
