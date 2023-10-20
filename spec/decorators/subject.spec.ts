import { expect } from 'chai';
import { describe, it } from 'mocha';

import { subject, KEY } from '../../src/decorators/subject';
import { TopicService } from '../../src/sugar/guts/TopicService';
import { topic } from '../../src/decorators/topic';

describe('@subject', () => {
  it('to decorate field', () => {
    
    @topic('arn:to:topic')
    class User {
      @subject
      public fieldName: string = 'field-1'
    }

    expect(User[TopicService.PREFIX]).to.have.property(KEY).that.equals('fieldName');
  })
})

