import FindCustomerUseCase from "./find.customer.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";
import FindProductUseCase from "./find.customer.usecase";

const product = ProductFactory.create("Sofa", "a", 2500);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit Test find product use case", () => {
    it("should find a product", async () => {
        const productRepository = MockRepository();
        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: product.id,
        };

        const output = {
            id: product.id,
            name: "Sofa",
            price: 2500
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });

    it("should not find a product", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });
        const usecase = new FindCustomerUseCase(productRepository);

        const input = {
            id: "123",
        };

        expect(() => {
            return usecase.execute(input);
        }).rejects.toThrow("Product not found");
    });
});
