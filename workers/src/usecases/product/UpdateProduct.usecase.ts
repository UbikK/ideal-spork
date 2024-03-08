import IProductAdapter from 'domain/src/product/product.adapter';
import { ProductResult } from 'domain/src/product/product.contract';
import Product from 'domain/src/product/product.model';
import { Result } from 'domain/src/result';
import { IUseCase } from 'infrastructure/lib/IUseCase';

export type UpdateProductUseCaseRequest = {
  id: string;
  name: string;
  reference: string;
  quantity?: number;
  description?: string;
  price?: number;
  vat?: number;
  discount?: number;
};

export default class UpdateNinjaProductUseCase
  implements IUseCase<UpdateProductUseCaseRequest, Result<Product, ProductResult>>
{
  constructor(private productAdapter: IProductAdapter) {}

  async handle(request?: UpdateProductUseCaseRequest | undefined): Promise<Result<Product, ProductResult>> {
    if (!request) {
      return Result.error(ProductResult.UNHANDLED_ERROR);
    }

    const savedProduct = await this.productAdapter.updateProduct(request);

    return Result.ok(savedProduct.Value);
  }
}
