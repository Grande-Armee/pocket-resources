import { Module } from '@nestjs/common';

import { CollectionModule } from './collection/collectionModule';
import { CollectionResourceModule } from './collectionResource/collectionResourceModule';
import { ResourceModule } from './resource/resourceModule';
import { TagModule } from './tag/tagModule';
import { UserResourceModule } from './userResource/userResourceModule';
import { UserResourceTagModule } from './userResourceTag/userResourceTagModule';

@Module({
  imports: [
    ResourceModule,
    TagModule,
    UserResourceModule,
    UserResourceTagModule,
    CollectionModule,
    CollectionResourceModule,
  ],
  exports: [
    ResourceModule,
    TagModule,
    UserResourceModule,
    UserResourceTagModule,
    CollectionModule,
    CollectionResourceModule,
  ],
})
export class DomainModule {}
