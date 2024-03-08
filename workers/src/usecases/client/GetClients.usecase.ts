import { ClientResult } from 'domain/src/client/client.contract';
import Client from 'domain/src/client/client.model';
import IContactHolderAdapter from 'domain/src/contact_holder/contactHolder.adapter';
import { MetaObject, Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

interface GetClientsUseCaseRequest {
  pagination: {
    size: number;
    page: number;
  };
  locale: string;
  tenantId: number;
}

export class GetClientsUseCase
  implements IUseCase<GetClientsUseCaseRequest, Result<{ data: Client[] | never[]; meta?: MetaObject }, ClientResult>>
{
  constructor(private adapter: IContactHolderAdapter) {}

  async handle(
    request?: GetClientsUseCaseRequest,
  ): Promise<Result<{ data: Client[]; meta?: MetaObject }, ClientResult>> {
    if (!request) return Result.error(ClientResult.UNHANDLED_ERROR);

    const clientsResponse = await this.adapter.getContactHolders({
      ...request,
      sort: ['name:asc'],
      status: 'active',
    });

    return Result.ok(clientsResponse.Value);
  }
}
