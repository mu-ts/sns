import { Logger, LoggerService, LoggerConfig } from '@mu-ts/logger';
import { ListenerRegistry } from '../services/ListenerRegistry';
import { MessageAttribute } from '../model/MessageAttribute';

/**
 *
 * @param pathPrefix to prepend to all endpoints within this class.
 */
export function listener(arnPostfix?: string, ...attributes: { [key: string]: string }[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const parent: string = target.constructor.name;
    const logConfig: LoggerConfig = { name: `${parent}.listener`, adornments: { '@mu-ts': 'sns' } };
    const logger: Logger = LoggerService.named(logConfig);
    const targetMethod = descriptor.value;
    const arnPrefix: string | undefined = target.constructor.snsTopicPrefix;

    descriptor.value = function() {
      return targetMethod.apply(this, arguments);
    };

    logger.debug({ targetMethod, arnPrefix, arnPostfix, propertyKey }, 'listener()', 'registering');

    ListenerRegistry.register(
      descriptor.value,
      arnPrefix,
      arnPostfix,
      ...(attributes
        ? attributes.map((attribute: { [key: string]: string }) => {
            const name: string = Object.keys(attribute)[0];
            const value: string = attribute[name];
            return { name, value } as MessageAttribute;
          })
        : undefined)
    );

    return descriptor.value;
  };
}
