import { ProductDto } from './dto/product';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
export declare class ProductsService {
    private productModel;
    constructor(productModel: Model<Product>);
    createProduct(product: ProductDto): Promise<Product>;
    getProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product>;
    updateProduct(id: string, product: ProductDto): Promise<Product>;
    deleteProduct(id: string): Promise<Product>;
}
