import MessageBroker from 'infrastructure/lib/broker/MessageBroker';
import { IWorkerModule, WorkerModuleOptions } from '../../../../infrastructure/lib/runner/worker';
import { invoiceCompanyCreationHandler } from '../messageHandlers';

const CreateInvoiceCompany: IWorkerModule = {
  listen: (callback: Function, options: WorkerModuleOptions | undefined) => {
    if (!options?.queueName) {
      throw new Error('Queue name is required');
    }
    const createInvoiceCompanyWorker = new MessageBroker(options.queueName, invoiceCompanyCreationHandler);
    createInvoiceCompanyWorker.consume();
    callback();
  },
};

export default CreateInvoiceCompany;
