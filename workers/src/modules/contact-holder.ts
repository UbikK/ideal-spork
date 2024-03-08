import MessageBroker from 'infrastructure/lib/broker/MessageBroker';
import { IWorkerModule, WorkerModuleOptions } from '../../../../infrastructure/lib/runner/worker';
import { invoiceContactHolderHandler } from '../messageHandlers';

const ContactHolder: IWorkerModule = {
  listen: (callback: Function, options: WorkerModuleOptions | undefined) => {
    if (!options?.queueName) {
      throw new Error('Queue name is required');
    }
    const contactHolderWorker = new MessageBroker(options.queueName, invoiceContactHolderHandler);
    contactHolderWorker.consume();
    callback();
  },
};

export default ContactHolder;
