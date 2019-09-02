import { SNSEvent, SNSEventRecord } from 'aws-lambda';

class MockSNSEvent implements SNSEvent {
    Records: SNSEventRecord[] = [];
}

export { MockSNSEvent };