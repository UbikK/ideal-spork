import { IWorkerModule, WorkerModuleOptions } from '../../../../infrastructure/lib/runner/worker';
import MessageBroker from 'infrastructure/lib/broker/MessageBroker';
import { updateTransactionsHandler } from '../messageHandlers';

const UpdateTransaction: IWorkerModule = {
  listen: (callback: Function, options: WorkerModuleOptions | undefined) => {
    if (!options?.queueName) {
      throw new Error('Queue name is required');
    }
    const updateTransactionsBroker = new MessageBroker(options.queueName, updateTransactionsHandler);
    updateTransactionsBroker.consume();
    callback();
  }
}

export default UpdateTransaction;