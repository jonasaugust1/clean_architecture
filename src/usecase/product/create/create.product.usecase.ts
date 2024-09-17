import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {
  InputCreateProductDto,
  OutputCreateProductDto,
} from "./create.product.dto";
import ProductFactory from "../../../domain/product/factory/product.factory";

export default class CreateProductUseCase {
  private ProductRepository: ProductRepositoryInterface;

  constructor(ProductRepository: ProductRepositoryInterface) {
    this.ProductRepository = ProductRepository;
  }

  async execute(
    input: InputCreateProductDto
  ): Promise<OutputCreateProductDto> {
    const product = ProductFactory.create(
      input.name,
      input.type,
      input.price
    );

    await this.ProductRepository.create(product);

    return {
      id: product.id,
      name: product.name,
      price: product.price
    };
  }
}
