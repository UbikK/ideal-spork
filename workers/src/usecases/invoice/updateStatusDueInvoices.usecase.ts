import IInvoiceAdapter from 'domain/src/invoice/invoice.adapter';
import { InvoiceResult } from 'domain/src/invoice/invoice.contract';
import Invoice from 'domain/src/invoice/invoice.model';
import { Result } from 'domain/src/result';
import IInvoiceStatusAdapter from 'infrastructure/domain/invoiceStatus/invoiceStatus.adapter';
import { IUseCase } from 'infrastructure/lib/IUseCase';
import { format } from 'date-fns';



interface UpdateInvoiceStatusUseCaseRequest {
    fromStatus: string;
    toStatus:  string;
}

export class UpdateInvoiceStatusUseCase
  implements
    IUseCase<
    UpdateInvoiceStatusUseCaseRequest, 
        Result<{ data: Invoice[] | never[] }, InvoiceResult>
    >
{
  constructor(
    private adapter: IInvoiceAdapter,
    private InvoiceStatusAdapter: IInvoiceStatusAdapter,
) {}

  async handle(
    request?: UpdateInvoiceStatusUseCaseRequest,
  ): Promise<Result<{ data: Invoice[] }, InvoiceResult>> {
    if (!request) return Result.error(InvoiceResult.UNHANDLED_ERROR);

    const invoicesResponse = await this.adapter.getInvoices({
      fromStatus: request.fromStatus,
      due_date_lt: format(new Date(), 'yyyy-MM-dd')
    });

    if (invoicesResponse.IsError) {
      return Result.error(InvoiceResult.UNHANDLED_ERROR);
    }

    const toStatus = await this.InvoiceStatusAdapter!.getInvoiceStatusBySlug(request.toStatus);

    const invoicesStatusResponses = invoicesResponse.Value.data.map(invoice => {
        const invoiceId = invoice.id
        
        const newInvoice = new Invoice({
          number: invoice.number,
          status: toStatus.Value,
          slug: invoice.slug,
        })

        return this.adapter.updateInvoice(invoiceId, newInvoice);
    })

    return Result.ok(invoicesResponse.Value);
  }
}

