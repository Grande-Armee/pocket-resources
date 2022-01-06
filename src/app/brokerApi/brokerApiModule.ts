import { ClsModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { DomainModule } from '@domain/domainModule';
import { BrokerModule } from '@shared/broker/brokerModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { CollectionBrokerModule } from './collection/collectionBrokerModule';
import { CollectionResourceBrokerModule } from './collectionResource/collectionResourceBrokerModule';
import { ResourceBrokerModule } from './resource/resourceBrokerModule';
import { TagBrokerModule } from './tag/tagBrokerModule';
import { UserResourceBrokerModule } from './userResource/userResourceBrokerModule';
import { UserResourceTagBrokerModule } from './userResourceTag/userResourceTagBrokerModule';

@Module({
  imports: [
    BrokerModule,
    UnitOfWorkModule,
    DomainModule,
    ClsModule,
    CollectionBrokerModule,
    CollectionResourceBrokerModule,
    ResourceBrokerModule,
    TagBrokerModule,
    UserResourceBrokerModule,
    UserResourceTagBrokerModule,
  ],
})
export class BrokerApiModule {}
