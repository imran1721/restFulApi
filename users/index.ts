import { Request, Response } from 'express'
import { Router } from 'express';
import User from '../models/user.model';

export const router = Router();

router.get('/', async(req: Request, res: Response) => {
  return res.status(200).json(User.findAll())
});

router.post("/", async (req: Request, res: Response): Promise<Response> => {
  const data= req.body;
  console.log(data)
  const user: User = await User.create( data );
  return res.status(200).json(user);
});
