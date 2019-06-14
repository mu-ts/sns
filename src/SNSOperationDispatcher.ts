import { SNS } from './SNS';
import { Configurations } from './external-interfaces/Configurations';

enum Operation {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete'
}

/**
 * Simplifies the common behavior of broadcasting entity changes from services, ex: CRUD behaviors via endpoints
 * and broadcasting to SNS for other services to monitor the the topics for changes as appropriate.
 *
 * @author Phil Lee
 */
class SNSOperationDispatcher {

    private configurations: Configurations;

    constructor(configurations: Configurations) {
        this.configurations = configurations;
    }

    /**
     * Default dispatch that will make determinations based on the service configuration and send out broadcasts to
     * the appropriate SNS topic with the operation and payload markers provided.
     *
     * @param operation the operation that was performed on the payload that is provided.
     * @param payload the payload from the operation that was performed.
     */
    async dispatch(operation: Operation, payload: object): Promise<object>;

    /**
     * Overloading of the default {#dispatch(Operation, object)} method, to provide the ability to specify a different
     * service name than the current actual project service name.
     *
     * This is useful for cases where there are, for example, 2 logical entities being managed under one logical service.
     * We can use multiple SNS topics to handle each appropriate entity.
     *
     * While the normal environment property for the base topic arn would be OPERATION_BROADCAST_TOPIC, the overrides
     * are expected to have a property of (serviceOverride)_OPERATION_BROADCAST_TOPIC.
     *
     * @param operation the operation that was performed on the payload that is provided.
     * @param payload the payload from the operation that was performed.
     * @param serviceOverride the service name override.
     */
    async dispatch(operation: Operation, payload: object, serviceOverride: string): Promise<object>;

    /**
     * Broadcasts CRUD operations to a configured SNS topic to be consumed by other services looking to monitor changes.
     *
     * @param operation the operation that was performed on the payload that is provided.
     * @param payload the payload from the operation that was performed.
     * @param serviceOverride the service name override.
     */
    async dispatch(operation: Operation, payload: object, serviceOverride?: string): Promise<object> {
        let service;
        let topicARN;

        if (!serviceOverride) {
            service = await this.configurations.getAsString('SERVICE');
        } else {
            service = serviceOverride;
        }

        if (!serviceOverride) {
            topicARN = await this.configurations.getAsString('OPERATION_BROADCAST_TOPIC');
        } else {
            topicARN = await this.configurations.getAsString(`${serviceOverride.toUpperCase()}_OPERATION_BROADCAST_TOPIC`);
        }

        let error;
        if (!topicARN) {
            error = 'Misconfigured ARN for this stage: OPERATION_BROADCAST_TOPIC';
            console.error(error);
        } else if (!service) {
            error = 'Misconfigured service name for this project.';
            console.error(error);
        } else {
            return SNS.publish(topicARN, JSON.stringify(Object.assign({}, payload, {operation: operation})), `${service} ${operation}`);
        }

        return Promise.resolve({error: error});
    }
}

export { SNSOperationDispatcher, Operation };