import { CommonModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { DomainModule } from './domain/domain.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [CommonModule, SharedModule, DomainModule],
})
export class AppModule {}
