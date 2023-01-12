import { Middleware } from '@decorators/express';
import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import {SECRET_KEY} from "../service/jwt";

export class AuthMiddleware implements Middleware {
  use(request: Request & { userId?: number }, response: Response, next: () => void): void {
    const jwtToken = request.headers['access-token'];
    if (typeof jwtToken !== 'string') {
      response.status(401).send({
        success: false,
        message: 'Unauthorized',
      })
      return;
    }
    try {
      const decoded  = jwt.verify(jwtToken, SECRET_KEY) as { id: number };
      request.userId = decoded.id;
    } catch (e) {
      response.status(401).send({
        success: false,
        message: 'Unauthorized',
      })
      return
    }
    next();
  }

}