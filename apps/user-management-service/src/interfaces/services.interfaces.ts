import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { BlockUserDto } from '../dtos/block-user.dto';
import { UserModel } from '../models/user.model';

export interface UserService {
  createUser(createUserDto: CreateUserDto): Promise<UserModel>;
  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserModel>;
  deleteUser(id: number): Promise<void>;
  searchUsers(username: string, minAge?: number, maxAge?: number): Promise<UserModel[]>;
  blockUser(blockUserDto: BlockUserDto): Promise<void>;
  unblockUser(blockUserDto: BlockUserDto): Promise<void>;
}
