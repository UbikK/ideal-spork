import MessageBroker from 'infrastructure/lib/broker/MessageBroker';
import { IWorkerModule, WorkerModuleOptions } from '../../../../infrastructure/lib/runner/worker';
import { invoiceProductHandler } from '../messageHandlers';

const Product: IWorkerModule = {
  listen: (callback: Function, options: WorkerModuleOptions | undefined) => {
    if (!options?.queueName) {
      throw new Error('Queue name is required');
    }
    const productWorker = new MessageBroker(options.queueName, invoiceProductHandler);
    productWorker.consume();
    callback();
  },
};

export default Product;
