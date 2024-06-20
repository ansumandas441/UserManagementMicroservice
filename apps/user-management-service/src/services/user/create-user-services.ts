import { Injectable } from '@nestjs/common';
import prisma from '../prisma-service/prisma.service';
import { CreateUserDto } from '../../dtos/create-user.dto';

@Injectable()
export class CreateUserService {
  async createUser(createUserDto: CreateUserDto) {
    const { name, surname, username, birthdate } = createUserDto;
    return await prisma.user.create({
      data: {
        name,
        surname,
        username,
        birthdate,
      },
    });
  }
}
