import { ClsModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { UserResourceModule } from '@domain/userResource/userResourceModule';
import { BrokerModule } from '@shared/broker/brokerModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { UserResourceBrokerController } from './controllers/userResource/userResourceController';

@Module({
  imports: [BrokerModule, UnitOfWorkModule, ClsModule, UserResourceModule],
  providers: [UserResourceBrokerController],
})
export class UserResourceBrokerModule {}
