import { Body, Controller, Post,Get,Param , Delete, Put, Query } from '@nestjs/common';
import { ProductDto } from './dto/product';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get('search')
    async searchProducts(@Query('query') query: string): Promise<Product[]> {
        return this.productsService.searchProducts(query);
    }

    @Get('search-with-filters')
    async searchProductsWithFilters(
        @Query('q') query?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
        @Query('category') category?: string,
    ): Promise<Product[]> {
        return this.productsService.searchProductsWithFilters({
            query,
            minPrice,
            maxPrice,
            category,
        });
    }

    @Post()
    async createProduct(@Body() product: ProductDto): Promise<Product> {
        return this.productsService.createProduct(product);
    }

    @Get()
    async getProducts(): Promise<Product[]> {
        return this.productsService.getProducts();
    }

    @Get(':id')
    async getProductById(@Param('id') id: string): Promise<Product> {
        return this.productsService.getProductById(id);
    }

    @Put(':id')
    async updateProduct(@Param('id') id: string, @Body() product: ProductDto): Promise<Product> {
        return this.productsService.updateProduct(id, product);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string): Promise<Product> {
        return this.productsService.deleteProduct(id);
    }
}
