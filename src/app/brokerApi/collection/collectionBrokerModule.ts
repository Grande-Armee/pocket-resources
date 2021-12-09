import { ClsModule, DtoModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { CollectionModule } from '@domain/collection/collectionModule';
import { BrokerModule } from '@shared/broker/brokerModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { CollectionBrokerController } from './controllers/collection/collectionController';

@Module({
  imports: [BrokerModule, UnitOfWorkModule, DtoModule, ClsModule, CollectionModule],
  providers: [CollectionBrokerController],
})
export class CollectionBrokerModule {}
