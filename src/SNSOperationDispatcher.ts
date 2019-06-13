import { SNS } from './SNS';
import { Configurations } from './external-interfaces/Configurations';

enum Operation {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete'
}

class SNSOperationDispatcher {

    private configurations: Configurations;

    constructor(configurations: Configurations) {
        this.configurations = configurations;
    }

    async dispatch(operation: Operation, payload: object) {
        const topicARN = await this.configurations.getAsString('OPERATION_BROADCAST_TOPIC');
        const service = await this.configurations.getAsString('SERVICE');
        if (!topicARN) {
            console.error('Misconfigured ARN for this stage: OPERATION_BROADCAST_TOPIC');
        } else if (!service) {
            console.error('Misconfigured service name for this project.');
        } else {
            return SNS.publish(topicARN, JSON.stringify(Object.assign(payload, {operation: operation})), `${service} ${operation}`);
        }
    }

}

export { SNSOperationDispatcher, Operation };