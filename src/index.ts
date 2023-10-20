/**
 * Short hand function for publishing a message onto a topic.
 */
export { publish } from './sugar/publish';

/**
 * Instance 
 */
export { SNS } from './sugar/guts/SNS';
export { SNSClientWrapper } from './sugar/guts/Client';

export { MessageReceipt } from './model/MessageReceipt';
export { PublishOptions } from './model/PublishOptions';
