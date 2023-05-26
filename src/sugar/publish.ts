import { SNSClient, PublishCommand, PublishInput, PublishCommandOutput, MessageAttributeValue } from '@aws-sdk/client-sns';
import { MessageReceipt } from '../model/MessageReceipt';
import { PublishOptions } from '../model/PublishOptions';

import { SNSClientWrapper } from '../service/SNSClientWrapper';

export async function publish(topicArn: string, payload: Record<string, any> | string, options?: PublishOptions): Promise<MessageReceipt> {

  const client: SNSClient = SNSClientWrapper.instance().client;
  const message: string = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const { subject, deduplicationId, groupId, tags } = options || {};

  const messageAttributes: Record<string, MessageAttributeValue> | undefined = !tags ? undefined : Object.keys(tags).reduce((attributes: Record<string, MessageAttributeValue>, key: string) => {
    if (Array.isArray(tags[key])) {
      attributes[key] = {
        DataType: 'String.Array',
        StringValue: JSON.stringify(tags[key] as string[])
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
    TopicArn: topicArn,
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
