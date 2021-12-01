import { CommonModule } from '@grande-armee/pocket-common';
import { Global, Module } from '@nestjs/common';

import { PostgresModule } from './postgres/postgresModule';
import { UnitOfWorkModule } from './unitOfWork/unitOfWorkModule';

@Global()
@Module({
  imports: [CommonModule, PostgresModule, UnitOfWorkModule],
  exports: [CommonModule, PostgresModule, UnitOfWorkModule],
})
export class SharedModule {}
