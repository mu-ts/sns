import { expect } from 'chai';
import 'mocha';
import { listener } from '../../src';
import { MockPropertyDescriptor } from '../mocks/MockPropertyDescriptor';

describe('listener', () => {
  it('should execute ok.', () => {
    const listenersFactory = listener('my-topic', { status: 'updated' });
    // target: any, propertyKey: string, descriptor: PropertyDescriptor
    const target: any = { myFunction: () => 'anyone' };
    const descriptor: PropertyDescriptor = listenersFactory(
      target,
      'myFunction',
      new MockPropertyDescriptor().setValue('result')
    );

    expect(descriptor.value()).to.equal('anyone');
  });
});
