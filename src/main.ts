import { ClsContextService, LoggerService, TRACE_ID_KEY } from '@grande-armee/pocket-common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';
import { ResourceService } from './app/domain/resource/services/resource/resource.service';
import { UnitOfWorkFactory } from './app/shared/unit-of-work/providers/unit-of-work-factory';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [String(process.env.RABBITMQ_URI)], // Can't use DI here -> process.env
    },
    bufferLogs: true,
  });

  app.useLogger(app.get(LoggerService));
  app.flushLogs();

  await app.listen();

  const cls = app.get(ClsContextService);
  const resourceService = app.get(ResourceService);
  const unitOfWorkFactory = app.get(UnitOfWorkFactory);

  const namespace = cls.getNamespace();

  namespace.run(async () => {
    cls.set(TRACE_ID_KEY, '123');

    const unitOfWork = await unitOfWorkFactory.create();

    await resourceService.createResource(unitOfWork, {
      url: 'asd',
    });

    console.log('s');
  });
}

bootstrap();
