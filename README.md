# Summary

Aids in routing messages from different SNS topics through the same endpoint, easier, cleaner and clearer.

# Router Usage

For listeners, all functions that match the configurations defined, will execute. So be sure to properly define prefix, postfix and attribute restrictions.

```
import { listeners, listener } from '@mu-ts/sns';
import { SNSMessage } from 'aws-lambda';

/**
 * Only the messages where the ARN matches the restrictions defined on the @listener
 * will pass through to the @listener defined functions below.
 */
@listeners(`*-*-topic-startswith-`) // Optional
public class MyEventListener {
  constructor(){
  }

  /**
   * This method will be executed with a SNSMessage where the ARN matches the postfix, and the 
   * attributes match the pairs provided. The value will be interpreted literally, and require
   * a match to the attribute type. We recommend you stick with strings or string arrays. In the
   * case of array values provided, only one needs to match to pass through. If the value on the 
   * message attribute is an array, then all values must match.
   */
  @listener('topic-endswith', {topic:'payment'}, {operation:'update'})
  public listen(message:SNSMessage):Promise<void> {

  }
}
```

For any of the logic above to work, you will need to have an `SNSRouter` configured as the entry point for all of the topics needing to be routed into the `@listeners`.

```

import { SNSRouter } from '@mu-ts/sns';
import { SNSEvent } from 'aws-lambda';

export const rest = (event: SNSEvent) => SNSRouter.handle(event);

```

# SNS Usage

To create messages for other topics to consume, you can use the SNS utility.

```
SNS.publish('arn:to:topic', payload, 'some subject', {status:'updated'}, 'us-east-1');
```

Its also possible to define na instance of SNS if your configurations are a bit morestatic.

```
const sns:SNS = new SNS('arn:to:topic','us-east-1');
sns.publish(payload,'some subject', {status:'updated'});
```