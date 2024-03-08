import { IBankAccountAdapter } from 'domain/src/bank_account/bankAccount.adapter';
import IClientEstablishmentAdapter from 'domain/src/client_establishment/client_establishment.adapter';
import { AbstractEnum, Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';
import IMessageBroker from 'infrastructure/lib/broker/MessageBroker.interface';

type MarkToSynchronizeRequest = {};

export default class MarkToSynchronizeUseCase
  implements IUseCase<MarkToSynchronizeRequest, Result<boolean, AbstractEnum>>
{
  constructor(
    private staleBroker: IMessageBroker,
    private updateBroker: IMessageBroker,
    private clientEstablishmentAdapter: IClientEstablishmentAdapter,
    private establishmentAdapter: IBankAccountAdapter,
  ) {}

  async handle(request?: MarkToSynchronizeRequest | undefined): Promise<Result<boolean, AbstractEnum>> {
    if (!request) return new Result({ result: AbstractEnum.ERROR, message: 'Request is required' });

    const establishments = await this.clientEstablishmentAdapter.getAll();
    console.debug('🚀 ~ file: markToSynchronize.usecase.ts:23 ~ handle ~ establishments:', establishments.Value);

    const accounts = establishments.Value.map((ce) => {
      return ce.client_accounts.map((acc) => acc.openBankingId);
    }).flat();
    console.debug('🚀 ~ file: markToSynchronize.usecase.ts:27 ~ accounts ~ accounts:', accounts);

    const goodAccounts = (
      await Promise.all(
        accounts.map(async (accId) => {
          const isOk = await this.establishmentAdapter.isAccountOk(accId!);

          if (isOk) return accId;
        }),
      )
    ).filter((id) => !!id);
    console.debug('🚀 ~ file: markToSynchronize.usecase.ts:39 ~ handle ~ goodAccounts:', goodAccounts);

    const badAccounts = accounts.filter((id) => !goodAccounts.includes(id));

    const validClientEstablishments = establishments.Value.filter((ce) => {
      return ce.client_accounts.every((acc) => {
        return goodAccounts.includes(acc.openBankingId);
      });
    });

    if (badAccounts.length) {
      const concernedClientEstablishments = establishments.Value.filter(
        (ce) => !validClientEstablishments.find((e) => e.id === ce.id),
      );
      await this.staleBroker.notify(concernedClientEstablishments.map((ce) => ce.id));
    }

    const payload: { accounts: { slug: string; id: number }[]; metadata: any; clientId: number }[] =
      validClientEstablishments.map((cfg) => {
        return {
          accounts: cfg.client_accounts.map((acc) => {
            return { slug: acc.slug, id: acc.id };
          }),
          metadata: cfg.open_banking_configuration.metadata,
          clientId: cfg.tenant.id!,
        };
      });
    console.debug('🚀 ~ file: markToSynchronize.usecase.ts:54 ~ handle ~ payload:', payload);
    await Promise.all(
      payload.map((msg) => {
        return this.updateBroker.notify(msg);
      }),
    );

    return Result.ok(true);
  }
}
