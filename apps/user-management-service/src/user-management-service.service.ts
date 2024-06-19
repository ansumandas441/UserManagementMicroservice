import { Injectable } from '@nestjs/common';

@Injectable()
export class UserManagementServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
