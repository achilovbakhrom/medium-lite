import jwt from 'jsonwebtoken';
import {injectable} from "tsyringe";
import {logger} from "../core/logger";

export const SECRET_KEY = '5UP3R_53CR31';

type UserData = {
  id: number
}

@injectable()
export class JwtService {

  encode(data: UserData): string {
    return jwt.sign(data, SECRET_KEY);
  }

  decode(jwtToken: string): UserData | undefined {
    try {
      return <UserData>jwt.verify(jwtToken, SECRET_KEY);
    } catch (e) {
      logger.error('Error while decode jwt token, seems it is invalid!')
    }
    return undefined;
  }

}