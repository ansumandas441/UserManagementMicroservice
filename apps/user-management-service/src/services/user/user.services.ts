import { Injectable } from '@nestjs/common';
import  { PrismaService } from '../prisma-service/prisma.service';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UserService } from '../../interfaces/user-services.interfaces';
import { BlockUserDto } from '../../dtos/block-user.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { UserModel } from '../../models/user.model';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    throw new Error('Method not implemented.');
  }
  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserModel> {
    throw new Error('Method not implemented.');
  }
  deleteUser(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  searchUsers(username: string, minAge?: number, maxAge?: number): Promise<UserModel[]> {
    throw new Error('Method not implemented.');
  }
  blockUser(blockUserDto: BlockUserDto): Promise<void> {
    throw new Error('Method not implemented.');
  }
  unblockUser(blockUserDto: BlockUserDto): Promise<void> {
    throw new Error('Method not implemented.');
  }


}
