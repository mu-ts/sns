# Summary

Easier AWS SNS interactions for both receipt and braodcasting of messages.

# Publishing

There are static/global functions and configurations as well as instance level ones.

Static

```
import { SNS } from '@mu-ts/sns';

const somePayload: any = {
  bunch: 'of stuff',
  in: 'here'
}

SNS.setRegion('us-west-2');
SNS.setSerializer((payload:object) => payload.toString());
SNS.publish('topic:arn',somePayload,'Subject!',{tag:'to attach'});

```

Instance

```
import { SNS } from '@mu-ts/sns';

const sns: SNS = new SNS('topic:arn','us-west-2',(payload:object) => payload.toString());
const bunchOfPayloads: Array<any> = [
  {
    bunch: 'of stuff',
    in: 'here'
  },
  {
    bunch: 'of stuff again',
    in: 'here'
  },
]

bunchOfPayloads.forEach((payload:any) => sns.publish(payload,'Subject!',{tag:'to attach'}) )

```
