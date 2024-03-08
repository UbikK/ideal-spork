import INinjaInvoiceAdapter from 'domain/src/invoice/invoice.ninja.adapter';
import { InvoiceResult } from 'domain/src/invoice/invoice.contract';
import Invoice from 'domain/src/invoice/invoice.model';
import { Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

export type CreateNinjaInvoiceUseCaseRequest = {
  tenantId: number;
  client: {
    id: number;
  };
  invoiceProducts: [];
  memo: string;
  number: number;
  creationDate: Date;
  dueDate: Date;
};

export default class CreateNinjaInvoiceUseCase
  implements IUseCase<CreateNinjaInvoiceUseCaseRequest, Result<Invoice, InvoiceResult>>
{
  constructor(private invoiceAdapter: INinjaInvoiceAdapter) {}

  async handle(request?: CreateNinjaInvoiceUseCaseRequest | undefined): Promise<Result<Invoice, InvoiceResult>> {
    if (!request) {
      return Result.error(InvoiceResult.UNHANDLED_ERROR);
    }

    const savedInvoice = await this.invoiceAdapter.createInvoice(request);

    return Result.ok(savedInvoice.Value);
  }
}
