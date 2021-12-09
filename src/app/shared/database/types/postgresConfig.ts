export interface PostgresConfig {
  readonly host: string;
  readonly port: number;
  readonly username: string;
  readonly password: string;
  readonly databaseName: string;
  readonly isLoggingEnabled: boolean;
  readonly appName: string;
}
