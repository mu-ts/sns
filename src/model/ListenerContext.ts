import { Listener } from './Listener';
import { SNSMessage } from 'aws-lambda';

export interface ListenerContext {
  listener: Listener;
  message: SNSMessage;
}
