import IClientEstablishmentAdapter from 'domain/src/client_establishment/client_establishment.adapter';
import IOpenBankingConfiguraitonAdapter from 'domain/src/openbanking_configuration/openbanking_configuration.adapter';

import { ClientEstablishmentResult } from 'domain/src/client_establishment/client_establishment.contract';
import ClientEstablishment from 'domain/src/client_establishment/client_establishment.model';
import OpenBankingConfiguration from 'domain/src/openbanking_configuration/openbanking_configuration.model';
import { Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

export interface ManageStaleConnectionsUseCaseRequest {
  staleConnections: string[];
}

export default class ManageStaleConnectionsUseCase
  implements IUseCase<ManageStaleConnectionsUseCaseRequest, Result<ClientEstablishment[], ClientEstablishmentResult>>
{
  constructor(
    private clientEstablishmentAdapter: IClientEstablishmentAdapter,
    private configAdapter: IOpenBankingConfiguraitonAdapter,
  ) {}

  handle: (
    request?: ManageStaleConnectionsUseCaseRequest | undefined,
  ) => Promise<Result<ClientEstablishment[], ClientEstablishmentResult>> = async (request) => {
    if (!request) return Result.error(ClientEstablishmentResult.UNHANDLED_ERROR);

    const clients = await this.clientEstablishmentAdapter.getByIds(request.staleConnections.map((c) => Number(c)));

    const clientsToUpdate = clients.Value.filter((ce) => !ce.updateNeeded);
    const configs: OpenBankingConfiguration[] = clientsToUpdate.map((ce) => ce.open_banking_configuration);

    const updated = await this.configAdapter.renew(configs.map((c) => c.id!.toString()));

    if (updated.IsOk) {
      const updatedClients = await this.clientEstablishmentAdapter.setUpdateNeeded(clientsToUpdate.map((ce) => ce.id));
      return Result.ok(updatedClients.Value);
    }

    return Result.error(ClientEstablishmentResult.UNHANDLED_ERROR);
  };
}
