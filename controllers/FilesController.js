import redisClient from '../utils/redis';
import dbClient from '../utils/db';
const { ObjectId } = require('mongodb');
import { randomString } from './AuthController';
const fs = require('fs').promises;
const mime = require('mime-types');

export async function postUpload(req, res) {
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
		const file = await dbClient.findFile({ _id: new ObjectId(parentId) });
		if (!file) {
			return res.status(400).json({ error: 'Parent not found' });
		}

		if (file.type !== 'folder') {
			return res.status(400).json({ error: 'Parent is not a folder'});
		}
	}

	const fileDetails = {
		userId: user._id,
		name: name,
		type: type,
		parentId: parentId ? new ObjectId(parentId) : 0,
		isPublic: isPublic ? isPublic : false,
	}

	if (type === 'folder') {
		const newFile = await dbClient.createFile(fileDetails);
		const { _id, ...resp } = newFile.ops[0];
		resp['id'] = newFile.insertedId
		return res.status(201).json(resp);
	}

	const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

	try {
		// Create folder path dir if not exist
		await fs.mkdir(folderPath, { recursive: true });

		// Create file containing provided data
		const fileName = randomString();
                const filePath = folderPath + '/' + fileName;
                const fileData = Buffer.from(data, 'base64');
		await fs.writeFile(filePath, fileData);
		fileDetails['localPath'] = filePath;

		const newFile = await dbClient.createFile(fileDetails);
                const { _id, localPath, ...resp } = newFile.ops[0];
                resp['id'] = newFile.insertedId;
                return res.status(201).json(resp);
	} catch(err) {
		console.log(`Error occured: ${err}`);
	}
}

export async function getShow(req, res) {
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

	const { id } = req.params;
	const result = await dbClient.findFile({ _id: new ObjectId(id) });

	if (!result) {
		return res.status(404).json({ error: 'Not found' });
	}

	const { _id, localPath, ...resp } = result;
	resp["id"] = _id;

	return res.status(200).json(resp);
}

export async function getIndex(req, res) {
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

	let { parentId, page } = req.query

	page = page ? page * 20 : 0;
	if (parentId == 0) {
		parentId = { parentId: 0 };
	} else {
		parentId = parentId ? { parentId: new ObjectId(parentId) } : {}
	}

	const pipeline = [
		{ $match: parentId },
		{ $skip: page },
		{ $limit: 20 },
		{ $project: {
			id: "$_id",
			userId: "$userId",
			name: "$name",
			type: "$type",
			isPublic: "$isPublic",
			parentId: "$parentId" }
		},
		{ $project: { _id: 0 } }
	];

	const result = await dbClient.findFiles(pipeline);
	return res.status(200).json(result);
}

export async function putPublish(req, res) {
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

	const { id } = req.params;
	const result = await dbClient.findFile({ _id: new ObjectId(id) });
	if (!result) {
		return res.status(404).json({ error: 'Not found' });
	}

	await dbClient.updateFile({ _id: new ObjectId(id) }, { $set: { isPublic: true } });

	const { _id, localPath, ...resp } = result;
	resp["id"] = _id.toString();
	resp.isPublic = true;

	return res.status(200).json(resp);
}

export async function putUnpublish(req, res) {
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

        const { id } = req.params;

        const result = await dbClient.findFile({ _id: new ObjectId(id) });
	if (!result) {
		return res.status(404).json({ error: 'Not found' });
	}

	await dbClient.updateFile({ _id: new ObjectId(id) }, { $set: { isPublic: false } });

	const { _id, localPath, ...resp } = result;
	resp["id"] = _id.toString();
	resp.isPublic = false;
	return res.status(200).json(resp);
}

export async function getFile(req, res) {
	const { id } = req.params;

        const file = await dbClient.findFile({ _id: new ObjectId(id) });
	if (!file) {
		return res.status(404).json({ error: 'Not found' });
	}

	const token = req.get('X-Token');
	const key = 'auth_' + token;
	const user_id = await redisClient.get(key);

	if (file.isPublic === false) {
		if (!user_id || user_id !== file.userId.toString()) {
			return res.status(404).json({ error: 'Not found' });
		}
	}

	if (file.type === 'folder') {
		res.status(400).json({ error: "A folder doesn't have content" });
	}

	try {
		const data = await fs.readFile(file.localPath, 'utf8')
		const dataMimeType = mime.lookup(file.name)
		res.set('Content-Type', dataMimeType);
		res.send(data);
	} catch (err) {
		console.log(err);
		return res.status(404).json({ error: 'Not found' });
	}

}
