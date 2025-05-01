import { IsEmail, IsOptional, IsDateString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  fullName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}