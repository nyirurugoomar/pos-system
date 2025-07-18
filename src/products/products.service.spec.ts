import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { ProductDto } from './dto/product';

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: any;

  const mockProductModel = {
    new: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get(getModelToken(Product.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    const productDto: ProductDto = {
      name: 'Test Product',
      description: 'A test product description',
      price: 29.99,
      image: 'https://example.com/image.jpg',
    };

    it('should create a new product successfully', async () => {
      // Arrange
      const mockProduct = {
        _id: 'product123',
        ...productDto,
        save: jest.fn().mockResolvedValue({
          _id: 'product123',
          ...productDto,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      };

      mockProductModel.new.mockReturnValue(mockProduct);

      // Act
      const result = await service.createProduct(productDto);

      // Assert
      expect(mockProductModel.new).toHaveBeenCalledWith(productDto);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(result).toEqual({
        _id: 'product123',
        ...productDto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should handle product creation errors', async () => {
      // Arrange
      const mockProduct = {
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      mockProductModel.new.mockReturnValue(mockProduct);

      // Act & Assert
      await expect(service.createProduct(productDto)).rejects.toThrow('Database error');
    });
  });

  describe('getProducts', () => {
    it('should return all products', async () => {
      // Arrange
      const mockProducts = [
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

      mockProductModel.find.mockResolvedValue(mockProducts);

      // Act
      const result = await service.getProducts();

      // Assert
      expect(mockProductModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products exist', async () => {
      // Arrange
      mockProductModel.find.mockResolvedValue([]);

      // Act
      const result = await service.getProducts();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      // Arrange
      const productId = 'product123';
      const mockProduct = {
        _id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: 29.99,
        image: 'test-image.jpg',
      };

      mockProductModel.findById.mockResolvedValue(mockProduct);

      // Act
      const result = await service.getProductById(productId);

      // Assert
      expect(mockProductModel.findById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });

    it('should return null for non-existent product', async () => {
      // Arrange
      const productId = 'nonexistent';
      mockProductModel.findById.mockResolvedValue(null);

      // Act
      const result = await service.getProductById(productId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateProduct', () => {
    const productId = 'product123';
    const updateDto: ProductDto = {
      name: 'Updated Product',
      description: 'Updated description',
      price: 39.99,
      image: 'updated-image.jpg',
    };

    it('should update a product successfully', async () => {
      // Arrange
      const updatedProduct = {
        _id: productId,
        ...updateDto,
        updatedAt: new Date(),
      };

      mockProductModel.findByIdAndUpdate.mockResolvedValue(updatedProduct);

      // Act
      const result = await service.updateProduct(productId, updateDto);

      // Assert
      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        productId,
        updateDto,
        { new: true }
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should return null when updating non-existent product', async () => {
      // Arrange
      mockProductModel.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      const result = await service.updateProduct(productId, updateDto);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('deleteProduct', () => {
    const productId = 'product123';

    it('should delete a product successfully', async () => {
      // Arrange
      const deletedProduct = {
        _id: productId,
        name: 'Deleted Product',
        description: 'Deleted description',
        price: 29.99,
        image: 'deleted-image.jpg',
      };

      mockProductModel.findByIdAndDelete.mockResolvedValue(deletedProduct);

      // Act
      const result = await service.deleteProduct(productId);

      // Assert
      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
      expect(result).toEqual(deletedProduct);
    });

    it('should return null when deleting non-existent product', async () => {
      // Arrange
      mockProductModel.findByIdAndDelete.mockResolvedValue(null);

      // Act
      const result = await service.deleteProduct(productId);

      // Assert
      expect(result).toBeNull();
    });
  });
});