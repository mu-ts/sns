import { Logger, LoggerService } from '@mu-ts/logger';
import { SNSEvent, SNSEventRecord, SNSMessage } from 'aws-lambda';
import { ListenerRegistry } from './ListenerRegistry';
import { ListenerContext } from '../model/ListenerContext';

/**
 * Singleton that contains all of the routes registered for this
 * endpoint.
 */
export class SNSRouter {
  private static _instance: SNSRouter;
  private readonly logger: Logger;

  private constructor() {
    this.logger = LoggerService.named({ name: 'SNSRouter', adornments: { '@mu-ts': 'sns' } });
    this.logger.info('init()');
  }

  /**
   * @param event to invoke the endpoint with.
   */
  public static async handle(event: SNSEvent): Promise<void> {
    this.instance.logger.info('handle()', { event });

    const promises: Promise<void>[] = event.Records.map((record: SNSEventRecord) => record.Sns)
      .map((message: SNSMessage) => ListenerRegistry.recall(message))
      .reduce((accumulator: ListenerContext[], current: ListenerContext[]) => accumulator.concat(current), [])
      .map(
        (context: ListenerContext) =>
          new Promise(async resolve => {
            try {
              await context.listener.behavior(context.message);
              resolve();
            } catch (error) {
              this.instance.logger.error('Could not execute a listener.', error, { listener: context.listener });
              resolve();
            }
          })
      );

    this.instance.logger.info('handle()', { promises: promises.length }, `There are ${promises.length} to resolve.`);

    await Promise.all(promises);

    this.instance.logger.info('handle()', { promises: promises.length }, 'All promsies resolved.');

    return;
  }

  private static get instance() {
    if (!this._instance) SNSRouter._instance = new SNSRouter();
    return SNSRouter._instance;
  }
}
