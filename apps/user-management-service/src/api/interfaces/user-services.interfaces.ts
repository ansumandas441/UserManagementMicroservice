import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { BlockUserDto } from '../dtos/block-user.dto';
import { UserModel } from '../models/user.model';

export abstract class UserService {
  abstract createUser(createUserDto: CreateUserDto): Promise<UserModel>;
  abstract updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserModel>;
  abstract deleteUser(id: number): Promise<void>;
  abstract searchUsers(username: string, minAge?: number, maxAge?: number): Promise<UserModel[]>;
  abstract blockUser(blockUserDto: BlockUserDto): Promise<void>;
  abstract unblockUser(blockUserDto: BlockUserDto): Promise<void>;
}
