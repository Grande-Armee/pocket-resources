import { Module } from '@nestjs/common';

import { CollectionResourceMapper } from './mappers/collectionResource/collectionResourceMapper';
import { CollectionResourceRepositoryFactory } from './repositories/collectionResource/collectionResourceRepository';
import { CollectionResourceService } from './services/collectionResource/collectionResourceService';

@Module({
  providers: [CollectionResourceService, CollectionResourceMapper, CollectionResourceRepositoryFactory],
  exports: [CollectionResourceService],
})
export class CollectionResourceModule {}
