import { ClsModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { TagModule } from '@domain/tag/tagModule';
import { BrokerModule } from '@shared/broker/brokerModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { TagBrokerController } from './controllers/tag/tagController';

@Module({
  imports: [BrokerModule, UnitOfWorkModule, ClsModule, TagModule],
  providers: [TagBrokerController],
})
export class TagBrokerModule {}
