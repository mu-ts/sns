import { expect } from 'chai';
import { TopicService } from '../../../src/sugar/guts/TopicService'; // Update the import path
import { topic } from '../../../src/decorators/topic';
import { deduplicationId } from '../../../src/decorators/deduplicationId';
import { groupId } from '../../../src/decorators/groupId';
import { subject } from '../../../src/decorators/subject';

describe('TopicService', () => {

  describe('getTopic', () => {
    it('should return topic from constructor metadata', () => {
      class MockClass {
        constructor() {
          this.constructor[TopicService.PREFIX] = { topic: 'someTopic' };
        }
      }

      const instance = new MockClass();
      expect(TopicService.getTopic(instance)).to.equal('someTopic');
    });
  });

  describe('getGroupId', () => {
    it('should return GroupId from instance', () => {
      @topic('x')
      class MockClass {
        @groupId
        public groupField: string = 'someGroupId'
      }

      const instance = new MockClass();
      expect(TopicService.getGroupId(instance)).to.equal('someGroupId');
    });
  });

  describe('getDeduplicationId', () => {
    it('should return DeduplicationId from instance', () => {
      @topic('x')
      class MockClass {
        @deduplicationId
        public deduplicationField: string = 'someDeduplicationId'
      }

      const instance = new MockClass();
      expect(TopicService.getDeduplicationId(instance)).to.equal('someDeduplicationId');
    });
  });

  describe('getSubject', () => {
    it('should return Subject from instance', () => {
      @topic('x')
      class MockClass {
        @subject
        public subjectField: string = 'someSubject'
      }

      const instance = new MockClass();
      expect(TopicService.getSubject(instance)).to.equal('someSubject');
    });
  });

  // Add more test cases as needed
});
