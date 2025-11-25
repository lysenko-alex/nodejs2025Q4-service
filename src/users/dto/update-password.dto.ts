import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Previous password',
    example: 'OldPassword123',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string; // previous password

  @ApiProperty({
    description: 'New password',
    example: 'NewPassword123',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string; // new password
}
