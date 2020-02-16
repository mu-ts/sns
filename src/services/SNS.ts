import * as AWS from 'aws-sdk';

import { PublishResponse, PublishInput, MessageAttributeMap } from 'aws-sdk/clients/sns';
import { Logger, LoggerService } from '@mu-ts/logger';
import { MessageReceipt } from '../model/MessageReceipt';

/**
 * Wrapper around AWS SNS to normalize the 90% cases into a few common
 * calls.
 */
export class SNS {
  private readonly logger: Logger;
  private readonly topicARN: Promise<string>;
  private readonly sns: AWS.SNS;

  /**
   *
   * @param topicARN To bind this SNS instance to.
   * @param region to configure the AWS SNS client for.
   */
  constructor(topicARN: string | Promise<string>, region?: string) {
    this.logger = LoggerService.named({ name: 'SNS', adornments: { '@mu-ts': 'sns' } });
    this.topicARN = typeof topicARN === 'string' ? Promise.resolve(topicARN) : topicARN;
    this.sns = new AWS.SNS({ apiVersion: '2010-03-31', region });
    this.logger.info('init()', { topicARN, region });
  }

  /**
   * Convenience method around the publish behavior of SNS
   *
   * @param payload of the messgae to send.
   * @param subject of the message to send. Optional
   * @param tags to attach to the message. Optional.
   */
  public async publish(
    payload: string | any,
    subject?: string,
    attributes?: { [key: string]: string }
  ): Promise<MessageReceipt> {
    this.logger.debug('publish()', 'Publishing message to topic.', { payload, subject, attributes });

    const topic: string = await this.topicARN;

    this.logger.debug('publish()', 'Topic being published to is.', { topic });

    const message: string = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const request: PublishInput = {
      TopicArn: topic,
      Message: message,
      Subject: subject,
      MessageAttributes: !attributes
        ? undefined
        : Object.keys(attributes).reduce((current: MessageAttributeMap, key: string) => {
            current[key] = {
              DataType: Array.isArray(attributes[key]) ? 'String.Array' : 'String',
              StringValue: Array.isArray(attributes[key])
                ? JSON.stringify(attributes[key])
                : (attributes[key] as string),
            };
            return current;
          }, {}),
    };

    this.logger.debug('publish()', 'Request to send is.', { request });

    const response: PublishResponse = await this.sns.publish(request).promise();

    this.logger.debug('publish()', 'Message sent.', { response });

    const receipt: MessageReceipt = new MessageReceipt(String(response.MessageId));

    this.logger.debug('publish()', 'Receipt.', { receipt });

    return receipt;
  }

  /**
   * Convenience method around the publish behavior of SNS
   *
   * @param topicARN to send the message.
   * @param payload of the messgae to send.
   * @param subject of the message to send. Optional
   * @param attributes to attach to the message. Optional.
   * @param region to find the topic, optional
   */
  public static async publish(
    topicARN: string,
    payload: string | any,
    subject?: string,
    attributes?: { [key: string]: string },
    region?: string
  ): Promise<MessageReceipt> {
    const sns: SNS = new SNS(topicARN, region || process.env.AWS_REGION || process.env.REGION);
    const receipt: MessageReceipt = await sns.publish(payload, subject, attributes);
    return receipt;
  }

  // private static async send(sns: AWS.SNS, parameters: PublishInput): Promise<PublishResponse> {
  // }df
}
