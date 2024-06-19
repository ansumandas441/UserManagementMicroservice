import { Controller, Get } from '@nestjs/common';
import { UserManagementServiceService } from './user-management-service.service';

@Controller()
export class UserManagementServiceController {
  constructor(private readonly userManagementServiceService: UserManagementServiceService) {}

  @Get()
  getHello(): string {
    return this.userManagementServiceService.getHello();
  }
}
