import { ConsumeMessage } from 'amqplib';
import { BankAccountRepository } from 'infrastructure/domain/bank_account/bankAccount.repository';
import ClientRepository from 'infrastructure/domain/client/client.repository';
import InvoiceRepository from 'infrastructure/domain/invoice/invoice.repository';
import ProductRepository from 'infrastructure/domain/product/product.repository';
import SupplierRepository from 'infrastructure/domain/supplier/supplier.repository';
import TenantAdapter from 'infrastructure/domain/tenant/tenant.adapter';
import TenantRepository from 'infrastructure/domain/tenant/tenant.repository';
import TransactionAdapter from 'infrastructure/domain/transaction/transaction.adapter';
import { TransactionRepository } from 'infrastructure/domain/transaction/transaction.repository';
import TransactionStatusRepository from 'infrastructure/domain/transactionStatus/transactionStatus.repository';
import NinjaClientAdapter from 'infrastructure/lib/invoiceNinja/client/client.adapter';
import NinjaClientRepository from 'infrastructure/lib/invoiceNinja/client/client.repository';
import NinjaInvoiceAdapter from 'infrastructure/lib/invoiceNinja/invoice/invoice.adapter';
import NinjaInvoiceRepository from 'infrastructure/lib/invoiceNinja/invoice/invoice.repository';
import InvoiceCompanyAdapter from 'infrastructure/lib/invoiceNinja/invoice_company/invoiceCompany.adapter';
import InvoiceCompanyRepository from 'infrastructure/lib/invoiceNinja/invoice_company/invoiceCompany.repository';
import NinjaProductAdapter from 'infrastructure/lib/invoiceNinja/product/product.adapter';
import NinjaProductRepository from 'infrastructure/lib/invoiceNinja/product/product.repository';
import NinjaSupplierAdapter from 'infrastructure/lib/invoiceNinja/supplier/supplier.adapter';
import NinjaSupplierRepository from 'infrastructure/lib/invoiceNinja/supplier/supplier.repository';
import { manageStaleConnections } from './manageStaleConnections';
import CreateNinjaClientUseCase from './usecases/client/CreateClient.usecase';
import UpdateNinjaClientUseCase from './usecases/client/UpdateClient.usecase';
import CreateInvoiceCompanyUseCase from './usecases/createInvoiceCompany.usecase';
import CreateNinjaInvoiceUseCase from './usecases/invoice/CreateInvoice.usecase';
import UpdateNinjaInvoiceUseCase from './usecases/invoice/UpdateInvoice.usecase';
import PollTransactionsUseCase from './usecases/pollTransactions.usecase';
import CreateNinjaProductUseCase from './usecases/product/CreateProduct.usecase';
import UpdateNinjaProductUseCase from './usecases/product/UpdateProduct.usecase';
import CreateNinjaSupplierUseCase from './usecases/supplier/CreateSupplier.usecase';
import UpdateNinjaSupplierUseCase from './usecases/supplier/UpdateSupplier.usecase';

export const updateTransactionsHandler = async (msg: ConsumeMessage | null) => {
  if (msg) {
    const data = JSON.parse(msg.content.toString('utf-8'));

    const uc = new PollTransactionsUseCase(
      new TransactionAdapter(
        new TransactionRepository(),
        new TransactionStatusRepository(),
        new BankAccountRepository(),
      ),
      new TenantAdapter(new TenantRepository()),
    );

    const updated = await uc.handle({ configs: data });
    console.debug('🚀 ~ file: messageHandlers.ts:48 ~ updateTransactionsHandler ~ updated:', updated);
  }
};

export const staleTransactionsHandler = (msg: ConsumeMessage | null) => {
  if (msg) {
    const data = JSON.parse(msg.content.toString());
    manageStaleConnections(data);
  }
};

export const invoiceCompanyCreationHandler = async (msg: ConsumeMessage | null) => {
  if (msg) {
    const data = JSON.parse(msg.content.toString());

    const creationUseCase = new CreateInvoiceCompanyUseCase(
      new InvoiceCompanyAdapter(new InvoiceCompanyRepository(process.env.MASTER_INVOICE_API_TOKEN!)),
    );

    const company = await creationUseCase.handle(data);

    const creationResponse = await fetch(
      `${process.env.CMS_API_URL}/api/keycloak-users-management/tenants/${data.id}`,
      {
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.CMS_TOKEN}`,
        },
        method: 'PUT',
        body: JSON.stringify({ data: { invoiceApiToken: company.Value.token } }),
      },
    );

    const result = await creationResponse.json();
  }
};

export const invoiceContactHolderHandler = async (msg: ConsumeMessage | null) => {
  if (msg) {
    const data = JSON.parse(msg.content.toString());

    switch (data.holderType) {
      case 'client':
        switch (data.action) {
          case 'create':
            const createUc = new CreateNinjaClientUseCase(
              new NinjaClientAdapter(new NinjaClientRepository(data.tenant.invoiceApiToken), new ClientRepository()),
            );
            const created = await createUc.handle(data);

            break;
          case 'update':
            const updateUc = new UpdateNinjaClientUseCase(
              new NinjaClientAdapter(new NinjaClientRepository(data.tenant.invoiceApiToken), new ClientRepository()),
            );
            const updated = await updateUc.handle(data);
            break;
        }
        break;
      case 'supplier':
        switch (data.action) {
          case 'create':
            const createUc = new CreateNinjaSupplierUseCase(
              new NinjaSupplierAdapter(
                new NinjaSupplierRepository(data.tenant.invoiceApiToken),
                new SupplierRepository(),
              ),
            );
            const created = await createUc.handle(data);

            break;
          case 'update':
            const updateUc = new UpdateNinjaSupplierUseCase(
              new NinjaSupplierAdapter(
                new NinjaSupplierRepository(data.tenant.invoiceApiToken),
                new SupplierRepository(),
              ),
            );
            const updated = await updateUc.handle(data);
            break;
        }
        break;
    }
  }
};

export const invoiceProductHandler = async (msg: ConsumeMessage | null) => {
  if (msg) {
    const data = JSON.parse(msg.content.toString());

    switch (data.action) {
      case 'create':
        const createUc = new CreateNinjaProductUseCase(
          new NinjaProductAdapter(new NinjaProductRepository(data.tenant.invoiceApiToken), new ProductRepository()),
        );
        const created = await createUc.handle(data);
        break;
      case 'update':
        const updateUc = new UpdateNinjaProductUseCase(
          new NinjaProductAdapter(new NinjaProductRepository(data.tenant.invoiceApiToken), new ProductRepository()),
        );
        const updated = await updateUc.handle(data);
        break;
    }
  }
};

export const invoiceHandler = async (msg: ConsumeMessage | null) => {
  if (msg) {
    const data = JSON.parse(msg.content.toString());

    switch (data.action) {
      case 'create': {
        const createUc = new CreateNinjaInvoiceUseCase(
          new NinjaInvoiceAdapter(new NinjaInvoiceRepository(data.tenant.invoiceApiToken), new InvoiceRepository()),
        );
        try {
          const created = await createUc.handle(data);
        } catch (e) {
          console.info('creation');
          console.error(e);
        }
        break;
      }
      case 'update': {
        const updateUc = new UpdateNinjaInvoiceUseCase(
          new NinjaInvoiceAdapter(new NinjaInvoiceRepository(data.tenant.invoiceApiToken), new InvoiceRepository()),
        );

        try {
          const updated = await updateUc.handle(data);
        } catch (e) {
          console.info('update');
          console.error(e);
        }
        break;
      }
    }
  }
};
