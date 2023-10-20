import { expect } from 'chai';
import { describe, it } from 'mocha';

import { topic } from '../../src/decorators/topic';
import { TopicService } from '../../src/sugar/guts/TopicService';

describe('@topic', () => {
  it('to decorate class', () => {
    
    @topic('arn:to:topic')
    class User {}

    expect(User[TopicService.PREFIX]).to.have.property('topic').that.equals('arn:to:topic');
  })
})

