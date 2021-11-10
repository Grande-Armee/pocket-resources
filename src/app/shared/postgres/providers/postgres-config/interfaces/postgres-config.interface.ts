export interface PostgresConfig {
  readonly username: string;
  readonly password: string;
  readonly host: string;
  readonly port: number;
  readonly databaseName: string;
  readonly appName: string;
  readonly isLoggingEnabled: boolean;
}
