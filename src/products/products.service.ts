import { Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>
    ) {}


    async searchProducts(query: string): Promise<Product[]> {
        console.log('Searching for:', query); 
        
        if (!query || query.trim() === '') {
            console.log('Empty query, returning all products');
            return this.productModel.find().populate('category','categoryName').populate('inventory', 'quantity');
        }
        const searchRegex = new RegExp(query, 'i'); 
        
        return this.productModel.find({
            $or: [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } }
            ]
        }).populate('category','categoryName').populate('inventory', 'quantity');
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

        return this.productModel.find(searchCriteria).populate('category','categoryName').populate('inventory', 'quantity');
    }



    async createProduct(product: ProductDto): Promise<Product> {
        const createdProduct = new this.productModel(product);
        const savedProduct = await createdProduct.save();
        return this.productModel.findById(savedProduct._id).populate('category', 'categoryName')
    }

    async getProducts(): Promise<Product[]> {
        return this.productModel.find().populate('category','categoryName')
    }

    async getProductById(id: string): Promise<Product> {
        return this.productModel.findById(id).populate('category','categoryName')
    }

    async updateProduct(id: string, product: ProductDto): Promise<Product> {
        return this.productModel.findByIdAndUpdate(id, product, { new: true }).populate('category','categoryName');
    }

    async deleteProduct(id: string): Promise<Product> {
        return this.productModel.findByIdAndDelete(id).populate('category','categoryName');
    }
}
