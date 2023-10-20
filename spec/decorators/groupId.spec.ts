import { expect } from 'chai';
import { describe, it } from 'mocha';

import { groupId, KEY } from '../../src/decorators/groupId';
import { TopicService } from '../../src/sugar/guts/TopicService';
import { topic } from '../../src/decorators/topic';

describe('@groupId', () => {
  it('to decorate field', () => {
    
    @topic('arn:to:topic')
    class User {
      @groupId
      public fieldName: string = 'field-1'
    }

    expect(User[TopicService.PREFIX]).to.have.property(KEY).that.equals('fieldName');
  })
})

