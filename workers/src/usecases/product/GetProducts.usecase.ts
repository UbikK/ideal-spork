import IProductAdapter from 'domain/src/product/product.adapter';
import { ProductResult } from 'domain/src/product/product.contract';
import Product from 'domain/src/product/product.model';
import { MetaObject, Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

interface GetProductsUseCaseRequest {
  pagination: {
    size: number;
    page: number;
  };
  locale: string;
  tenantId: number;
}

export class GetProductsUseCase
  implements
    IUseCase<GetProductsUseCaseRequest, Result<{ data: Product[] | never[]; meta?: MetaObject }, ProductResult>>
{
  constructor(private adapter: IProductAdapter) {}

  async handle(
    request?: GetProductsUseCaseRequest,
  ): Promise<Result<{ data: Product[]; meta?: MetaObject }, ProductResult>> {
    if (!request) return Result.error(ProductResult.UNHANDLED_ERROR);

    const productsResponse = await this.adapter.getProducts(request);

    if (productsResponse.IsError) {
      return Result.error(ProductResult.UNHANDLED_ERROR);
    }

    return Result.ok(productsResponse.Value);
  }
}
