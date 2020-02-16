import { Logger, LoggerService, LoggerConfig } from '@mu-ts/logger';

/**
 *
 * @param pathPrefix to prepend to all endpoints within this class.
 */
export function listeners(arnPrefix?: string) {
  return function(target: any) {
    const parent: string = target.constructor.name;
    const logConfig: LoggerConfig = { name: `${parent}.listeners`, adornments: { '@mu-ts': 'sns' } };
    const logger: Logger = LoggerService.named(logConfig);
    logger.debug({ arnPrefix }, 'listeners()', 'initializing');

    target.prototype.snsTopicPrefix = arnPrefix;
  };
}
