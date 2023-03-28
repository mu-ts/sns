export class MessageReceipt {
  private messageId: string;
  constructor(messageId: string) {
    this.messageId = messageId;
  }
  public getMessageId(): string {
    return this.messageId;
  }
}