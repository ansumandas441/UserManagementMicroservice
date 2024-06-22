# UserManagementMicroservice




## Problem description:

[problem statement](http://docs.google.com/document/d/14R6ltID1NEL9ttR9iMl7OtHZ6N6wlllUtutPzjRLGwo/edit)


## Functional requirement
 - Create, Read, Update, and Delete operations on user data.
 - The read operation is more so it should be faster.
 - Users can be searched using a username.
 - Users can be searched using age range(Min, max or both).
 - For Search user should have jwt(non verified) token with id
 - Don’t show blocked users in the search 
 - One user can block another user.
 - A user can unblock one user?
 - Inputs should have simple validations.



## Design considerations

 - SQL is used for its ACID properties and fixed schema.
 - The read request is generally much more for search functionality than the write request. So need Redis caching for faster response. For a name, the data is saved in Redis. Based on specific name and age range the range query can be done from the Redis database.
 - For only range-based queries the data is fetched from the Postgresql database.
 - Multiple users can be created with the same name, surname and username.


## Some Features of this project
 - Monorepo using yarn for later code integration
 - Have the essence of MVC and clean architecture, primarily aligns with Modular architecture
 - User jest and superset for Unit test and endpoint testing.
 - Used class-validator for simple request validation.
 - Used Redis for caching.


##Structure of the project:
```
├── src
│   ├── api
│   │   ├── controllers
│   │   │   └── user.controller.ts
│   │   ├── dtos
│   │   │   ├── block-user.dto.ts
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── interfaces
│   │   │   └── user-services.interfaces.ts
│   │   ├── middlewares
│   │   ├── models
│   │   │   └── user.model.ts
│   │   └── services
│   │       ├── prisma.service.ts
│   │       ├── redis.service.ts
│   │       └── user.services.impl.ts
│   ├── app.module.ts
│   ├── main.ts
│   ├── modules
│   │   ├── prisma
│   │   │   └── prisma.module.ts
│   │   ├── redis
│   │   │   └── redis.module.ts
│   │   └── user
│   │       └── user.module.ts
│   └── utils
│       ├── date.utils.ts
│       └── token.utils.ts
├── test
│   ├── app.e2e-spec.ts
│   ├── date.utils.spec.ts
│   ├── jest-e2e.json
│   ├── user.dto.spec.ts
│   ├── user.module.spec.ts
│   └── user.service.spec.ts
└── tsconfig.app.json
```
## Data Model

####  User schema


| Parameter        | Type     | Description            |
|------------------|----------|------------------------|
| id               | number   | Users id               |
| name             | number   | Users name             |
| surname          | string   | Users surname          |
| username         | string   | Users username         |
| birthdate        | string   | Users birthdate        |
| blocked_contacts | string[] | Users blocked contacts |



## API Reference

#### Deployed URI: https://user-management-service2.onrender.com

#### Create User

```http
  POST /users/create
```

| Parameter | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| id        | number | Unique identifier for the user.         |
| name      | string | User's first name.                      |
| surname   | string | User's last name.                       |
| username  | string | User's unique user name.                |
| birthdate | string | User's birthdate in  YYYY-MM-DD format. |

**Request URL**: https://user-management-service2.onrender.com/users/create

**cURL**: 
```
curl --location 'https://user-management-service2.onrender.com/users/create' \
--header 'Content-Type: application/json' \
--data '{
    "name": "namesd",
    "surname": "surnsdame",
    "username": "nameusr23",
    "birthdate": "2000-11-12"
}'
```

**Request Body**:

```markdown
  {
    "name": "name",
    "surname": "surname",
    "username": "username",
    "birthdate": "2000-11-12"
  }
```

**Response Body**:



```
  response(201):{
    "id": 123,
    "name": "name",
    "surname": "surname",
    "username": "username",
    "birthdate": "2000-11-12"
  }

```
or

```
  response(409):{
   "message": "Username test already exists",
   "error": "Conflict",
   "statusCode": 409
  }

```





#### Update user

```http
  PATCH /users/edit/{id}
```

| Parameter | Type             | Description                             |
|-----------|------------------|-----------------------------------------|
| id        | number           | Unique identifier for the user.         |
| name      | string(optional) | User's first name.                      |
| surname   | string(optional) | User's last name.                       |
| username  | string(optional) | User's unique user name.                |
| birthdate | string(optional) | User's birthdate in  YYYY-MM-DD format. |


**Request URL**:  https://user-management-service2.onrender.com/users/edit/{id}

**cURL**: 
```
curl --location --request PATCH 'https://user-management-service2.onrender.com/users/edit/6?id=6' \
--header 'Content-Type: application/json' \
--data '{
    "name": "namesd2",
    "birthdate": "2014-11-12"
}'
```


**Request Body**:
  ```
  {
   "name": name:string or null,
   "surname": surname:string or null,
   "username": username, string or null,
   "birthdate": birthdate: string or null,
  }
```

**Response Body**:



```markdown
  response(200):{
   {
    "id": 123,
    "name": "name",
    "surname": "surname",
    "username": "username",
    "birthdate": "2000-11-12"
  }
 }


```

#### Delete user

```http
  DEL /users/delete/{id}
```

| Parameter | Type             | Description                             |
|-----------|------------------|-----------------------------------------|
| id        | number           | Unique identifier for the target user for delete.         |


**Request URL**:  https://user-management-service2.onrender.com/users/delete/{id}


**cURL**: 
```
curl --location --request DELETE 'https://user-management-service2.onrender.com/users/delete/4'
```

**Response Body**:
```
response(200):{
   "message": "User deleted successfully"
}
```
#### Search user

```http
  GET /users/search/{id}
```

| Parameter | Type             | Description                          |
|-----------|------------------|--------------------------------------|
| userId    | number           | Unique identifier for the host user. |
| id        | number           | Other users id                       |
| username  | string           | Other users username                 |
| minAge    | string(optional) | Other users minAge                   |
| maxAge    | string(optional) | Other users minAge                   |


**Request URL**:  https://user-management-service2.onrender.com/users/search/{id}

**cURL**: 
```
curl --location 'https://user-management-service2.onrender.com/users/search?username=username&minAge=10&maxAge=25' \
--header 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2IiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.NlVN1CIDgT4ITGGpRQPkabyWOgi_VBEL0AUIpBKSW74' \
--data ''
```

**Response Body**:

```
response(201):{
   "message": "User with id: 2 is blocked"
}
```

```
response(201):{
   "message": "User is already blocked"
}
```


#### Block user

```http
  GET /users/block/{id}
```

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| userId    | number | Unique identifier for the host user. |
| id        | number | Other users id                       |


**Request URL**:  https://user-management-service2.onrender.com/users/block/{id}

**cURL**: 
```
curl --location --request POST 'https://user-management-service2.onrender.com/users/block/6' \
--header 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2IiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.NlVN1CIDgT4ITGGpRQPkabyWOgi_VBEL0AUIpBKSW74'
```

**Response Body**:

```
response(201):{
   "message": "User with id: 2 is blocked"
}
```

```
response(201):{
   "message": "User is already blocked"
}
```


#### Unblock user 

```http
  GET /users/unblock/{id}
```

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| userId    | number | Unique identifier for the host user. |
| id        | number | Other users id                       |

**Request URL**:https://user-management-service2.onrender.com/users/unblock/{id}

**cURL**: 
```
curl --location --request POST 'https://user-management-service2.onrender.com/users/unblock/6' \
--header 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2IiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.NlVN1CIDgT4ITGGpRQPkabyWOgi_VBEL0AUIpBKSW74'
```

**Response Body**:

```
response(201):{
   "message": "User with id: 2 is unblocked"
}

```

```
response(201):{
   "message": "User is not blocked"
}

```


Error responses:
Schema validation response:
```
	response(400):{
  "statusCode": 400,
  "error": "Bad Request",
  "Message": "Error message"
}
```

Id checks for search:
```
response(400):{
  "Message": "User with id 100 not found"
  "error": "Not Found",
  "statusCode": 401,
}
```

Id not found for block/ unblock endpoints:
```
response(403):{
  "statusCode": 403,
  "error": "Not found",
  "Message": "User with id 1 is not found"
}
```

Resource not found for block/ unblock endpoints:

```
	response(403):{
  "statusCode": 403,
  "error": "Not found",
  "Message": "User to be blocked is not found"
}
```

```
response(403):{
  "statusCode": 403,
  "error": "Not found",
  "Message": "User with id 100  is not found"
}
```


User name already exists:

```
response(409):{
  "statusCode": 409,
  "error": "Conflict",
  "Message": "Username user already exists"
}
```

Internal server error(unexpected errors):

```
response(500):{
  "statusCode": 500,
  "error": "Internal server error"
}
```
## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```
