import { AccountingCodeRepository } from 'infrastructure/domain/accounting_code/accounting_code.repository';
import ClientRepository from 'infrastructure/domain/client/client.repository';
import InvoiceAdapter from 'infrastructure/domain/invoice/invoice.adapter';
import InvoiceRepository from 'infrastructure/domain/invoice/invoice.repository';
import InvoiceStatusAdapter from 'infrastructure/domain/invoiceStatus/invoiceStatus.adapter';
import InvoiceStatusRepository from 'infrastructure/domain/invoiceStatus/invoiceStatus.repository';
import ProductRepository from 'infrastructure/domain/product/product.repository';
import TenantRepository from 'infrastructure/domain/tenant/tenant.repository';
import { ICronjobModule } from 'infrastructure/lib/runner/cronjob';
import { UpdateInvoiceStatusUseCase } from '../usecases/invoice/updateStatusDueInvoices.usecase';

const MarkInvoicesDue: ICronjobModule = {
  async execute(callback) {
    const uc = new UpdateInvoiceStatusUseCase(
      new InvoiceAdapter(
        new TenantRepository(),
        new InvoiceRepository(),
        new ClientRepository(),
        new ProductRepository(),
        new AccountingCodeRepository(),
        new InvoiceStatusRepository(),
      ),
      new InvoiceStatusAdapter(new InvoiceStatusRepository()),
    );

    const res = await uc.handle({ fromStatus: 'sent', toStatus: 'due' });

    callback(res.IsError ? res.Message : null);
  },
};

export default MarkInvoicesDue;
