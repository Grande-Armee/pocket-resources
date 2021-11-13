import { LoggerService } from '@grande-armee/pocket-common';
import { Logger } from 'typeorm';

export class PostgresLogger implements Logger {
  public constructor(private readonly loggerService: LoggerService) {}

  public logQuery(query: string, parameters?: any[]): void {
    this.loggerService.log('Executing database query', {
      query,
      parameters,
    });
  }

  public log(level: 'log' | 'info' | 'warn', message: any): void {
    this.loggerService.log(message);
  }

  public logMigration(message: string): void {
    this.loggerService.log('Running migration', { message });
  }

  public logQueryError(error: string | Error, query: string, parameters?: any[]): void {
    this.loggerService.error('Query error', { error, query, parameters });
  }

  public logQuerySlow(time: number, query: string, parameters?: any[]): void {
    this.loggerService.log('Query running slow', { query, parameters, time });
  }

  public logSchemaBuild(message: string): void {
    this.loggerService.log(message);
  }
}
