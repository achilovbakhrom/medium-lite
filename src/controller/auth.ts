import {inject, injectable} from "tsyringe";
import {Controller, Post, Response as ResponseDecorator, Body} from "@decorators/express";
import { Response } from 'express';
import { UserService } from "../service/user";
import {AuthDto} from "../dto/AuthDto";
import {validateBody} from "../utils/validation";

@Controller('/auth')
@injectable()
export class AuthenticationController {

  constructor(
    @inject(UserService) private userService: UserService
  ) {}

  @Post('/sign-up')
  async signUp(
    @ResponseDecorator() res: Response,
    @Body() body: AuthDto
  ) {
    try {
      const errors = validateBody(AuthDto, body);
      if (errors.length) {
        res.status(400).send({
          success: false,
          message: errors
        });
        return
      }

      const result = await this.userService.signUp(body.email!, body.password!);
      res.status(200).send({
        success: true,
        data: result
      });
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e?.message
      });
    }
  }
  @Post('/sign-in')
  async signIn(
    @ResponseDecorator() res: Response,
    @Body() body: AuthDto
  ) {
    try {
      const errors = validateBody(AuthDto, body);
      if (errors.length) {
        res.status(400).send({
          success: false,
          message: errors
        });
        return
      }
      const result = await this.userService.signIn(body.email!, body.password!);
      res.status(200).send({
        success: true,
        data: result
      })
    } catch (e: any) {
      res.status(401).send({
        success: false,
        message: e?.message
      })
    }
  }

}