import ITenantAdapter from 'domain/src/Tenant/tenant.adapter';
import { Result } from 'domain/src/result';
import { ITransactionAdapter } from 'domain/src/transaction/transaction.adapter';
import { TransactionResult } from 'domain/src/transaction/transaction.contracts';
import { Transaction } from 'domain/src/transaction/transaction.model';
import { IUseCase } from 'infrastructure/lib/IUseCase';
export interface PollTransactionsUseCaseRequest {
  configs: { accounts: { slug: string; id: string }[]; metadata: any; clientId: number };
}

export default class PollTransactionsUseCase
  implements IUseCase<PollTransactionsUseCaseRequest, Result<Transaction[], TransactionResult>>
{
  constructor(private transactionAdapter: ITransactionAdapter, private tenantAdapter: ITenantAdapter) {}
  handle: (request?: PollTransactionsUseCaseRequest) => Promise<Result<Transaction[], TransactionResult>> = async (
    request,
  ) => {
    if (!request?.configs) {
      return Result.error(TransactionResult.MISSING_PARAMETER);
    }

    const transactions = await Promise.all(
      request.configs.accounts.map(async (acc) => {
        return this.transactionAdapter.pollTransactions(acc);
      }),
    );

    const all = transactions.map((result) => result.Value).flat();

    this.tenantAdapter.updateLastUpdateTime(request.configs.clientId);
    return Result.ok(all);
  };
}
