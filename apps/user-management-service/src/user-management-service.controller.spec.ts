import { Test, TestingModule } from '@nestjs/testing';
import { UserManagementServiceController } from './user-management-service.controller';
import { UserManagementServiceService } from './user-management-service.service';

describe('UserManagementServiceController', () => {
  let userManagementServiceController: UserManagementServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserManagementServiceController],
      providers: [UserManagementServiceService],
    }).compile();

    userManagementServiceController = app.get<UserManagementServiceController>(UserManagementServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userManagementServiceController.getHello()).toBe('Hello World!');
    });
  });
});
