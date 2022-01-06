import { Module } from '@nestjs/common';

import { ResourceModule } from '@domain/resource/resourceModule';
import { DatabaseModule } from '@shared/database/databaseModule';

import { CollectionMapper } from './mappers/collection/collectionMapper';
import { CollectionRepositoryFactory } from './repositories/collection/collectionRepository';
import { CollectionService } from './services/collection/collectionService';

@Module({
  imports: [DatabaseModule, ResourceModule],
  providers: [CollectionService, CollectionMapper, CollectionRepositoryFactory],
  exports: [CollectionService, CollectionMapper],
})
export class CollectionModule {}
