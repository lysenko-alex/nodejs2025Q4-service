import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'User login',
    example: 'TestUser',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    description: 'User password',
    example: 'TestPassword123',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
