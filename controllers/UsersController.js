import dbClient from '../utils/db';
const crypto = require('crypto');
import redisClient from '../utils/redis';
const { ObjectId } = require('mongodb');

export const hashPassword = (password) => {
	const hash = crypto.createHash('sha1');
	hash.update(password);
	return hash.digest('hex');
}

export async function postNew(req, res) {
	const { email, password } = req.body;

	if (!email) {
		return res.status(400).json({ error: 'Missing email' });
	}
	if (!password) {
		return res.status(400).json({ error: 'Missing password' });
	}

	const emailExist = await dbClient.findUser({ email: email })
	if (emailExist) {
		return res.status(400).json({ error: 'Already exist' });
	}

	const hashedPassword = hashPassword(password);
	const newUser = await dbClient.createUser(
		{
			email: email,
			password: hashedPassword
		}
	)

	return res.status(201).json(
		{
			id: newUser.insertedId,
			email: email
		}
	)
}

export async function getMe(req, res) {
        const token = req.get('X-Token');
        const key = 'auth_' + token;
        const user_id = await redisClient.get(key);
        if (!user_id) {
                return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await dbClient.findUser({ _id: new ObjectId(user_id) });
        if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
        }

        return res.json({ email: user.email, id: user._id.toString() })
}
