import MessageBroker from 'infrastructure/lib/broker/MessageBroker';
import { IWorkerModule, WorkerModuleOptions } from '../../../../infrastructure/lib/runner/worker';
import { invoiceHandler } from '../messageHandlers';

const Invoice: IWorkerModule = {
  listen: (callback: Function, options: WorkerModuleOptions | undefined) => {
    if (!options?.queueName) {
      throw new Error('Queue name is required');
    }
    const invoiceWorker = new MessageBroker(options.queueName, invoiceHandler);
    invoiceWorker.consume();
    callback();
  },
};

export default Invoice;
