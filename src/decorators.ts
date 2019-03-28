import 'reflect-metadata';
import { SNS } from './SNS';

/**
/**
 *
 * @param route for this function.
 */
export function sns(topicARN: string,
                    payload: string | object,
                    subject?: string,
                    tags?: Map<string, string>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    return SNS.publish(topicARN, payload, subject, tags)
  };
}
