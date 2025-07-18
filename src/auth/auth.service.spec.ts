import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { SignUpDto } from './dto/signup';
import { SignInDto } from './dto/signin';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userModel: any;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    };

    it('should create a new user successfully', async () => {
      // Arrange
      const mockUser = {
        _id: 'user123',
        username: signUpDto.username,
        email: signUpDto.email,
        role: signUpDto.role,
        createdAt: new Date(),
      };

      const mockToken = 'jwt-token';

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await service.signUp(signUpDto);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ username: signUpDto.username }, { email: signUpDto.email }],
      });
      expect(mockUserModel.create).toHaveBeenCalledWith({
        username: signUpDto.username,
        email: signUpDto.email,
        password: expect.any(String), // Hashed password
        role: signUpDto.role,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        userId: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        token: mockToken,
        user: {
          id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
          createdAt: mockUser.createdAt,
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      const existingUser = { username: 'testuser', email: 'test@example.com' };
      mockUserModel.findOne.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(service.signUp(signUpDto)).rejects.toThrow(ConflictException);
      expect(mockUserModel.create).not.toHaveBeenCalled();
    });

    it('should hash password before saving', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockImplementation((userData) => {
        expect(userData.password).not.toBe(signUpDto.password);
        expect(userData.password).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/); // bcrypt pattern
        return Promise.resolve({ _id: 'user123', ...userData });
      });
      mockJwtService.sign.mockReturnValue('token');

      // Act
      await service.signUp(signUpDto);

      // Assert
      expect(mockUserModel.create).toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      username: 'testuser',
      password: 'password123',
    };

    it('should authenticate user successfully', async () => {
      // Arrange
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        password: '$2a$10$hashedpassword', // Mock hashed password
        role: 'user',
        createdAt: new Date(),
      };

      const mockToken = 'jwt-token';

      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      // Mock bcrypt.compare to return true
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);

      // Act
      const result = await service.signIn(signInDto);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: signInDto.username });
      expect(result).toEqual({
        token: mockToken,
        user: {
          id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
          createdAt: mockUser.createdAt,
        },
      });
    });

    it('should throw UnauthorizedException for invalid username', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      // Arrange
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        password: '$2a$10$hashedpassword',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(false);

      // Act & Assert
      await expect(service.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user without password', async () => {
      // Arrange
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };

      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      // Act
      const result = await service.validateUser('user123');

      // Assert
      expect(mockUserModel.findById).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockUser);
    });
  });

  describe('refreshToken', () => {
    it('should generate new token for valid user', async () => {
      // Arrange
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };

      const mockToken = 'new-jwt-token';

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await service.refreshToken('user123');

      // Assert
      expect(mockUserModel.findById).toHaveBeenCalledWith('user123');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        userId: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({ token: mockToken });
    });

    it('should throw UnauthorizedException for invalid user', async () => {
      // Arrange
      mockUserModel.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.refreshToken('invalid-id')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      // Arrange
      const mockUser = {
        _id: 'user123',
        password: '$2a$10$oldhashedpassword',
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue({});

      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);

      // Act
      const result = await service.changePassword('user123', 'oldpass', 'newpass');

      // Assert
      expect(mockUserModel.findById).toHaveBeenCalledWith('user123');
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('user123', {
        password: expect.any(String), // New hashed password
      });
      expect(result).toEqual({ message: 'Password changed successfully' });
    });

    it('should throw UnauthorizedException for invalid old password', async () => {
      // Arrange
      const mockUser = {
        _id: 'user123',
        password: '$2a$10$oldhashedpassword',
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(false);

      // Act & Assert
      await expect(service.changePassword('user123', 'wrongpass', 'newpass')).rejects.toThrow(UnauthorizedException);
    });
  });
});