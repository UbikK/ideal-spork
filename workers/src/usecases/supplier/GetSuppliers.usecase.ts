import { SupplierResult } from 'domain/src/supplier/supplier.contract';
import Supplier from 'domain/src/supplier/supplier.model';
import IContactHolderAdapter from 'domain/src/contact_holder/contactHolder.adapter';
import { MetaObject, Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

interface GetSuppliersUseCaseRequest {
  pagination: {
    size: number;
    page: number;
  };
  locale: string;
  tenantId: number;
}

export class GetSuppliersUseCase
  implements
    IUseCase<GetSuppliersUseCaseRequest, Result<{ data: Supplier[] | never[]; meta?: MetaObject }, SupplierResult>>
{
  constructor(private adapter: IContactHolderAdapter) {}

  async handle(
    request?: GetSuppliersUseCaseRequest,
  ): Promise<Result<{ data: Supplier[]; meta?: MetaObject }, SupplierResult>> {
    if (!request) return Result.error(SupplierResult.UNHANDLED_ERROR);

    const suppliersResponse = await this.adapter.getContactHolders({
      ...request,
      sort: ['name:asc'],
      status: 'active',
    });

    return Result.ok(suppliersResponse.Value);
  }
}
