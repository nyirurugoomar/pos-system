import { ProductDto } from './dto/product';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(product: ProductDto): Promise<Product>;
    getProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product>;
    updateProduct(id: string, product: ProductDto): Promise<Product>;
    deleteProduct(id: string): Promise<Product>;
}
