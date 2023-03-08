import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {router} from './users';
import { sequelize } from './config/config';
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use('/users', router);

const start = async (): Promise<void> => {
  try {
    await sequelize.sync();
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();


