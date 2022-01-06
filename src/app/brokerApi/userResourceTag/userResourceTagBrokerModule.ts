import { ClsModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { UserResourceTagModule } from '@domain/userResourceTag/userResourceTagModule';
import { BrokerModule } from '@shared/broker/brokerModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { UserResourceTagBrokerController } from './controllers/userResourceTag/userResourceTagController';

@Module({
  imports: [BrokerModule, UnitOfWorkModule, ClsModule, UserResourceTagModule],
  providers: [UserResourceTagBrokerController],
})
export class UserResourceTagBrokerModule {}
