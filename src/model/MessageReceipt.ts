export class MessageReceipt {
  private _messageId: string;

  constructor(messageId: string) {
    this._messageId = messageId;
  }

  public get messageId(): string {
    return this._messageId;
  }
}
