import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import  { PrismaService } from './prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserService } from '../interfaces/user-services.interfaces';
import { BlockUserDto } from '../dtos/block-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserModel } from '../models/user.model';
import { Prisma } from '@prisma/client';
import { calculateMinMaxDate } from '../../utils/date.utils'
import { redisClient } from './redis.service';
import { RedisClientType } from 'redis';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(private readonly prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    try {
      const { username } = createUserDto;
      const existingUser = await this.prisma.user.findUnique({
        where: { username: username },
      });

      if (existingUser) {
        throw new ConflictException(`Username ${username} already exists`);
      }
      const createdUser = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          surname: createUserDto.surname,
          username: createUserDto.username,
          birthdate: new Date(createUserDto.birthdate),
        }
      });
      
      //delete cache
      const keys = await this.redisClient.keys('*'); 
      if (keys.length > 0) {
        await this.redisClient.del(keys); 
      }

      return createdUser;
      
    } catch(error) {
        throw error;
    }
  } 
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserModel> {
    try {
      const data: Prisma.UserUpdateInput = {}
      if (updateUserDto.name !== undefined) data.name = updateUserDto.name;
        if (updateUserDto.surname !== undefined) data.surname = updateUserDto.surname;
        if (updateUserDto.username !== undefined) data.username = updateUserDto.username;
        if (updateUserDto.birthdate !== undefined) data.birthdate = new Date(updateUserDto.birthdate);

      const updatedUser = await this.prisma.user.update({
        where: {id:id},
        data
      });

      //delete cache
      const keys = await this.redisClient.keys('*'); 
      if (keys.length > 0) {
        await this.redisClient.del(keys); 
      }

      return updatedUser;
    } catch(error){
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw error; 
    }
  }
  async deleteUser(id: number): Promise<any> {
    try {
      await this.prisma.user.delete({
        where: {id}
      });

      //delete cache
      const keys = await this.redisClient.keys('*'); 
      if (keys.length > 0) {
        await this.redisClient.del(keys); 
      }

      return {
        message: 'User deleted successfully'
      }
    } catch(error){
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw error; 
    }
  }
  async searchUsers(currentUserId: number, username: string, minAge?: number, maxAge?: number): Promise<UserModel[]> {
    let {minDate, maxDate} = calculateMinMaxDate(minAge, maxAge);
    
    let cacheKey;
    if(!minAge && !maxAge){
      cacheKey=`user_search_${username}`;
    } else if(minAge && !maxAge){
      cacheKey = `user_search_${username}_${minAge}_U`;
    } else if(!minAge && maxAge){
      cacheKey = `user_search_${username}_L_${maxAge}`;
    } else {
      cacheKey =`user_search_${username}_${minAge}_${maxAge}`;
    }
    
    
    const cachedReponse = await this.redisClient.get(cacheKey);

    if(cachedReponse){
      return JSON.parse(cachedReponse);
    }

    let currentUser = await this.prisma.user.findUnique({
      where: {id: Number(currentUserId)}
    });
    let blockedIds = currentUser.blockedContacts;
    const where : Prisma.UserWhereInput = {
      username: { contains: username, mode: 'insensitive' }
    };

    if(minDate!==undefined){
      where.birthdate = { lte: minDate };
    }
    if(maxDate!==undefined){
      where.birthdate = (where.birthdate && typeof where.birthdate==='object')? { ...where.birthdate, gte: maxDate } : { gte: maxDate } ;
    }
    if (blockedIds && blockedIds.length > 0) {
      where.id = {
        not: {
          in: blockedIds,
        },
      };
    }
    const searchResult  = await this.prisma.user.findMany({
      where
    });

     // Cache the result
    await this.redisClient.set(cacheKey, JSON.stringify(searchResult), {
      EX: 3600, // expires in 1 hour
    });

    return searchResult;
  }
  async blockUser(currentUserId: number, blockUserDto: BlockUserDto): Promise<any> {
    try {
      const { blockedUserId } = blockUserDto;
      const blockedUser = await this.prisma.user.findUnique({
        where: { id: blockedUserId}
      });
      
      if(!blockedUser) {
        throw new NotFoundException(`User with id ${blockedUserId} not found`);
      }

      const user = await this.prisma.user.findUnique({
        where: { id: currentUserId}
      });

      if (user.blockedContacts && user.blockedContacts.includes(blockedUserId)) {
        return {message: "User is already blocked"}; 
      }

      await this.prisma.user.update({
        where: {id: currentUserId},
        data: {
          blockedContacts: {
            push: blockedUserId
          }
        }
      });

      //delete cache
      const keys = await this.redisClient.keys('*'); 
      if (keys.length > 0) {
        await this.redisClient.del(keys); 
      }

      return {
        message:`User with id: ${blockedUserId} is blocked`
      };

    } catch (error) {
      throw error;
    }
  }
  async unblockUser(currentUserId: number, blockUserDto: BlockUserDto): Promise<any> {
    try {
      const { blockedUserId } = blockUserDto;
      const blockerUser = await this.prisma.user.findUnique({
        where: { id: blockedUserId}
      });
      
      if(!blockerUser) {
        throw new NotFoundException(`User with id ${blockedUserId} not found`);
      }

      const user = await this.prisma.user.findUnique({
        where: { id: currentUserId}
      });

      if (!user.blockedContacts.includes(blockedUserId)) {
        return {message: "User is not blocked"}; 
      }

      await this.prisma.user.update({
        where: { id: currentUserId },
        data: {
          blockedContacts: {
            set: user.blockedContacts.filter(id => id !== blockedUserId)
          }
        }
      });

      //delete cache
      const keys = await this.redisClient.keys('*'); 
      if (keys.length > 0) {
        await this.redisClient.del(keys); 
      }

      return {
        message:`User with id: ${blockedUserId} is unblocked`
      };

    } catch (error) {
      throw error;
    }
  }


}
