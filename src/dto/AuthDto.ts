import {IsDefined, IsEmail, MinLength} from "class-validator";

export class AuthDto {
  @IsDefined()
  @IsEmail()
  email?: string

  @MinLength(4)
  password?: string
}