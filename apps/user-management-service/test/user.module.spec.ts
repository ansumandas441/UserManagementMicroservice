import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/api/services/prisma.service';
import { UserModule } from '../src/modules/user/user.module';
import { UserService } from '../src/api/interfaces/user-services.interfaces';
import { PrismaModule } from '../src/modules/prisma/prisma.module';

describe('UserModule', () => {
  let module: TestingModule;
  let userService: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
      providers: [PrismaService], // Include any necessary providers or mocks
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should inject the UserService', () => {
    expect(userService).toBeDefined();
  });
});


describe('PrismaModule', () => {
    let module: TestingModule;
    let prismaService: PrismaService;
  
    beforeAll(async () => {
      module = await Test.createTestingModule({
        imports: [PrismaModule],
        providers: [PrismaService], 
      }).compile();
  
      prismaService = module.get<PrismaService>(PrismaService);
    });
  
    afterAll(async () => {
      await module.close();
    });
  
    it('should be defined', () => {
      expect(module).toBeDefined();
    });
  
    it('should inject the PrismaService', () => {
      expect(prismaService).toBeDefined();
    });
  });
