import { Injectable } from '@nestjs/common';
import  { PrismaService } from './prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserService } from '../interfaces/user-services.interfaces';
import { BlockUserDto } from '../dtos/block-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserModel } from '../models/user.model';
import { Prisma } from '@prisma/client';
import calculateMinMaxDate from '../../utils/date.utils';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    const createdUser = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        surname: createUserDto.surname,
        username: createUserDto.username,
        birthdate: new Date(createUserDto.birthdate),
      }
    });
    
    return createdUser;
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserModel> {
    console.log("updateUserDto->", updateUserDto);
    const data: Prisma.UserUpdateInput = {}
    if (updateUserDto.name !== undefined) data.name = updateUserDto.name;
      if (updateUserDto.surname !== undefined) data.surname = updateUserDto.surname;
      if (updateUserDto.username !== undefined) data.username = updateUserDto.username;
      if (updateUserDto.birthdate !== undefined) data.birthdate = new Date(updateUserDto.birthdate);

    const updatedUser = await this.prisma.user.update({
      where: {id},
      data
    });
    return updatedUser;
  }
  async deleteUser(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async searchUsers(username: string, minAge?: number, maxAge?: number): Promise<UserModel[]> {
    let {minDate, maxDate} = calculateMinMaxDate(minAge, maxAge);
    const where : Prisma.UserWhereInput = {
      username: { contains: username, mode: 'insensitive' }
    };

    if(minDate!==undefined){
      where.birthdate = { lte: minDate };
    }
    if(maxDate!==undefined){
      where.birthdate = (where.birthdate && typeof where.birthdate==='object')? { ...where.birthdate, gte: maxDate } : { gte: maxDate } ;
    }
    const searchResult  = await this.prisma.user.findMany({
      where
    });
    return searchResult;
  }
  async blockUser(blockUserDto: BlockUserDto): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async unblockUser(blockUserDto: BlockUserDto): Promise<void> {
    throw new Error('Method not implemented.');
  }


}
