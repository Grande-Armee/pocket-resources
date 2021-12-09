import { DtoModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { DatabaseModule } from '@shared/database/databaseModule';

import { UserResourceTagMapper } from './mappers/userResourceTag/userResourceTagMapper';
import { UserResourceTagRepositoryFactory } from './repositories/userResourceTag/userResourceTagRepository';
import { UserResourceTagService } from './services/userResourceTag/userResourceTagService';

@Module({
  imports: [DatabaseModule, DtoModule],
  providers: [UserResourceTagService, UserResourceTagMapper, UserResourceTagRepositoryFactory],
  exports: [UserResourceTagService],
})
export class UserResourceTagModule {}
