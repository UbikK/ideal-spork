import ISupplierAdapter from 'domain/src/supplier/supplier.adapter';
import { SupplierResult } from 'domain/src/supplier/supplier.contract';
import Supplier from 'domain/src/supplier/supplier.model';
import { CreateContactHolderRequest } from 'domain/src/contact_holder/contactHolder.adapter';
import { Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

export default class CreateNinjaSupplierUseCase
  implements IUseCase<CreateContactHolderRequest, Result<Supplier, SupplierResult>>
{
  constructor(private supplierAdapter: ISupplierAdapter) {}

  async handle(request?: CreateContactHolderRequest | undefined): Promise<Result<Supplier, SupplierResult>> {
    if (!request) {
      return Result.error(SupplierResult.UNHANDLED_ERROR);
    }

    const savedSupplier = await this.supplierAdapter.saveSupplier(request);

    return Result.ok(savedSupplier.Value);
  }
}
