import { HTTPEvent, HTTPResponse, HTTPBody, HTTPHeaders } from "./Model";
import { Context, Callback, SNSEvent, SNSEventRecord, SNSMessage, SNSMessageAttributes, SNSMessageAttribute } from "aws-lambda";
import { HTTPSerializer, JSONRedactingSerializer } from "./serialization";
import { EndpointCondition } from "./decorators";

interface SNSRoute {
  resource: string;
  action: string;
  endpoint: Function;
  condition?: EndpointCondition;
  priority: number;
}

/**
 * Singleton that contains all of the routes registered for this
 * endpoint.
 */
export abstract class SNSRouter {

  private static routes: Array<SNSRoute> = new Array();
  private static serializer: HTTPSerializer = new JSONRedactingSerializer();

  private constructor() { }

  /**
   * 
   * @param resource to map this endpoint to.
   * @param action to map this endpoint to.
   * @param endpoint function that will take event: HTTPEvent as the first argument 
   *        and context: LambdaContext as the second argument. It is expected that 
   *        it will return Promise<HTTPResponse>
   * @param condition, that if provided, will test if this endpoint should even
   *        be invoked.
   * @param priority of this endpoint. A higher value indicates it should be
   *        executed ahead of other endpoints. Defaults to 0.
   * 
   */
  public static register(resource: string, action: string, endpoint: Function, condition?: EndpointCondition, priority?: number): void {
    SNSRouter.routes.push({
      resource: resource,
      action: action,
      endpoint: endpoint,
      condition: condition,
      priority: priority || 0
    });
  }

  /**
   * 
   * @param headers to set on every request.
   */
  public static setDefaultHeaders(headers: HTTPHeaders): void {
    HTTPResponse.setDefaultHeaders(headers);
  }

  /**
   * 
   * @param event to invoke the endpoint with.
   * @param context of the invocation.
   * @param callback to execute when completed.
   */
  public static handle(event: HTTPEvent, context: Context, callback: Callback<HTTPResponse>): void {
    const body: HTTPBody | undefined = event.body ? SNSRouter.serializer.deserializeBody(event.body) : undefined;
    console.log("SNSRouter.routes", { resource: event.resource, httpMethod: event.httpMethod });
    const routeOptions: Array<SNSRoute> = SNSRouter.routes
      .filter((route: SNSRoute) => route.resource === event.resource)
      .filter((route: SNSRoute) => route.action === event.httpMethod)
      .filter((route: SNSRoute) => {
        console.log("check condition", route);
        if (route.condition) {
          return route.condition(body, event);
        }
        return route;
      })
      .sort((first: SNSRoute, second: SNSRoute) => second.priority - first.priority);

    if (!routeOptions || routeOptions.length === 0) {
      return callback(
        null,
        HTTPResponse
          .setBody({ message: 'Action is not implemented at this path.' })
          .setStatusCode(501)
          .addHeader('X-REQUEST-ID', event.requestContext.requestId)
      );
    }

    let promiseChain = Promise.resolve<HTTPResponse | undefined>(undefined);

    for (let route of routeOptions) {
      promiseChain = promiseChain.then((response: HTTPResponse | undefined) => {
        if (response) return response;
        return route.endpoint(event, context)
      })
    }


    promiseChain
      .then((response: HTTPResponse | undefined) => callback(null, response))
      .catch((error: any) => callback(error))

  }
}