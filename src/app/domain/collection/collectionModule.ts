import { Module } from '@nestjs/common';

import { ResourceModule } from '../resource/resourceModule';
import { CollectionMapper } from './mappers/collection/collectionMapper';
import { CollectionRepositoryFactory } from './repositories/collection/collectionRepository';
import { CollectionService } from './services/collection/collectionService';

@Module({
  imports: [ResourceModule],
  controllers: [],
  providers: [CollectionService, CollectionMapper, CollectionRepositoryFactory],
  exports: [CollectionService, CollectionMapper],
})
export class CollectionModule {}
