import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class BlockUserDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  blockedUserId: number;
}
