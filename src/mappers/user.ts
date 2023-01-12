import {User} from "../entity/User";
import {UserDto} from "../dto/UserDto";

export const mapUserEntityToDto = (user: User, rating: number = 0): UserDto => ({
  id: user.id,
  email: user.email,
  rating: rating
})