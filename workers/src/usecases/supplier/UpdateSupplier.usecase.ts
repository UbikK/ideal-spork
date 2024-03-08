import ISupplierAdapter from 'domain/src/supplier/supplier.adapter';
import { SupplierResult } from 'domain/src/supplier/supplier.contract';
import Supplier from 'domain/src/supplier/supplier.model';
import { CreateContactHolderRequest } from 'domain/src/contact_holder/contactHolder.adapter';
import { Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

// export type UpdateSupplierUseCaseRequest = {
//   id: string;
//   name?: string;
//   email?: string;
//   phone_number?: string;
//   website?: string;
//   billing_street?: string;
//   billing_city?: string;
//   billing_zipcode?: string;
//   billing_country?: string;
//   shipping_street?: string;
//   shipping_city?: string;
//   shipping_zipcode?: string;
//   shipping_country?: string;
//   currency?: string;
//   memo?: string;
//   contacts?: [
//     {
//       firstname: string;
//       lastname: string;
//       job_title: string;
//       email?: string;
//       phone_number?: string;
//       memo?: string;
//     },
//   ];
// };

export default class UpdateNinjaSupplierUseCase
  implements IUseCase<CreateContactHolderRequest, Result<Supplier, SupplierResult>>
{
  constructor(private supplierAdapter: ISupplierAdapter) {}

  async handle(request?: CreateContactHolderRequest | undefined): Promise<Result<Supplier, SupplierResult>> {
    if (!request) {
      return Result.error(SupplierResult.UNHANDLED_ERROR);
    }

    const savedSupplier = await this.supplierAdapter.updateSupplier(request);

    return Result.ok(savedSupplier.Value);
  }
}
