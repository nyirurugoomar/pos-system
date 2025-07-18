import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup';
import { SignInDto } from './dto/signin';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    getUserProfile: jest.fn(),
    refreshToken: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
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

    it('should create a new user', async () => {
      // Arrange
      const expectedResult = {
        token: 'jwt-token',
        user: {
          id: 'user123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
        },
      };

      mockAuthService.signUp.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.signUp(signUpDto);

      // Assert
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      username: 'testuser',
      password: 'password123',
    };

    it('should authenticate user', async () => {
      // Arrange
      const expectedResult = {
        token: 'jwt-token',
        user: {
          id: 'user123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
        },
      };

      mockAuthService.signIn.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.signIn(signInDto);

      // Assert
      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      // Arrange
      const mockRequest = {
        user: { userId: 'user123' },
      };

      const expectedUser = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };

      mockAuthService.getUserProfile.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.getProfile(mockRequest);

      // Assert
      expect(authService.getUserProfile).toHaveBeenCalledWith('user123');
      expect(result).toEqual(expectedUser);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token', async () => {
      // Arrange
      const mockRequest = {
        user: { userId: 'user123' },
      };

      const expectedResult = { token: 'new-jwt-token' };

      mockAuthService.refreshToken.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.refreshToken(mockRequest);

      // Assert
      expect(authService.refreshToken).toHaveBeenCalledWith('user123');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      // Arrange
      const mockRequest = {
        user: { userId: 'user123' },
      };

      const passwordData = {
        oldPassword: 'oldpass',
        newPassword: 'newpass',
      };

      const expectedResult = { message: 'Password changed successfully' };

      mockAuthService.changePassword.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.changePassword(mockRequest, passwordData);

      // Assert
      expect(authService.changePassword).toHaveBeenCalledWith('user123', 'oldpass', 'newpass');
      expect(result).toEqual(expectedResult);
    });
  });
});