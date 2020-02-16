import { Logger, LoggerService } from '@mu-ts/logger';
import { SNSMessage, SNSMessageAttribute } from 'aws-lambda';
import { MessageAttribute } from '../model/MessageAttribute';
import { Listener } from '../model/Listener';
import { ListenerContext } from '../model/ListenerContext';

/**
 * Contains all of the listeners that will be potentially executed within
 * the SNSRouter.
 */
export class ListenerRegistry {
  private static _instance: ListenerRegistry;
  private readonly listeners: Listener[];
  private readonly logger: Logger;

  private constructor() {
    this.logger = LoggerService.named({ name: 'ListenerRegistery', adornments: { '@mu-ts': 'sns' } });
    this.listeners = [];
    this.logger.info('init()');
  }

  /**
   *
   * @param listener to execute when there is a match.
   * @param arnPrefix to restrict execution to.
   * @param arnPostfix to restrict execution to.
   * @param attributes to restrict execution to.
   */
  public static register(
    behavior: Function,
    arnPrefix?: string,
    arnPostfix?: string,
    ...attributes: MessageAttribute[]
  ): void {
    this.instance.logger.debug('register()', { arnPrefix, arnPostfix, attributes });
    this.instance.listeners.push({
      behavior,
      arnPostfix,
      arnPrefix,
      attributes,
    } as Listener);

    this.instance.logger.debug('register()', { listeners: this.instance.listeners.length });
  }

  /**
   *
   * @param message to lookup listeners for.
   */
  public static recall(message: SNSMessage): ListenerContext[] {
    this.instance.logger.debug('recall()', { message });

    /**
     * First match wins. So if a listener has little to no restrictions it may
     * end up being overly accepting and execute for to many scenarios.
     */
    const listeners: ListenerContext[] = this.instance.listeners
      .filter((listener: Listener) => {
        const arn: string = message.TopicArn;

        if (listener.arnPrefix && !arn.startsWith(listener.arnPrefix)) return false;
        if (listener.arnPostfix && !arn.endsWith(listener.arnPostfix)) return false;
        /**
         * All attributes must have a truthy match.
         */
        if (listener.attributes) {
          return listener.attributes.reduce((isMatch: boolean, attribute: MessageAttribute) => {
            if (!isMatch) return false;
            const messageAttribute: SNSMessageAttribute | undefined = message.MessageAttributes[attribute.name];
            if (!messageAttribute) return false;
            if (Array.isArray(attribute.value)) return attribute.value.includes(messageAttribute.Value);
            return attribute.value === messageAttribute.Value;
          }, true);
        }
        return true;
      })
      .map((listener: Listener) => ({ listener, message } as ListenerContext));

    this.instance.logger.debug('recall()', { listeners });

    return listeners;
  }

  private static get instance() {
    if (!this._instance) ListenerRegistry._instance = new ListenerRegistry();
    return ListenerRegistry._instance;
  }
}
