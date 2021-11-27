import { CommonModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';

import { BrokerService } from './services/broker/brokerService';

@Module({
  imports: [
    RMQModule.forRootAsync({
      imports: [CommonModule],
      useFactory: () => {
        return {
          exchangeName: 'pocket',
          connections: [
            {
              login: 'username',
              password: 'password',
              host: 'rabbitmq',
              port: 5672,
            },
          ],
          queueName: 'pocket-resources-queue',
          serviceName: 'pocket-resources',
        };
      },
    }),
  ],
  providers: [BrokerService],
  exports: [BrokerService],
})
export class BrokerModule {}
