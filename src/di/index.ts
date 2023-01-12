import { container } from 'tsyringe';
import { getDatasource } from '../database';
import { DataSource } from "typeorm";

container.register(DataSource, {
  useValue: getDatasource()
});