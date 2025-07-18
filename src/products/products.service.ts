import { Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

    async createProduct(product: ProductDto): Promise<Product> {
        const createdProduct = new this.productModel(product);
        return createdProduct.save();
    }

    async getProducts(): Promise<Product[]> {
        return this.productModel.find();
    }

    async getProductById(id: string): Promise<Product> {
        return this.productModel.findById(id);
    }

    async updateProduct(id: string, product: ProductDto): Promise<Product> {
        return this.productModel.findByIdAndUpdate(id, product, { new: true });
    }

    async deleteProduct(id: string): Promise<Product> {
        return this.productModel.findByIdAndDelete(id);
    }
}
