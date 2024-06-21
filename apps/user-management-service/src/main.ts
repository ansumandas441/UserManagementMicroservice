import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; 
import dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();


// DATABASE_URL="postgresql://Users_owner:TCASa1tzvb2p@ep-wandering-tree-a1koucvq.ap-southeast-1.aws.neon.tech/Users?sslmode=require"
// REDIS_URL=redis-19850.c1.asia-northeast1-1.gce.redns.redis-cloud.com
// REDIS_PASSWORD=4DXmCCkcCUrjHPuFiblOAKOQ7HnHsq1p

// generator client {
//   provider = "prisma-client-js"
// }

// datasource db {
//   provider = "postgresql"
//   url=env("DATABASE_URL")
// }

// model User {
//   id              Int            @id @default(autoincrement())
//   name            String   
//   surname         String?   
//   username        String         @unique
//   birthdate       DateTime
//   blockedContacts Int[]          @default([])         
// }