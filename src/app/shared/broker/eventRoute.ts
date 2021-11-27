import { RMQRoute } from 'nestjs-rmq';

export function EventRoute(topic: string): MethodDecorator {
  return RMQRoute(topic, {
    msgFactory: (message) => [message],
  });
}
