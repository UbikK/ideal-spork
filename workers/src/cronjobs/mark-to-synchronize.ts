import BankAccountAdapter from 'infrastructure/domain/bank_account/bankAccount.adapter';
import { BankAccountRepository } from 'infrastructure/domain/bank_account/bankAccount.repository';
import ClientRepository from 'infrastructure/domain/client/client.repository';
import ClientEstablishmentAdapter from 'infrastructure/domain/client_establishment/client_establishment.adapter';
import { ClientEstablishmentRepository } from 'infrastructure/domain/client_establishment/client_establishment.repository';
import { OpenBankingConfigurationRepository } from 'infrastructure/domain/openbanking_configuration/openbanking_configuration.repository';
import SupplierRepository from 'infrastructure/domain/supplier/supplier.repository';
import TenantRepository from 'infrastructure/domain/tenant/tenant.repository';
import { TransactionRepository } from 'infrastructure/domain/transaction/transaction.repository';
import TransactionStatusRepository from 'infrastructure/domain/transactionStatus/transactionStatus.repository';
import MessageBroker from 'infrastructure/lib/broker/MessageBroker';
import { ICronjobModule } from 'infrastructure/lib/runner/cronjob';
import MarkToSynchronizeUseCase from '../usecases/markToSynchronize.usecase';

type MarkToSynchronizeRequest = {
  staleConnectionQueue: string;
  updateTransactionsQueue: string;
};

const MarkToSynchronize: ICronjobModule = {
  async execute(callback, options) {
    if (!options.staleConnectionQueue) {
      throw new Error('Stale connection queue name is required');
    }

    if (!options.updateTransactionsQueue) {
      throw new Error('Update transactions queue name is required');
    }

    const uc = new MarkToSynchronizeUseCase(
      new MessageBroker(options.staleConnectionQueue),
      new MessageBroker(options.updateTransactionsQueue),
      new ClientEstablishmentAdapter(new ClientEstablishmentRepository()),
      new BankAccountAdapter(
        new BankAccountRepository(),
        new TransactionRepository(),
        new TenantRepository(),
        new OpenBankingConfigurationRepository(),
        new ClientEstablishmentRepository(),
        new TransactionStatusRepository(),
        new ClientRepository(),
        new SupplierRepository(),
      ),
    );

    const res = await uc.handle({});
    callback(res.IsError ? res.Message : null);
  },
};

export default MarkToSynchronize;
