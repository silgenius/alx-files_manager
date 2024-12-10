/* eslint-disable global-require */

import dbClient from '../utils/db';
import { hashPassword } from './UsersController';
import redisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

export const randomString = () => {
  const { v4: uuidv4 } = require('uuid');

  const newUuid = uuidv4();
  return newUuid;
};

export async function getConnect(req, res) {
  const authHeader = req.get('Authorization');
  // convert base64 to str
  const base64String = authHeader.split(' ')[1];
  const buffer = Buffer.from(base64String, 'base64');
  const authHeaderStr = buffer.toString('utf-8');

  const userDetails = authHeaderStr.split(':');

  const email = userDetails[0];
  const user = await dbClient.findUser({ email });

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const hashedPassword = hashPassword(userDetails[1]);
  if (hashedPassword !== user.password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = randomString();
  const key = `auth_${token}`;

  await redisClient.set(key, user._id.toString(), 86400);

  return res.json({ token });
}

export async function getDisconnect(req, res) {
  const token = req.get('X-Token');
  const key = `auth_${token}`;
  const userId = await redisClient.get(key);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await dbClient.findUser({ _id: new ObjectId(userId) });
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await redisClient.del(key);
  return res.status(204).json();
}
