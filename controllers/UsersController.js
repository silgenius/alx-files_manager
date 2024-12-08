import dbClient from '../utils/db';
const crypto = require('crypto');

const hashPassword = (password) => {
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

	return res.json(
		{
			id: newUser.insertedId,
			email: email
		}
	)
}
