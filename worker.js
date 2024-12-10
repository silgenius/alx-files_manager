const Bull = require('bull');
import dbClient from './utils/db';
const { ObjectId } = require('mongodb');
const fs = require('fs');
export const fileQueue = new Bull('fileQueue');
const imageThumbnail = require('image-thumbnail');

fileQueue.process(async (job) => {
	const { fileId, userId } = job.data;

	if (!fileId) {
		throw new Error('Missing fileId');
	}

	if (!userId) {
		throw new Error('Missing userId');
	}

	const file = await dbClient.findFile({ _id: new ObjectId(fileId), userId: new ObjectId(userId) });

	if (!file) {
		throw new Error('File not found');
	}

	try {
		const options = { responseType: 'buffer' };
		const widths = [500, 250, 100];

		for (let width of widths) {
			options.width  = width;
			const thumbnail = await imageThumbnail(file.localPath, options);
			const newImagePath = file.localPath + '_' + width;
			fs.writeFileSync(newImagePath, thumbnail);
		}
  	} catch (err) {
		throw new Error(`Error: ${err}`);
	}
});
