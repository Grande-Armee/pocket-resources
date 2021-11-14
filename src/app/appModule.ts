import { CommonModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { DomainModule } from './domain/domainModule';
import { SharedModule } from './shared/sharedModule';

@Module({
  imports: [CommonModule, SharedModule, DomainModule],
})
export class AppModule {}
