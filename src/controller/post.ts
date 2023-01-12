import {Controller, Params, Query, } from "@decorators/express";
import {inject, injectable} from "tsyringe";
import { Body, Post, Request as RequestDecorator, Response as ResponseDecorator, Get, Put } from "@decorators/express";
import { Response, Request } from 'express';
import { AuthMiddleware } from "../middlewares/auth";
import {PostService} from "../service/post";
import {PostDto} from "../dto/PostDto";
import {validateBody} from "../utils/validation";

@injectable()
@Controller('/posts')
export class PostController {

  constructor(
    @inject(PostService) private postService: PostService,
  ) {}

  @Post('/', [
    AuthMiddleware,
  ])
  async createPost(
    @RequestDecorator() req: Request & { userId: number },
    @ResponseDecorator() res: Response,
    @Body() body: PostDto
  ) {
    try {
      const result = validateBody(PostDto, body);
      if (result.length) {
        res.status(400).send({
          success: false,
          message: result
        });
        return
      }
      const post = await this.postService.createPost(body, req.userId);
      res.status(200).send({
        success: true,
        data: post
      })
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e?.message
      });
    }
  }
  @Get('/', [AuthMiddleware])
  async getAllPosts(
    @Query('page') page: number = 0,
    @Query('size') size: number = 20,
    @ResponseDecorator() res: Response,
  ) {
    try {
      const result = await this.postService.getPosts(page, size);
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

  @Get('/:id', [AuthMiddleware])
  async getPostById(
    @Params('id') id: number,
    @ResponseDecorator() res: Response,
  ) {
    try {
      const post = await this.postService.getPostById(id);
      res.status(200).send({
        success: true,
        data: post
      })
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e?.message
      });
    }
  }

  @Post('/:id/rate', [AuthMiddleware])
  async setRating(
    @RequestDecorator() req: Request & { userId: number },
    @ResponseDecorator() res: Response,
    @Params('id') id: number,
    @Body('rating') rating: number
  ) {
    try {
      const result = await this.postService.setRating(id, req.userId, rating);
      res.status(200).send({
        success: true,
        data: result,
      })
    } catch (e: any) {
      res.status(400).send({
        success: false,
        message: e?.message
      });
    }
  }

}