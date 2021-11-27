import { BrokerMessage } from '../../../interfaces';
import { MessageContext } from './messageContext';
import { MessageData } from './messageData';

export type MessageHandler<Payload, Response> = (
  payload: Payload,
  data: MessageData<Payload>,
  context: MessageContext,
  message: BrokerMessage,
) => Promise<Response>;
