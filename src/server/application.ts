import {inject, singleton} from "tsyringe";
import {logger, middlewareLogger} from "../core/logger";
import express from "express";
import cors from "cors";
import { attachControllerInstances } from "@decorators/express";
import { PostController } from "../controller/post";
import { AuthenticationController } from "../controller/auth";
import { DataSource } from "typeorm";
import { UsersController } from "../controller/user";

const HOST = 'localhost';
const PORT = 3000;

@singleton()
export class Application {

  constructor(
    @inject(AuthenticationController) private authController: AuthenticationController,
    @inject(PostController) private postController: PostController,
    @inject(UsersController) private userController: UsersController,
    @inject(DataSource) private dataSource: DataSource,
  ) { }

  private prepareAppInstance() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
      origin: "*"
    }))
    app.use(middlewareLogger);

    attachControllerInstances(app, [this.authController, this.postController, this.userController])

    return app;
  }

  async listen() {
    try {
      await this.dataSource.initialize()
      logger.info('SQLite3 is connected!');
      const app = this.prepareAppInstance();
      logger.info('Preparing app instance');

      app.listen(PORT, HOST, async () => {
        logger.info('Server is up.');
        logger.info(`HOST: ${HOST}`);
        logger.info(`PORT: ${PORT}`);
      })
    } catch (e) {
      logger.error(`Error while starting app: ${e}`)
    }
  }
}