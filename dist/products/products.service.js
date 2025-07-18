"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const product_schema_1 = require("./schemas/product.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ProductsService = class ProductsService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async searchProducts(query) {
        const searchRegex = new RegExp(query, 'i');
        return this.productModel.find({
            $or: [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } }
            ]
        });
    }
    async searchProductsWithFilters(filters) {
        const searchCriteria = {};
        if (filters.query) {
            const searchRegex = new RegExp(filters.query, 'i');
            searchCriteria.$or = [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } }
            ];
        }
        if (filters.minPrice || filters.maxPrice) {
            searchCriteria.price = {};
            if (filters.minPrice)
                searchCriteria.price.$gte = filters.minPrice;
            if (filters.maxPrice)
                searchCriteria.price.$lte = filters.maxPrice;
        }
        if (filters.category) {
            searchCriteria.category = filters.category;
        }
        return this.productModel.find(searchCriteria);
    }
    async createProduct(product) {
        const createdProduct = new this.productModel(product);
        return createdProduct.save();
    }
    async getProducts() {
        return this.productModel.find();
    }
    async getProductById(id) {
        return this.productModel.findById(id);
    }
    async updateProduct(id, product) {
        return this.productModel.findByIdAndUpdate(id, product, { new: true });
    }
    async deleteProduct(id) {
        return this.productModel.findByIdAndDelete(id);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map