import { expect } from 'chai';
import { describe, it } from 'mocha';

import { deduplicationId, KEY } from '../../src/decorators/deduplicationId';
import { TopicService } from '../../src/sugar/guts/TopicService';
import { topic } from '../../src/decorators/topic';

describe('@deduplicationId', () => {
  it('to decorate field', () => {
    
    @topic('arn:to:topic')
    class User {
      @deduplicationId
      public fieldName: string = 'field-1'
    }

    expect(User[TopicService.PREFIX]).to.have.property(KEY).that.equals('fieldName');
  })
})

