import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { entities } from './entities';
import { migrations } from './migrations';
import { PostgresConfig, postgresConfigProvider, POSTGRES_CONFIG } from './providers/postgresConfig';
import { PostgresLogger } from './providers/postgresLogger/postgresLogger';

@Module({
  providers: [postgresConfigProvider, PostgresLogger],
  exports: [postgresConfigProvider, PostgresLogger],
})
class PostgresConfigModule {}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useFactory: async (postgresConfig: PostgresConfig, postgresLogger: PostgresLogger) => {
        const { host, port, username, password, databaseName, appName, isLoggingEnabled } = postgresConfig;

        const options: TypeOrmModuleOptions = {
          host,
          port,
          username,
          password,
          entities,
          type: 'postgres',
          database: databaseName,
          applicationName: appName,
          migrations,
          migrationsRun: false,
        };

        if (isLoggingEnabled) {
          Object.assign(options, {
            logging: true,
            logger: postgresLogger,
          });
        }

        return options;
      },
      inject: [POSTGRES_CONFIG, PostgresLogger],
    }),
  ],
  exports: [TypeOrmModule],
})
export class PostgresModule {}
