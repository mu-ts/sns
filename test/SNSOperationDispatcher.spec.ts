import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { MockPropertyDescriptor } from './mocks/MockPropertyDescriptor';
import { Operation, SNSOperationDispatcher } from '../src/SNSOperationDispatcher';
import { Configurations } from '../src/external-interfaces/Configurations';
import { SNS } from '../src/SNS';
// import * as sinon from 'sinon';


chai.use(chaiAsPromised);
chai.should();

describe('SNSOperationDispatcher', async () => {

    let configurations: Configurations;
    let sandbox: sinon.SinonSandbox;
    let snsOperationDispatcher: SNSOperationDispatcher;


    beforeEach(() => {
        sandbox = sinon.createSandbox();

        snsOperationDispatcher = new SNSOperationDispatcher(configurations);

        // const SNSSpy: SNS = SNS;
        //
        // sandbox.stub(snsOperationDispatcher as any, 'SNS').value(SNSSpy);
        // sandbox.stub(SNSSpy, 'dispatch').value((value) => {
        //     return value;
        // });
    });

    afterEach(() => {
        sandbox.restore();
    });


    before(() => {
        configurations = {
            get(name: string, someDefault?: any): Promise<any | undefined> {
                return undefined;
            }, getAsBoolean(name: string, someDefault?: boolean): Promise<boolean> {
                return undefined;
            }, getAsNumber(name: string, someDefault?: number): Promise<number | undefined> {
                return undefined;
            }, getAsString(name: string, someDefault?: string): Promise<string | undefined> {
                if (name === 'OPERATION_BROADCAST_TOPIC') {
                    return Promise.resolve('arn:aws:sns:us-west-2:169885705922:dev_us-west-2_messages-message');
                } else if (name === 'SERVICE') {
                    return Promise.resolve('messages');
                } else {
                    return undefined;
                }

            }

        };
    });

    it('should be able to get the property for the topic ARN from configuration', async () => {
        snsOperationDispatcher.dispatch(Operation.CREATE, {});
    });
});