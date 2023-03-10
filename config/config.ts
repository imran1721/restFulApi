import { Sequelize } from 'sequelize-typescript';
import User from '../models/user.model';

export const sequelize = new Sequelize('restfulAPI', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres',
  models: [User],
});
