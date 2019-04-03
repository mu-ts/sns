import { Context, SNSEvent } from 'aws-lambda';
import { SNSEventCondition } from './SNSEventCondition';

interface SNSRoute {
  endpoint: Function;
  condition?: SNSEventCondition;
  priority: number;
}

/**
 * Singleton that contains all of the routes registered for this
 * endpoint.
 */
export abstract class SNSRouter {
  private static routes: Array<SNSRoute> = new Array();

  private constructor() {}

  /**
   *
   * @param endpoint to be executed.
   * @param condition, that if provided, will test if this endpoint should even
   *        be invoked.
   * @param priority of this endpoint. A higher value indicates it should be
   *        executed ahead of other endpoints. Defaults to 0.
   *
   */
  public static register(endpoint: Function, condition?: SNSEventCondition, priority?: number): void {
    SNSRouter.routes.push({
      endpoint: endpoint,
      condition: condition,
      priority: priority || 0,
    });
  }

  /**
   *
   * @param event to invoke the endpoint with.
   * @param context of the invocation.
   * @param callback to execute when completed.
   */
  public static async handle(event: SNSEvent, context: Context): Promise<void> {
    const routeOptions: Array<SNSRoute> = SNSRouter.routes
      .filter((route: SNSRoute) => {
        console.log('check condition', route);
        if (route.condition) {
          return route.condition(event);
        }
        return route;
      })
      .sort((first: SNSRoute, second: SNSRoute) => second.priority - first.priority);

    if (!routeOptions || routeOptions.length === 0) {
      throw Error('Action is not implemented at this path.');
    }

    let promiseChain = Promise.resolve();

    for (const route of routeOptions) {
      promiseChain = promiseChain.then(() => route.endpoint(event, context));
    }

    return await promiseChain;
  }
}
