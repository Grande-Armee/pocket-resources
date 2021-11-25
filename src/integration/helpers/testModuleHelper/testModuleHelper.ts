import { EnvVariables, ENV_VARIABLES } from '@grande-armee/pocket-common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppModule } from '@src/app/appModule';

export class TestModuleHelper {
  private builder: TestingModuleBuilder;

  public constructor() {
    this.builder = Test.createTestingModule({
      imports: [AppModule],
    });
  }

  public overrideEnvVariables(): TestModuleHelper {
    this.builder = this.builder.overrideProvider(ENV_VARIABLES).useValue({ ...this.getEnvVariables() });

    return this;
  }

  private getEnvVariables(): EnvVariables {
    return {
      LOGGER_SHOULD_PRETTIFY_LOGS: true,
      LOGGER_LOG_LEVEL: 'debug',
      POSTGRES_USERNAME: 'root',
      POSTGRES_PASSWORD: 'password',
      POSTGRES_HOST: 'pocket-resources-postgres',
      POSTGRES_PORT: 5432,
      POSTGRES_DATABASE_NAME: 'pocket_resources',
      POSTGRES_IS_LOGGING_ENABLED: false,
      RABBITMQ_URI: `amqp://username:password@rabbitmq:5672`,
      APP_NAME: `pocket-resources`,
    };
  }

  public async init(): Promise<TestingModule> {
    return this.builder.compile();
  }

  public static async close(testingModule: TestingModule): Promise<void> {
    const dbConnection: Connection = testingModule.get(getConnectionToken());

    await dbConnection.close();

    await testingModule.close();
  }

  public static async createTestingModule(): Promise<TestingModule> {
    return new TestModuleHelper().overrideEnvVariables().init();
  }
}
