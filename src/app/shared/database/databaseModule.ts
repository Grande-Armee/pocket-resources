import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from '@shared/config';

import { entities } from './entities';
import { migrations } from './migrations';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.databaseName,
      applicationName: config.appName,
      type: 'postgres',
      entities,
      migrations,
      migrationsRun: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
