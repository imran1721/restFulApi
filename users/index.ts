import { Request, Response, Router } from 'express';
import NodeCache from 'node-cache';
import { config } from '../config/jwt.config';
import User from '../models/user.model';
import { verifyToken, getToken } from '../utils/jwt';
import { getQueryParam } from '../utils/paramQuery';
//@ts-ignore
import storage from 'node-sessionstorage';
import { comparePassword, hashPassword } from '../utils/passwordHash';

const cache = new NodeCache({ stdTTL: 10 });

export const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user && (await comparePassword(password, user?.password))) {
      const token = getToken(user?.id);
      console.log(`Token: ${token}`);
      storage.setItem('loggedInUserId', (user?.id || '').toString());
      return res.status(200).json({ AccessToken: token, ExpiresIn: config.ttl });
    } else {
      return res.status(401).json('Incorrect Email or Password!');
    }
  } catch (err: any) {
    const errors = err.errors.map((error: Error) => error.message);
    return res.status(400).json({ Errors: { errors } });
  }
});

/* To get All users
endpoint - /users 
*/
router.get('/', async (req: Request, res: Response) => {
  try {
    const cacheKey = 'allUsers';
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json('Authentication Token missing!');
    const authenticated = verifyToken(token);
    if (!authenticated)
      return res.status(401).json('Unable to authorize access token!');
    if (cache.has(cacheKey)) return res.status(200).json(cache.get(cacheKey));
    else {
      const queryParam = getQueryParam(req);
      const users = await User.findAll(queryParam);
      cache.set(cacheKey, users);
      return res.status(200).json(users);
    }
  } catch (err: any) {
    const errors = err.errors.map((error: Error) => error.message);
    return res.status(400).json({ Errors: { errors } });
  }
});

/* To get user by Id
endpoint - /users/{id}
*/
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cacheKey = `user_${id}`;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json('Authentication Token missing!');
    const authenticated = verifyToken(token);
    if (!authenticated)
      return res.status(401).json('Unable to Authenticate access token!');
    if (cache.has(cacheKey)) return res.status(200).json(cache.get(cacheKey));
    else {
      const user = await User.findOne({ where: { id } });
      if (!user) return res.status(400).json('User not found!');
      cache.set(cacheKey, user);
      return res.status(200).json(user);
    }
  } catch (err: any) {
    const errors = err.errors.map((error: Error) => error.message);
    return res.status(400).json({ Errors: { errors } });
  }
});

/* To create user
endpoint - /users
*/
router.post('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    let { password } = req.body;
    password = await hashPassword(password);

    const user: User = await User.create({ ...req.body, password });
    return res.status(200).json(user);
  } catch (err: any) {
    const errors = err?.errors?.map((error: Error) => error.message) || err;
    return res.status(400).json({ Errors: { errors } });
  }
});

/* To update user by Id
endpoint - /users/{id}
*/
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json('Authentication Token missing!');
    const authenticated = verifyToken(token);
    if (!authenticated)
      return res.status(401).json('Unable to Authenticate access token!');
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(400).json('User not found!');
    const count = await User.update({ ...req.body }, { where: { id } });
    if (count) return res.status(200).json('user detail updated successfully!');
  } catch (err: any) {
    const errors = err.errors.map((error: Error) => error.message);
    return res.status(400).json({ Errors: { errors } });
  }
});

/* To delete user by Id
endpoint - /users/{id}
*/
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json('Authentication Token missing!');
    const authenticated = verifyToken(token);
    if (!authenticated)
      return res.status(401).json('Unable to Authenticate access token!');
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) return res.status(400).json('User not found!');
    const count = await User.destroy({ where: { id } });
    if (count) return res.status(200).json('user deleted successfully!');
  } catch (err: any) {
    const errors = err.errors.map((error: Error) => error.message);
    return res.status(400).json({ Errors: { errors } });
  }
});
