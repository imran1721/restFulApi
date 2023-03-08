import express, { Express } from 'express';
import dotenv from 'dotenv';
import { router } from './users';
import { sequelize } from './config/config';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.json('Server Running!');
});

app.use('/users', router);

const start = async (): Promise<void> => {
  try {
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();
