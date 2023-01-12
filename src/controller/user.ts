import {Controller, Get, Query} from "@decorators/express";
import {inject, injectable} from "tsyringe";
import {UserService} from "../service/user";
import {AuthMiddleware} from "../middlewares/auth";
import {Response as ResponseDecorator} from "@decorators/express/lib/src/decorators/params";
import {Response} from "express";

@Controller('/users')
@injectable()
export class UsersController {
  constructor(@inject(UserService) private userService: UserService) {}

  @Get('/', [AuthMiddleware])
  async getAllPosts(
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
    @ResponseDecorator() res: Response,
  ) {
    try {
      const result = await this.userService.getUsers(page, size);
      res.status(200).send({
        success: true,
        data: result
      })
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e?.message
      });
    }
  }
}