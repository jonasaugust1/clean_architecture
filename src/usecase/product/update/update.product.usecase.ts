import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";

export default class UpdateProductUseCase {
    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {
        const product = await this.productRepository.find(input.id);

        if (!product) {
            throw new Error(`Product ${input.id} not found`);
        }

        await this.productRepository.update(input);

        return {
            id: input.id,
            name: input.name,
            price: input.price
        }
    }
}