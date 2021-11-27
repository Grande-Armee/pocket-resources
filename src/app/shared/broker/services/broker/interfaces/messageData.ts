export interface MessageData<Payload> {
  readonly id: string;
  readonly timestamp: string;
  readonly payload: Payload;
}
