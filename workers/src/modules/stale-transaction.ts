import MessageBroker from 'infrastructure/lib/broker/MessageBroker';
import { IWorkerModule, WorkerModuleOptions } from '../../../../infrastructure/lib/runner/worker';
import { staleTransactionsHandler } from '../messageHandlers';

const StaleTransaction: IWorkerModule = {
  listen: (callback: Function, options: WorkerModuleOptions | undefined) => {
    if (!options?.queueName) {
      throw new Error('Queue name is required');
    }
    const staleTransactionsBroker = new MessageBroker(options.queueName, staleTransactionsHandler);
    staleTransactionsBroker.consume();
    callback();
  },
};

export default StaleTransaction;
