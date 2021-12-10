import { DtoModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { DatabaseModule } from '@shared/database/databaseModule';

import { TagMapper } from './mappers/tag/tagMapper';
import { TagRepositoryFactory } from './repositories/tag/tagRepository';
import { TagService } from './services/tag/tagService';

@Module({
  imports: [DatabaseModule, DtoModule],
  providers: [TagService, TagMapper, TagRepositoryFactory],
  exports: [TagService, TagMapper],
})
export class TagModule {}
