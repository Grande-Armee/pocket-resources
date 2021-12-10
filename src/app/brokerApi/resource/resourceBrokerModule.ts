import { ClsModule, DtoModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { ResourceModule } from '@domain/resource/resourceModule';
import { BrokerModule } from '@shared/broker/brokerModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { ResourceBrokerController } from './controllers/resource/resourceController';

@Module({
  imports: [BrokerModule, UnitOfWorkModule, DtoModule, ClsModule, ResourceModule],
  providers: [ResourceBrokerController],
})
export class ResourceBrokerModule {}
