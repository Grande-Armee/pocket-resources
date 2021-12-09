import { DtoModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { DatabaseModule } from '@shared/database/databaseModule';

import { ResourceMapper } from './mappers/resource/resourceMapper';
import { ResourceRepositoryFactory } from './repositories/resource/resourceRepository';
import { ResourceService } from './services/resource/resourceService';

@Module({
  imports: [DatabaseModule, DtoModule],
  providers: [ResourceService, ResourceMapper, ResourceRepositoryFactory],
  exports: [ResourceService, ResourceMapper],
})
export class ResourceModule {}
