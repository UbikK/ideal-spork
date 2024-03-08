import ClientEstablishmentAdapter from 'infrastructure/domain/client_establishment/client_establishment.adapter';
import { ClientEstablishmentRepository } from 'infrastructure/domain/client_establishment/client_establishment.repository';
import OpenBankingConfigurationAdapter from 'infrastructure/domain/openbanking_configuration/openbanking_configuration.adapter';
import { OpenBankingConfigurationRepository } from 'infrastructure/domain/openbanking_configuration/openbanking_configuration.repository';
import ManageStaleConnectionsUseCase from './usecases/manageStaleConnections.usecase';

export const manageStaleConnections = async (payload: string[]) => {
  const uc = new ManageStaleConnectionsUseCase(
    new ClientEstablishmentAdapter(new ClientEstablishmentRepository()),
    new OpenBankingConfigurationAdapter(new OpenBankingConfigurationRepository()),
  );

  await uc.handle({ staleConnections: payload });
};
