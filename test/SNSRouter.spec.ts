import { expect } from 'chai';
import 'mocha';
import { SNSRouter } from '../src';
import { MockPropertyDescriptor } from './mocks/MockPropertyDescriptor';

describe('SNSRouter', () => {

    it('should ', () => {


        SNSRouter.register((event:any, context:any) => Promise.resolve('test'));
    });

});
