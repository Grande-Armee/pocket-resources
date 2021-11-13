import { LoggerService } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { entities } from './entities';
import { PostgresLogger } from './postgres.logger';
import { PostgresConfig, postgresConfigProvider, POSTGRES_CONFIG } from './providers/postgres-config';

@Module({
  providers: [postgresConfigProvider],
  exports: [postgresConfigProvider],
})
class PostgresConfigModule {}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useFactory: async (postgresConfig: PostgresConfig, loggerService: LoggerService) => {
        const { host, port, username, password, databaseName, appName, isLoggingEnabled } = postgresConfig;

        return {
          host,
          port,
          username,
          password,
          entities,
          type: 'postgres',
          database: databaseName,
          applicationName: appName,
          logging: isLoggingEnabled,
          synchronize: true,
          dropSchema: true,
          logger: new PostgresLogger(loggerService),
        };
      },
      inject: [POSTGRES_CONFIG, LoggerService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class PostgresModule {}
