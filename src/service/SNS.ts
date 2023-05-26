import { SNSClient, PublishCommand, PublishInput, PublishCommandOutput, MessageAttributeValue } from '@aws-sdk/client-sns';
import { MessageReceipt } from '../model/MessageReceipt';
import { PublishOptions } from '../model/PublishOptions';

import { SNSClientWrapper } from './SNSClientWrapper';


/**
 * Wrapper around AWS SNS to normalize the 90% cases into a few common
 * calls.
 */
export class SNS {
  private topicArn: string;

  private client: SNSClient;

  /**
   *
   * @param topicArn To bind this SNS instance to.
   */
  constructor(topicArn: string) {
    this.topicArn = topicArn;
    this.client = SNSClientWrapper.instance().client;
  }

  /**
   * Convenience method around the publish behavior of SNS
   *
   * @param topicARN to send the message.
   * @param payload of the message to send.
   * @param options to decorate the 'publish' with the request.
   */
  public async publish(payload: Record<string, any> | string, options?: PublishOptions): Promise<MessageReceipt> {

    const client: SNSClient = SNSClientWrapper.instance().client;
    const message: string = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const { subject, deduplicationId, groupId, tags } = options || {};

    const messageAttributes: Record<string, MessageAttributeValue> | undefined = !tags ? undefined : Object.keys(tags).reduce((attributes: Record<string, MessageAttributeValue>, key: string) => {
      if (Array.isArray(tags[key])) {
        attributes[key] = {
          DataType: 'String.Array',
          StringValue: (tags[key] as string[]).join(',')
        };
      } else {
        attributes[key] = {
          DataType: 'String',
          StringValue: tags[key] as string
        };
      }
      return attributes;
    }, {});

    const input: PublishInput = {
      TopicArn: this.topicArn,
      Message: message,
      Subject: subject,
      MessageAttributes: messageAttributes,
      MessageDeduplicationId: deduplicationId,
      MessageGroupId: groupId,
    };
    const command = new PublishCommand(input);
    const response: PublishCommandOutput = await client.send(command);
    return new MessageReceipt(response.MessageId as string);
  }
}
