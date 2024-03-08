import IProductAdapter from 'domain/src/product/product.adapter';
import { ProductResult } from 'domain/src/product/product.contract';
import Product from 'domain/src/product/product.model';
import { Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

export type CreateProductUseCaseRequest = {
  name: string;
  reference: string;
  quantity?: number;
  description?: string;
  categoryCode: string;
  price?: number;
  vat?: number;
  discount?: number;
};

export default class CreateProductUseCase
  implements IUseCase<CreateProductUseCaseRequest, Result<Product, ProductResult>>
{
  constructor(private productAdapter: IProductAdapter) {}

  async handle(request?: CreateProductUseCaseRequest | undefined): Promise<Result<Product, ProductResult>> {
    if (!request) {
      return Result.error(ProductResult.UNHANDLED_ERROR);
    }

    const savedProduct = await this.productAdapter.saveProduct(request);

    return Result.ok(savedProduct.Value);
  }
}
