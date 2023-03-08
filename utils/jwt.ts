import jwt from 'jsonwebtoken';
import { config } from '../config/jwt.config';
//@ts-ignore
import storage from 'node-sessionstorage';

const SECRET = config.secret || 'Secret';

export const getToken = (userId: any) => {
    try {
        return jwt.sign({ id: userId }, SECRET, {
            expiresIn: config.ttl,
        });
    } catch (error) {
        throw new Error('Unable to generate token!');
    }
};

export const verifyToken = (token: any) => {
    const loggedInUserId = storage.getItem('loggedInUserId');
    let authenticated;
    try {
        const decode: any = jwt.verify(token, SECRET);
        if (decode?.id && decode?.id == loggedInUserId) authenticated = true;
    } catch (error) {
        authenticated = false;
    }
    return authenticated;
};
