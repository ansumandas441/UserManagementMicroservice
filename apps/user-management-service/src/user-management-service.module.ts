import { Module } from '@nestjs/common';
import { UserManagementServiceController } from './user-management-service.controller';
import { UserManagementServiceService } from './user-management-service.service';

@Module({
  imports: [],
  controllers: [UserManagementServiceController],
  providers: [UserManagementServiceService],
})
export class UserManagementServiceModule {}
