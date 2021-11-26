import { Module } from '@nestjs/common';

import { TagDto } from './controllers/broker/dtos/tagDto';
import { TagBrokerController } from './controllers/broker/tagBrokerController';
import { TagMapper } from './mappers/tag/tagMapper';
import { TagRepositoryFactory } from './repositories/tag/tagRepository';
import { TagService } from './services/tag/tagService';

@Module({
  providers: [TagService, TagMapper, TagRepositoryFactory, TagBrokerController],
  exports: [TagService, TagMapper, TagDto],
})
export class TagModule {}
