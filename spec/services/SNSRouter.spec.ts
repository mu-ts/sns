import { expect } from 'chai';
import 'mocha';
import { SNSRouter } from '../../src';
import { SNSMessage } from 'aws-lambda';

describe('SNSRouter', () => {
  it('should ', () => {
    expect(() =>
      SNSRouter.handle({
        Records: [
          {
            EventVersion: 'string',
            EventSubscriptionArn: 'string',
            EventSource: 'string',
            Sns: ({
              TopicArn: 'arn:aws:sns:special-topic',
              MessageAttributes: { status: { Type: 'String', Value: 'xyz' } },
            } as any) as SNSMessage,
          },
        ],
      })
    ).to.not.throw(Error);
  });
});
