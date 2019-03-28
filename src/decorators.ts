import 'reflect-metadata';
import { HTTPHeaders, HTTPResponse, HTTPEvent, HTTPAction, HTTPBody } from "./Model";
import { SNSRouter } from './SNSRouter';

export const METADATA_KEY: string = '__MU-TS';
export const REDACTED_KEY: string = 'redacted';

/**
 * Function interface for the logic that will check if a route
 * should be executed or not.
 */
export interface EndpointCondition {
  (body: HTTPBody | undefined, event: HTTPEvent): boolean;
}

/**
 *
 * @param route for this function.
 */
export function sns(path: string, action: HTTPAction | string, condition?: EndpointCondition, priority?: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    const targetMethod = descriptor.value;

    descriptor.value = function() {
      const event: HTTPEvent = arguments[0];

      return targetMethod.apply(this, arguments)
          .then((response: HTTPResponse) => {
            response.addHeader('X-REQUEST-ID', event.requestContext.requestId);
            return response;
          })
          .catch((error: any) => {
            return HTTPResponse
                .setBody({ message: error.message })
                .setStatusCode(501)
                .addHeader('X-REQUEST-ID', event.requestContext.requestId);
          });
    }

    const routeAction = typeof action === 'string' ? action.toUpperCase() : action;

    SNSRouter.register(path, routeAction.toUpperCase(), descriptor.value, condition, priority)

    return descriptor;
  };
}
