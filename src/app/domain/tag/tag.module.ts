import { Module } from '@nestjs/common';

import { TagMapper } from './mappers/tag/tag.mapper';
import { TagRepositoryFactory } from './repositories/tag/tag.repository';
import { TagService } from './services/tag/tag.service';

@Module({
  providers: [TagService, TagMapper, TagRepositoryFactory],
  exports: [TagService],
})
export class TagModule {}
