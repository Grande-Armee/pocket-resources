import { Module } from '@nestjs/common';

import { TagMapper } from './mappers/tag/tagMapper';
import { TagRepositoryFactory } from './repositories/tag/tagRepository';
import { TagService } from './services/tag/tagService';

@Module({
  providers: [TagService, TagMapper, TagRepositoryFactory],
  exports: [TagService, TagMapper],
})
export class TagModule {}
