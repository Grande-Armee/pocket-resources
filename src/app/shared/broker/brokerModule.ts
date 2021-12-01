import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';

import { CollectionTransporter } from './domain/collection/collectionTransporter';
import { CollectionResourceTransporter } from './domain/collectionResource/collectionResourceTransporter';
import { ResourceTransporter } from './domain/resource/resourceTransporter';
import { TagTransporter } from './domain/tag/tagTransporter';
import { BrokerInterceptor } from './interceptors/brokerInterceptor';
import { BrokerService } from './services/broker/brokerService';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'exchange1',
          type: 'topic',
        },
      ],
      uri: 'amqp://username:password@rabbitmq:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [
    BrokerInterceptor,
    BrokerService,
    ResourceTransporter,
    TagTransporter,
    CollectionTransporter,
    CollectionResourceTransporter,
  ],
  exports: [
    RabbitMQModule,
    BrokerInterceptor,
    BrokerService,
    ResourceTransporter,
    TagTransporter,
    CollectionTransporter,
    CollectionResourceTransporter,
  ],
})
export class BrokerModule {}
