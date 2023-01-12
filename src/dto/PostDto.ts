import {MinLength } from "class-validator";
import {UserDto} from "./UserDto";

export class PostDto {
  id?: number

  @MinLength(3)
  title?: string

  @MinLength(8)
  content?: string

  readingTime?: string

  rating?: number

  user?: UserDto
}