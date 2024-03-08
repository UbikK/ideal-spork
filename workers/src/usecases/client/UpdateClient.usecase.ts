import IClientAdapter from 'domain/src/client/client.adapter';
import { ClientResult } from 'domain/src/client/client.contract';
import Client from 'domain/src/client/client.model';
import { CreateContactHolderRequest } from 'domain/src/contact_holder/contactHolder.adapter';
import { Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

// export type UpdateClientUseCaseRequest = {
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

export default class UpdateNinjaClientUseCase
  implements IUseCase<CreateContactHolderRequest, Result<Client, ClientResult>>
{
  constructor(private clientAdapter: IClientAdapter) {}

  async handle(request?: CreateContactHolderRequest | undefined): Promise<Result<Client, ClientResult>> {
    if (!request) {
      return Result.error(ClientResult.UNHANDLED_ERROR);
    }

    const savedClient = await this.clientAdapter.updateClient(request);

    return Result.ok(savedClient.Value);
  }
}
