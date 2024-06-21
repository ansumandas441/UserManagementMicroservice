import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserManagementServiceController (e2e)', () => {
  let app: INestApplication;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST /users/create (Create User)', async () => {
    const createUserDto = {
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
      birthdate: '1990-01-01',
    };

    const response = await request(app.getHttpServer())
      .post('/users/create')
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

      userId = response.body.user.id; 
  });

  it('/PATCH /users/edit (Update User)', async () => {
    const updateUserDto = {
      name: 'Updated Name',
    };

    await request(app.getHttpServer())
      .patch(`/users/edit/${userId}`)
      .send(updateUserDto)
      .expect(HttpStatus.OK);
  });

  it('/DEL /users/delete/{id} (Delete User)', async () => {
    await request(app.getHttpServer())
      .delete(`/users/delete/${userId}`)
      .expect(HttpStatus.OK);
  });

  it('/GET /users/search (Search Users)', async () => {
    const username = 'johndoe';

    const response = await request(app.getHttpServer())
      .get(`/users/search?username=${username}`)
      .expect(HttpStatus.OK);

    expect(response.body.length).toBeGreaterThan(0); 
  });

  it('/POST /users/block/{id} (Block User)', async () => {
    await request(app.getHttpServer())
      .post(`/users/block/${userId}`)
      .expect(HttpStatus.OK);
  });

  it('/POST /users/unblock/{id} (Unblock User)', async () => {
    await request(app.getHttpServer())
      .post(`/users/unblock/${userId}`)
      .expect(HttpStatus.OK);
  });
});
