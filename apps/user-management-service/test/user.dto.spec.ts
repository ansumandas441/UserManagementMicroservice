// create-user.dto.spec.ts

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from '../src/api/dtos/create-user.dto';
import { UpdateUserDto } from '../src/api/dtos/update-user.dto';
import { BlockUserDto } from '../src/api/dtos/block-user.dto';

describe('CreateUserDto', () => {
  it('should validate correct input', async () => {
    const input = {
      name: 'name',
      surname: 'surname',
      username: 'username',
      birthdate: '1990-01-01',
    };

    const dto = plainToClass(CreateUserDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBe(0); // No validation errors
  });

  it('should detect missing required fields', async () => {
    const input = {
      name: '',
      surname: '',
      username: '',
      birthdate: '',
    };

    const dto = plainToClass(CreateUserDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0); // Should have validation errors
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should detect invalid date format', async () => {
    const input = {
      name: 'name',
      surname: 'surname',
      username: 'username',
      birthdate: 'not-a-date',
    };

    const dto = plainToClass(CreateUserDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('should fail when name is not a string', async () => {
    const input = {
        name: 11,
        surname: 'surname',
        username: 'username',
        birthdate: 'not-a-date',
    };

    const dto = plainToClass(CreateUserDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail when username is not a string', async () => {
    const input = {
        name: 'name',
        surname: 'surname',
        username: 222,
        birthdate: 'not-a-date',
    };

    const dto = plainToClass(CreateUserDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('username');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail when surname is not a string', async () => {
    const input = {
        name: 'name',
        surname: true,
        username: 'username',
        birthdate: 'not-a-date',
    };

    const dto = plainToClass(CreateUserDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('surname');
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});

describe('UpdateUserDto', () => {
    it('should validate correct input', async () => {
      const input = {
        name: 'name',
        surname: 'surname',
        username: 'username',
        birthdate: '1990-01-01',
      };
  
      const dto = plainToClass(UpdateUserDto, input);
      const errors = await validate(dto);
  
      expect(errors.length).toBe(0); // No validation errors
    });
  
    it('should not fail when fields are missing', async () => {
        const input = {}; // All fields are optional
    
        const dto = plainToClass(UpdateUserDto, input);
        const errors = await validate(dto);
    
        expect(errors.length).toBe(0); // No validation errors because all fields are optional
    });
  
    it('should detect invalid date format', async () => {
      const input = {
        name: 'name',
        surname: 'surname',
        username: 'username',
        birthdate: 'not-a-date',
      };
  
      const dto = plainToClass(UpdateUserDto, input);
      const errors = await validate(dto);
  
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isDateString');
    });
    it('should fail when name is not a string', async () => {
        const input = {
          name: 123, 
        };
    
        const dto = plainToClass(UpdateUserDto, input);
        const errors = await validate(dto);
    
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('name');
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    
      it('should fail when username is not a string', async () => {
        const input = {
          username: 123, 
        };
    
        const dto = plainToClass(UpdateUserDto, input);
        const errors = await validate(dto);
    
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('username');
        expect(errors[0].constraints).toHaveProperty('isString');
      });
    
      it('should fail when surname is not a string', async () => {
        const input = {
          surname: true, 
        };
    
        const dto = plainToClass(UpdateUserDto, input);
        const errors = await validate(dto);
    
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('surname');
        expect(errors[0].constraints).toHaveProperty('isString');
      });
  });

  describe('BlockUserDto', () => {
    it('should validate correct input', async () => {
      const input = {
        blockedUserId: 123,
      };
  
      const dto = plainToClass(BlockUserDto, input);
      const errors = await validate(dto);
  
      expect(errors.length).toBe(0); 
    });
  
    it('should fail when blockedUserId is missing', async () => {
      const input = {};
  
      const dto = plainToClass(BlockUserDto, input);
      const errors = await validate(dto);
  
      expect(errors.length).toBeGreaterThan(0); 
      expect(errors[0].property).toBe('blockedUserId');
      expect(errors[0].constraints).toHaveProperty('isInt');
    });
  
    it('should fail when blockedUserId is not an integer', async () => {
      const input = {
        blockedUserId: 'notAnInteger',
      };
  
      const dto = plainToClass(BlockUserDto, input);
      const errors = await validate(dto);
  
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('blockedUserId');
      expect(errors[0].constraints).toHaveProperty('isInt');
    });
  
    it('should fail when blockedUserId is a float', async () => {
      const input = {
        blockedUserId: 123.45,
      };
  
      const dto = plainToClass(BlockUserDto, input);
      const errors = await validate(dto);
  
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('blockedUserId');
      expect(errors[0].constraints).toHaveProperty('isInt');
    });
  
    it('should fail when blockedUserId is negative', async () => {
        const input = {
          blockedUserId: -1,
        };
    
        const dto = plainToClass(BlockUserDto, input);
        const errors = await validate(dto);
    
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('blockedUserId');
        expect(errors[0].constraints).toHaveProperty('min');
    });
  });