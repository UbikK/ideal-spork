import IInvoiceCompanyAdapter from 'domain/src/invoice_company/invoiceCompany.adapter';
import { InvoiceCompanyResult } from 'domain/src/invoice_company/invoiceCompany.contract';
import InvoiceCompany from 'domain/src/invoice_company/invoiceCompany.model';
import { Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

type CreateInvoiceCompanyUseCaseRequest = {
  id: number;
  name: string;
  currency: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
};

export default class CreateInvoiceCompanyUseCase
  implements IUseCase<CreateInvoiceCompanyUseCaseRequest, Result<InvoiceCompany, InvoiceCompanyResult>>
{
  constructor(private invoiceCompanyAdapter: IInvoiceCompanyAdapter) {}
  handle: (request?: any) => Promise<Result<InvoiceCompany, InvoiceCompanyResult>> = async (request) => {
    const result = await this.invoiceCompanyAdapter.createInvoiceCompany(request);
    return Result.ok(result.Value);
  };
}
