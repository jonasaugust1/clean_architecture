import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model"; 
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory"; 

describe("Integration test for updating product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const product = ProductFactory.create("Sofa", "a", 2500);
    await productRepository.create(product);

    const input = {
      id: product.id,
      name: "Sofa 2 lugares",
      price: 3000,
    };

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);

    const updatedProduct = await productRepository.find(product.id);
    expect(updatedProduct.name).toBe("Sofa 2 lugares");
    expect(updatedProduct.price).toBe(3000);
  });
});
