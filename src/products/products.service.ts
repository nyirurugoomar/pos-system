import { Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}


    async searchProducts(query: string): Promise<Product[]> {
        const searchRegex = new RegExp(query, 'i'); // Case-insensitive search
        
        return this.productModel.find({
            $or: [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } }
            ]
        });
    }

    async searchProductsWithFilters(filters: {
        query?: string;
        minPrice?: number;
        maxPrice?: number;
        category?: string;
    }): Promise<Product[]> {
        const searchCriteria: any = {};

        // Text search
        if (filters.query) {
            const searchRegex = new RegExp(filters.query, 'i');
            searchCriteria.$or = [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } }
            ];
        }

        // Price range filter
        if (filters.minPrice || filters.maxPrice) {
            searchCriteria.price = {};
            if (filters.minPrice) searchCriteria.price.$gte = filters.minPrice;
            if (filters.maxPrice) searchCriteria.price.$lte = filters.maxPrice;
        }

        // Category filter (if you have category field)
        if (filters.category) {
            searchCriteria.category = filters.category;
        }

        return this.productModel.find(searchCriteria);
    }



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
