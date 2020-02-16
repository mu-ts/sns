import { expect } from 'chai';
import 'mocha';
import { ListenerRegistry } from '../../src/services/ListenerRegistry';
import { SNSMessage } from 'aws-lambda';

describe('SNSRouter', () => {
  it('should ', () => {
    expect(() =>
      ListenerRegistry.recall(({
        TopicArn: 'arn:aws:sns:special-topic',
        MessageAttributes: { status: { Type: 'String', Value: 'xyz' } },
      } as any) as SNSMessage)
    ).to.not.throw(Error);
  });
});
