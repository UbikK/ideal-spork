import { InvoiceResult } from 'domain/src/invoice/invoice.contract';
import Invoice from 'domain/src/invoice/invoice.model';
import INinjaInvoiceAdapter from 'domain/src/invoice/invoice.ninja.adapter';
import { Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

export type UpdateNinjaInvoiceUseCaseRequest = Partial<Invoice> & {
  action: string;
};

export default class UpdateNinjaInvoiceUseCase
  implements IUseCase<UpdateNinjaInvoiceUseCaseRequest, Result<Invoice, InvoiceResult>>
{
  constructor(private invoiceAdapter: INinjaInvoiceAdapter) {}

  async handle(request?: UpdateNinjaInvoiceUseCaseRequest | undefined): Promise<Result<Invoice, InvoiceResult>> {
    if (!request) {
      return Result.error(InvoiceResult.UNHANDLED_ERROR);
    }
    const savedInvoice = await this.invoiceAdapter.updateInvoice(request.id as number, request);

    return Result.ok(savedInvoice.Value);
  }
}
