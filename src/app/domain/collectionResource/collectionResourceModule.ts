import { Module } from '@nestjs/common';

import { DatabaseModule } from '@shared/database/databaseModule';

import { CollectionResourceMapper } from './mappers/collectionResource/collectionResourceMapper';
import { CollectionResourceRepositoryFactory } from './repositories/collectionResource/collectionResourceRepository';
import { CollectionResourceService } from './services/collectionResource/collectionResourceService';

@Module({
  imports: [DatabaseModule],
  providers: [CollectionResourceService, CollectionResourceMapper, CollectionResourceRepositoryFactory],
  exports: [CollectionResourceService],
})
export class CollectionResourceModule {}
