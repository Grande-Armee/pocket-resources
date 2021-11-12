import { LoggerService } from '@grande-armee/pocket-common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [String(process.env.RABBITMQ_URI)], // Can't use DI here -> process.env
    },
    bufferLogs: true,
  });

  app.useLogger(app.get(LoggerService));
  app.flushLogs();

  await app.listen();
}

/*

/users
POST - register user

/users/:userId
GET - find user by id
DELETE - remove user by id (and all related data from other microservices)
PUT - update user by id

/users/login
POST - login user

/users/reset-password
POST - reset user's password

/users/current
GET - find current user by token

/resources?userId=:userId
GET - find many userResources for user
POST - create resource & add userResource by userId and resourceId

/resources/:resourceId?userId=:userId
GET - find userResource by userId and resourceId
DELETE - remove userResource by userId and resourceId
PUT - update userResource (rating etc)

/tags?userId=:userId
GET - find all tags for user
POST - create a tag for user

/tags/:tagId?userId=:userId
PUT - update a tag for user
DELETE - delete a tag for user

/resources/:resourceId/tags?userId=:userId
POST - add userResourceTag for userId, resourceId and tagId

/resources/:resourceId/tags/:tagId?userId=:userId
DELETE - delete a userResourceTag for userId, resourceId and tagId

*/

bootstrap();
