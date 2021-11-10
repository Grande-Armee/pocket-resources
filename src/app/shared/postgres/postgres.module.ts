import { CommonModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { entities } from './entities';
import { PostgresConfig, postgresConfigProvider, POSTGRES_CONFIG } from './providers/postgres-config';

@Module({
  imports: [CommonModule],
  providers: [postgresConfigProvider],
  exports: [postgresConfigProvider],
})
class PostgresConfigModule {}

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useFactory: async (postgresConfig: PostgresConfig) => {
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
        };
      },
      inject: [POSTGRES_CONFIG],
    }),
  ],
})
export class PostgresModule {}
