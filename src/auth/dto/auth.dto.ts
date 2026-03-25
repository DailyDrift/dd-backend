import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthDto {
  @IsString()
  @MinLength(3, { message: 'username has to be at least 3 characters' })
  @MaxLength(30, { message: 'username cannot be longer than 30 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username can only contain letters and numbers',
  })
  username: string;

  @IsString()
  @MinLength(8, { message: 'password has to be at least 8 characters' })
  @MaxLength(72, { message: 'password cannot be longer that 72 characters' })
  password: string;
}
