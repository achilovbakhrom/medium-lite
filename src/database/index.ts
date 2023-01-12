import { DataSourceOptions, createConnection, DataSource } from "typeorm"
import path from 'path';
import {User} from "../entity/User";
import {Post} from "../entity/Post";
import {PostRating} from "../entity/PostRating";

const root: string = path.resolve(__dirname, "..", "..")

const options: DataSourceOptions = {
  type: "sqlite",
  database: `${root}/data/medium.sqlite`,
  entities: [User, Post, PostRating],
  logging: true,
  synchronize: true,
};

export const getDatasource = (): DataSource =>
  new DataSource(options)
