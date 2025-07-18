import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    createProduct: jest.fn(),
    getProducts: jest.fn(),
    getProductById: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    const productDto: ProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      price: 29.99,
      image: 'test-image.jpg',
    };

    it('should create a new product', async () => {
      // Arrange
      const expectedProduct = {
        _id: 'product123',
        ...productDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProductsService.createProduct.mockResolvedValue(expectedProduct);

      // Act
      const result = await controller.createProduct(productDto);

      // Assert
      expect(service.createProduct).toHaveBeenCalledWith(productDto);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('getProducts', () => {
    it('should return all products', async () => {
      // Arrange
      const expectedProducts = [
        {
          _id: 'product1',
          name: 'Product 1',
          description: 'Description 1',
          price: 19.99,
          image: 'image1.jpg',
        },
        {
          _id: 'product2',
          name: 'Product 2',
          description: 'Description 2',
          price: 29.99,
          image: 'image2.jpg',
        },
      ];

      mockProductsService.getProducts.mockResolvedValue(expectedProducts);

      // Act
      const result = await controller.getProducts();

      // Assert
      expect(service.getProducts).toHaveBeenCalled();
      expect(result).toEqual(expectedProducts);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      // Arrange
      const productId = 'product123';
      const expectedProduct = {
        _id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: 29.99,
        image: 'test-image.jpg',
      };

      mockProductsService.getProductById.mockResolvedValue(expectedProduct);

      // Act
      const result = await controller.getProductById(productId);

      // Assert
      expect(service.getProductById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      // Arrange
      const productId = 'product123';
      const updateDto: ProductDto = {
        name: 'Updated Product',
        description: 'Updated description',
        price: 39.99,
        image: 'updated-image.jpg',
      };

      const expectedProduct = {
        _id: productId,
        ...updateDto,
        updatedAt: new Date(),
      };

      mockProductsService.updateProduct.mockResolvedValue(expectedProduct);

      // Act
      const result = await controller.updateProduct(productId, updateDto);

      // Assert
      expect(service.updateProduct).toHaveBeenCalledWith(productId, updateDto);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      // Arrange
      const productId = 'product123';
      const deletedProduct = {
        _id: productId,
        name: 'Deleted Product',
        description: 'Deleted description',
        price: 29.99,
        image: 'deleted-image.jpg',
      };

      mockProductsService.deleteProduct.mockResolvedValue(deletedProduct);

      // Act
      const result = await controller.deleteProduct(productId);

      // Assert
      expect(service.deleteProduct).toHaveBeenCalledWith(productId);
      expect(result).toEqual(deletedProduct);
    });
  });
});