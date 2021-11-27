import { MessageContext } from './messageContext';
import { MessageData } from './messageData';

export interface MessageContent<Payload> {
  readonly data: MessageData<Payload>;
  readonly context: MessageContext;
}
