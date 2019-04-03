import { SNSEvent } from 'aws-lambda';

/**
 * Function interface for the logic that will check if a route
 * should be executed or not.
 */
export interface SNSEventCondition {
  (event: SNSEvent): boolean;
}
