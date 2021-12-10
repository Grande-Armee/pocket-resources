import { DtoModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { DatabaseModule } from '@shared/database/databaseModule';

import { ResourceModule } from '../resource/resourceModule';
import { TagModule } from '../tag/tagModule';
import { UserResourceMapper } from './mappers/userResource/userResourceMapper';
import { UserResourceRepositoryFactory } from './repositories/userResource/userResourceRepository';
import { UserResourceService } from './services/userResource/userResourceService';

@Module({
  imports: [DatabaseModule, DtoModule, ResourceModule, TagModule],
  providers: [UserResourceService, UserResourceMapper, UserResourceRepositoryFactory],
  exports: [UserResourceService],
})
export class UserResourceModule {}
