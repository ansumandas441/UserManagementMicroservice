import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { UserService } from "../../interfaces/user-services.interfaces";
import { CreateUserDto } from "../../dtos/create-user.dto";
import { UpdateUserDto } from "../../dtos/update-user.dto";
import { UserModel } from "../../models/user.model";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('create')
    async createUser(@Body() body: CreateUserDto): Promise<void>{
        await this.userService.createUser(body);
    } 
    @Patch('edit/:id')
    async editUser( id: number, @Body() body: UpdateUserDto): Promise<void> {
        await this.userService.updateUser(id, body);
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id') id: number): Promise<void> {
        await this.userService.deleteUser(id);
    }

    @Get('search')
    async searchUsers(
        @Query('username') username: string,
        @Query('minAge') minAge: number,
        @Query('maxAge') maxAge: number,
      ): Promise<void> {
        await this.userService.searchUsers(username, minAge, maxAge);
      }
    @Post('block/:id')
    async blockUser(@Param('id') id: number): Promise<void> {
        // Assume BlockUserDto is used for more complex blocking scenarios
        await this.userService.blockUser({ userId: id });
    }
    @Post('unblock/:id')
    async unblockUser(@Param('id') id: number): Promise<void> {
        // Assume BlockUserDto is used for more complex unblocking scenarios
        await this.userService.unblockUser({ userId: id });
    }
}