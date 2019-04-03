import { SNSEvent } from 'aws-lambda';
import { SNSEventCondition } from './SNSEventCondition';
import { SNSRouter } from './SNSRouter';

/**
 *
 * @param route for this function.
 */
export function snsListener<Of>(type: Of, condition?: SNSEventCondition, priority?: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const targetMethod = descriptor.value;

    descriptor.value = function() {
      const event: SNSEvent = arguments[0];

      return targetMethod.apply(this, arguments);
    };

    SNSRouter.register(descriptor.value, condition, priority);

    return descriptor;
  };
}
