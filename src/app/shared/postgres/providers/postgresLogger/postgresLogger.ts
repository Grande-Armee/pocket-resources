import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';
import { Logger } from 'typeorm';

@Injectable()
export class PostgresLogger implements Logger {
  public constructor(private readonly logger: LoggerService) {}

  public logQuery(query: string, parameters?: any[]): void {
    this.logger.log('Executing database query', {
      query,
      parameters,
    });
  }

  public log(level: 'log' | 'info' | 'warn', message: any): void {
    this.logger.log(message);
  }

  public logMigration(message: string): void {
    this.logger.log('Running migration', { message });
  }

  public logQueryError(error: string | Error, query: string, parameters?: any[]): void {
    this.logger.error('Query error', { error, query, parameters });
  }

  public logQuerySlow(time: number, query: string, parameters?: any[]): void {
    this.logger.log('Query running slow', { query, parameters, time });
  }

  public logSchemaBuild(message: string): void {
    this.logger.log(message);
  }
}
