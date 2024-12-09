import redisClient from '../utils/redis';
import dbClient from '../utils/db';
const { ObjectId } = require('mongodb');

export async function postUpload(req, res) {
	const token = req.get('X-Token');
	const key = 'auth_' + token;
	const user_id = await redisClient.get(key);
	if (!user_id) {
		return res.status(400).json({ error: 'Unauthorized' });
	}

	const user = await dbClient.findUser({ _id: new ObjectId(user_id) });
	if (!user) {
		return res.status(400).json({ error: 'Unauthorized' });
	}

	const { name, type, parentId, isPublic, data } = req.body;

	if (!name) {
		return res.status(400).json({ error: 'Missing name' });
	}

	const acceptedType = ['folder', 'file', 'image'];
	if (!type || !acceptedType.includes(type)) {
		return res.status(400).json({ error: 'Missing type' });
	}

	if (!data && type !== 'folder') {
		return res.status(400).json({ error: 'Missing data' })
	}

	if (parentId) {
		file = await findFile({ parentId: parentId });
		if (!file) {
			return res.status(400).json({ error: 'Parent not found' });
		}

		if (file.type !== 'folder') {
			return res.status(400).json({ error: 'Parent is not a folder'});
		}
	}

	const fileDetails = {
		userId: user._id.toString(),
		name: name,
		type: type,
		parentId: parentId ? parentId : 0,
		isPublic: isPublic,
	}

	if (type === 'folder') {
		const newFile = await createFile(fileDetails);
		const { _id, ...resp } = newFile.ops[0];
		resp['id'] = newFile.insertedId
		return res.status(200).json(resp);
	}
}
