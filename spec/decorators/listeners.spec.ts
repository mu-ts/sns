import { expect } from 'chai';
import 'mocha';
import { listeners } from '../../src';

describe('listeners', () => {
  it('should add property to class', () => {
    const listenersFactory = listeners('arn:sns:test');
    class X {}
    listenersFactory(X);

    expect(X.constructor.prototype.snsTopicPrefix).to.equal('arn:sns:test');
  });
});
