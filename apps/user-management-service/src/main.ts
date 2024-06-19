import { NestFactory } from '@nestjs/core';
import { UserManagementServiceModule } from './user-management-service.module';

async function bootstrap() {
  const app = await NestFactory.create(UserManagementServiceModule);
  await app.listen(3000);
}
bootstrap();
