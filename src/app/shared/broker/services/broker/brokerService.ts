import { ClsContextService, DtoFactory, LoggerService, TRACE_ID_KEY } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

import { BrokerMessage } from '../../interfaces';
import { MessageContent, MessageHandler } from './interfaces';

@Injectable()
export class BrokerService {
  public constructor(
    private readonly clsContextService: ClsContextService,
    private readonly dtoFactory: DtoFactory,
    private readonly logger: LoggerService,
  ) {}

  private parseMessage(message: BrokerMessage): MessageContent<any> {
    const content = JSON.parse(message.content.toString()) as MessageContent<any>;

    const { data, context } = content;

    if (!data || !context) {
      throw new Error('Message lacks either data or context properties.');
    }

    return content;
  }

  // TODO: handling events
  // public async handleEvent() {}

  // TODO: change name
  public async handleMessage<Payload, Response>(
    message: BrokerMessage,
    PayloadDtoConstructor: ClassConstructor<Payload>,
    ResponseDtoConstructor: ClassConstructor<Response>,
    handler: MessageHandler<Payload, Response>,
  ): Promise<Response> {
    try {
      const routingKey = message.fields.routingKey;

      this.logger.debug('Parsing incoming broker message...', {
        routingKey,
      });

      const content = this.parseMessage(message);

      const { context, data } = content;

      const namespace = this.clsContextService.getNamespace();

      const responseDto = await namespace.runAndReturn(async () => {
        this.clsContextService.set(TRACE_ID_KEY, context.traceId);

        this.logger.debug('Handling incoming broker message...', {
          routingKey,
        });

        const payload = this.dtoFactory.createDtoInstance<Payload>(PayloadDtoConstructor, data.payload);

        const response = await handler(
          payload,
          {
            ...data,
            payload,
          },
          context,
          message,
        );

        return this.dtoFactory.createDtoInstance(ResponseDtoConstructor, response);
      });

      this.logger.debug('Successfully handled broker message.', {
        routingKey,
      });

      return responseDto;
    } catch (e: any) {
      // TODO: better error logging
      this.logger.error('Error while handling RabbitMQ message.', e);

      throw e;
    }
  }
}
