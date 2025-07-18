import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/categories.schema';
import { Model } from 'mongoose';
import { CategoryDto } from './dto/categories';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

    async createCategory(category: CategoryDto): Promise<Category> {
        const createdCategory = new this.categoryModel(category);
        if (!createdCategory) {
            throw new Error('Category not created');
        }
        return createdCategory.save();
    }

    async getCategories(): Promise<Category[]> {
        return this.categoryModel.find();
    }

    async getCategoryById(id: string): Promise<Category> {
        return this.categoryModel.findById(id);
    }
    async updateCategory(id: string, category: CategoryDto): Promise<Category> {
        return this.categoryModel.findByIdAndUpdate(id, category, { new: true });
    }

    async deleteCategory(id: string): Promise<Category> {
        return this.categoryModel.findByIdAndDelete(id);
    }
}
