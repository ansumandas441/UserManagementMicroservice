import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UserModel } from "../models/user.model";
import { UserService } from "../interfaces/user-services.interfaces";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('create')
    async createUser(@Body() body: CreateUserDto): Promise<UserModel>{
        return await this.userService.createUser(body);
    } 
    @Patch('edit/:id')
    async editUser( id: number, @Body() body: UpdateUserDto): Promise<UserModel> {
        return await this.userService.updateUser(id, body);
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id') id: number): Promise<void> {
        return await this.userService.deleteUser(id);
    }

    @Get('search')
    async searchUsers(
        @Query('username') username: string,
        @Query('minAge') minAge: number,
        @Query('maxAge') maxAge: number,
      ): Promise<UserModel[]> {
        return await this.userService.searchUsers(1 ,username, minAge, maxAge);
      }
    @Post('block/:id')
    async blockUser(@Param('id',ParseIntPipe) id: number): Promise<void> {
        return await this.userService.blockUser(1,{ blockedUserId: id });
    }
    @Post('unblock/:id')
    async unblockUser(@Param('id',ParseIntPipe) id: number): Promise<void> {
        // Assume BlockUserDto is used for more complex unblocking scenarios
        return await this.userService.unblockUser(1,{ blockedUserId: id });
    }
}