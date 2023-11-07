import { ArrayUnique, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsNumber({}, { each: true })
  @ArrayUnique()
  roles: number[];
}
