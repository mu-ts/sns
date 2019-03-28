import * as AWS from 'aws-sdk';
import { PublishResponse, PublishInput, MessageAttributeMap } from 'aws-sdk/clients/sns';

export class MessageReceipt {
  private messageId: string;
  constructor(messageId: string) {
    this.messageId = messageId;
  }
  public getMessageId(): string {
    return this.messageId;
  }
}

export interface SNSBodySerializer {
  (payload: object): string;
}

export function jsonSerializer(payload: object): string {
  return JSON.stringify(payload);
}

/**
 * Wraper around AWS SNS to normalize the 90% cases into a few common
 * calls.
 */
export class SNS {
  private topicARN: string;
  private sns: AWS.SNS;
  private serializer: SNSBodySerializer;
  private static globalSerializer: SNSBodySerializer = jsonSerializer;
  private static globalSNS: AWS.SNS;

  /**
   *
   * @param topicARN To bind this SNS instance to.
   * @param region to configure the AWS SNS client for.
   */
  constructor(topicARN: string, region?: string, serializer?: SNSBodySerializer) {
    this.topicARN = topicARN;
    this.sns = new AWS.SNS({ apiVersion: '2006-03-01', region });
    this.serializer = serializer || jsonSerializer;
  }

  /**
   *
   * @param serializer to use for all static calls.
   */
  public static setSerializer(serializer: SNSBodySerializer): void {
    SNS.globalSerializer = serializer;
  }

  /**
   *
   * @param serializer to use on this instance.
   */
  public setSerializer(serializer: SNSBodySerializer): void {
    this.serializer = serializer;
  }

  /**
   *
   * @param region to configure the AWS SNS client for.
   */
  public static setRegion(region: string): void {
    AWS.config.update({ region });
  }
  /**
   *
   * @param region to configure the AWS SNS client for.
   */
  public setRegion(region: string): void {
    this.sns.config.update({ region });
  }

  /**
   * Convenience method around the publish behavior of SNS
   *
   * @param topicARN to send the message.
   * @param payload of the messgae to send.
   * @param subject of the message to send. Optional
   * @param tags to attach to the message. Optional.
   */
  public static async publish(
    topicARN: string,
    payload: string | object,
    subject?: string,
    tags?: Map<string, string>
  ): Promise<MessageReceipt> {
    if (!SNS.globalSNS) SNS.globalSNS = new AWS.SNS({ apiVersion: '2006-03-01' });
    const parameters: PublishInput = SNS.buildParameters(SNS.globalSerializer, topicARN, payload, subject, tags);
    const response: PublishResponse = await SNS.send(SNS.globalSNS, parameters);
    const recieipt: MessageReceipt = new MessageReceipt('' + response.MessageId);
    return recieipt;
  }

  /**
   * Convenience method around the publish behavior of SNS
   *
   * @param payload of the messgae to send.
   * @param subject of the message to send. Optional
   * @param tags to attach to the message. Optional.
   */
  public async publish(
    payload: string | object,
    subject?: string,
    tags?: Map<string, string>
  ): Promise<MessageReceipt> {
    const parameters: PublishInput = SNS.buildParameters(this.serializer, this.topicARN, payload, subject, tags);
    const response: PublishResponse = await SNS.send(this.sns, parameters);
    const recieipt: MessageReceipt = new MessageReceipt('' + response.MessageId);
    return recieipt;
  }

  /**
   *
   * @param serializer To serialize the paylaod with.
   * @param topicARN to send the message to.
   * @param payload of the message to send.
   * @param subject of the message.
   * @param tags to attach to the message.
   */
  private static buildParameters(
    serializer: SNSBodySerializer,
    topicARN: string,
    payload: string | object,
    subject?: string,
    tags?: Map<string, string>
  ): PublishInput {
    const body = typeof payload === 'string' ? payload : serializer(payload);
    const parametrs: PublishInput = {
      TopicArn: topicARN,
      Message: body,
      Subject: subject,
      MessageAttributes: !tags
        ? undefined
        : Object.keys(tags).reduce((current: MessageAttributeMap, key: string) => {
            current[key] = {
              DataType: Array.isArray(tags.get(key)) ? 'String.Array' : 'String',
              StringValue: Array.isArray(tags.get(key)) ? JSON.stringify(tags.get(key)) : tags.get(key),
            };
            return current;
          }, {}),
    };
    return parametrs;
  }

  private static async send(sns: AWS.SNS, parameters: PublishInput): Promise<PublishResponse> {
    return await sns.publish(parameters).promise();
  }
}
