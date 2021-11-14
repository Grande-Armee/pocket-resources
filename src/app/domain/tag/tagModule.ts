import { Module } from '@nestjs/common';

import { TagMapper } from './mappers/tagMapper/tagMapper';
import { TagRepositoryFactory } from './repositories/tagRepository/tagRepository';
import { TagService } from './services/tagService/tagService';

@Module({
  providers: [TagService, TagMapper, TagRepositoryFactory],
  exports: [TagService, TagMapper],
})
export class TagModule {}
