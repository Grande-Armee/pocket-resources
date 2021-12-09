import { DtoModule, ClsModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { CollectionResourceModule } from '@domain/collectionResource/collectionResourceModule';
import { BrokerModule } from '@shared/broker/brokerModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { CollectionResourceBrokerController } from './controllers/collectionResource/collectionResourceController';

@Module({
  imports: [BrokerModule, UnitOfWorkModule, DtoModule, ClsModule, CollectionResourceModule],
  providers: [CollectionResourceBrokerController],
})
export class CollectionResourceBrokerModule {}
