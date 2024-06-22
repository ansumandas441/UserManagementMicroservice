import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request } from "@nestjs/common";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UserModel } from "../models/user.model";
import { UserService } from "../interfaces/user-services.interfaces";
import { getUserIdFromToken } from "../../utils/token.utils";

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
        @Request() req,
        @Query('username') username: string,
        @Query('minAge') minAge: number,
        @Query('maxAge') maxAge: number,
      ): Promise<UserModel[]> {
        const token = req.headers.token;
        const userId = getUserIdFromToken(token);
        return await this.userService.searchUsers(userId ,username, minAge, maxAge);
      }
    @Post('block/:id')
    async blockUser(
        @Request() req,
        @Param('id',ParseIntPipe) id: number
        ): Promise<void> {
        const token = req.headers.token;
        const userId = getUserIdFromToken(token);
        return await this.userService.blockUser(1,{ blockedUserId: id });
    }
    @Post('unblock/:id')
    async unblockUser(
        @Request() req,
        @Param('id',ParseIntPipe) id: number
        ): Promise<void> {
        const token = req.headers.token;
        const userId = getUserIdFromToken(token);    
        return await this.userService.unblockUser(1,{ blockedUserId: id });
    }
}