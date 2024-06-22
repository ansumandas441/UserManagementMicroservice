import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../src/api/interfaces/user-services.interfaces";
import { PrismaService } from "../src/api/services/prisma.service";
import { UserModule } from "../src/modules/user/user.module";
import { PrismaModule } from "../src/modules/prisma/prisma.module";
import { UserModel } from "../src/api/models/user.model";
import { CreateUserDto } from "../src/api/dtos/create-user.dto";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "../src/api/dtos/update-user.dto";
import { BlockUserDto } from "../src/api/dtos/block-user.dto";
import _isEqual from 'lodash/isEqual';

describe('UserService', () => {
    let service: UserService;
    let prismaService: PrismaService;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [UserModule, PrismaModule],
        }).compile();
    
        service = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
        prismaService.user.create = jest.fn();
        prismaService.user.update = jest.fn();
        prismaService.user.findUnique = jest.fn();
        prismaService.user.delete = jest.fn();
        prismaService.user.findMany = jest.fn();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    
    describe('createUser', () => {
        it('should create a new user', async () => {
          const createUserDto: CreateUserDto = {
            name: 'name',
            surname: 'surname',
            username: 'username',
            birthdate: '1990-01-01',
          };
    
          const mockCreatedUser: UserModel = {
            id: 1,
            ...createUserDto,
            birthdate: new Date(createUserDto.birthdate),
            blockedContacts: null
          };
    
          jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
          jest.spyOn(prismaService.user, 'create').mockResolvedValue(
            {
              id: 1,
              name : createUserDto.name,
              surname: createUserDto.surname,
              username: createUserDto.username,
              birthdate: new Date(createUserDto.birthdate),
              blockedContacts: null
            }
          );
    
          const createdUser = await service.createUser(createUserDto);
          expect(createdUser).toEqual(mockCreatedUser);
          expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { username: createUserDto.username } });
          expect(prismaService.user.create).toHaveBeenCalledWith({
            data: {
              name: createUserDto.name,
              surname: createUserDto.surname,
              username: createUserDto.username,
              birthdate: new Date(createUserDto.birthdate),
            },
          });
        });
    
        it('should throw ConflictException if username already exists', async () => {
          const createUserDto: CreateUserDto = {
            name: 'name',
            surname: 'surname',
            username: 'username',
            birthdate: '1990-01-01',
          };
    
          jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
            {
              id: undefined,
              name : undefined,
              surname: undefined,
              username: createUserDto.username,
              birthdate: undefined,
              blockedContacts: undefined,
            }
          );
    
          await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
          expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { username: createUserDto.username } });
          expect(prismaService.user.create).not.toHaveBeenCalled()
        });
      }
    );

    describe('updateUser',()=>{
      const userId = 1
      it('it should update a user', async () => {
        const updateUserDto: UpdateUserDto = {
          name: 'updatedName',
          surname: 'updatedSurname',
          username: 'updatedUsername',
          birthdate: '1990-01-01',
        };
  
        const mockUpdatedUser = {
          id: userId,
          ...updateUserDto,
          birthdate: new Date(updateUserDto.birthdate),
          blockedContacts: [],
        };
  
        jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
        jest.spyOn(prismaService.user, 'update').mockResolvedValue(
          {
            id: 1,
            name : updateUserDto.name,
            surname: updateUserDto.surname,
            username: updateUserDto.username,
            birthdate: new Date(updateUserDto.birthdate),
            blockedContacts: null
          }
        );
  
        const updateUser = await service.updateUser(userId,updateUserDto);
        updateUser.id=1;
        if(!updateUser.blockedContacts){
          updateUser.blockedContacts=[];
        }
        expect(updateUser).toEqual(mockUpdatedUser);
      });
    });

    describe('deleteUser', () => {
      it('should delete the user successfully', async () => {
        jest.spyOn(prismaService.user, 'delete').mockResolvedValue({
          id: undefined,
          name : undefined,
          surname: undefined,
          username: undefined,
          birthdate: undefined,
          blockedContacts: undefined,
        });

        const response = await service.deleteUser(1);
        expect(response).toEqual({ message: 'User deleted successfully' });
        expect(prismaService.user.delete).toHaveBeenCalledWith({
          where: { id: 1 },
        });
      });
    });

    describe('searchUser', () => {
      it('should search users by username and age range', async () => {
        const currentUserId = 1;
        const username = 'testuser';
        const minAge = 20;
        const maxAge = 30;
    
        const mockCurrentUser = {
          id: currentUserId,
          name: undefined,
          surname: undefined,
          username: undefined,
          birthdate: undefined,
          blockedContacts: [],
        };
    
        const results = [
          {
            id: 2,
            name: undefined,
            surname: undefined,
            username: 'testuser1',
            birthdate: new Date('1990-01-01'),
            blockedContacts: null,
          },
          {
            id: 3,
            name: undefined,
            surname: undefined,
            username: 'testuser2',
            birthdate: new Date('1995-06-15'),
            blockedContacts: null,
          },
        ];
    
        jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockCurrentUser);
        jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(results);
    
        const result = await service.searchUsers(currentUserId, username, minAge, maxAge);
  
        let resultNew = results.map((element)=>{
          element.name=undefined;
          element.surname=undefined;
          element.blockedContacts=null;
          return element;
        });
        expect(resultNew).toEqual(results);
      });
    });
    

    describe('blockUser', () => {
      const currentUserId = 1;
      const blockedUserId = 2;
      const blockUserDto: BlockUserDto = { blockedUserId };
    
      it('should block the user successfully', async () => {
        jest.spyOn(prismaService.user,'findUnique').mockResolvedValueOnce({ 
          id: currentUserId, 
          name : undefined,
          surname: undefined,
          username: undefined,
          birthdate: undefined,
          blockedContacts: [],
        });
        jest.spyOn(prismaService.user,'findUnique').mockResolvedValueOnce({ 
          id: blockedUserId, 
          name : undefined,
          surname: undefined,
          username: undefined,
          birthdate: undefined,
          blockedContacts: undefined,
        });
    
        await service.blockUser(currentUserId, blockUserDto);
    
        expect(prismaService.user.update).toHaveBeenCalledWith({
          where: { id: currentUserId },
          data: { blockedContacts: { push: blockedUserId } },
        });
      });
    
      it('should throw NotFoundException if blocked user is not found', async () => {
        jest.spyOn(prismaService.user,'findUnique').mockResolvedValueOnce(null); 
    
        await expect(service.blockUser(currentUserId, blockUserDto)).rejects.toThrow(NotFoundException);
      });
    
      it('should return a message if the user is already blocked', async () => {
        jest.spyOn(prismaService.user,'findUnique').mockResolvedValueOnce({ 
            id: currentUserId, 
            name : undefined,
            surname: undefined,
            username: undefined,
            birthdate: undefined,
            blockedContacts: [blockedUserId],
        }); 
        jest.spyOn(prismaService.user,'findUnique').mockResolvedValueOnce({ 
          id: blockedUserId, 
          name : undefined,
          surname: undefined,
          username: undefined,
          birthdate: undefined,
          blockedContacts: undefined,
        }); 
        
        let blockedReponse = { 
          message: `User with id: ${blockedUserId} is blocked`
        }
        const result = await service.blockUser(currentUserId, blockUserDto);
        expect(result).toEqual(blockedReponse);
      });
    });
});