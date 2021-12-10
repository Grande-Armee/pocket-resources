import { INestApplicationContext } from '@nestjs/common';

export type ScriptHandler = (app: INestApplicationContext) => Promise<void>;
