const dbClient = '../utils/db';
const redisClient = '../utils/redis';

const dbConnection = () => {
	return new Promise((resolve, reject) => {
		let i = 0;
		const repeatFct = async () => {
			await setTimeout(() => {
				i += 1;
			if (i >= 10) {
				reject();
			} else if (!dbClient.isAlive()) {
				repeatFct()
			}
			else {
				resolve()
			}
			}, 1000);
			repeatFct();
			}
		});
	};

export async function getStatus(req, res) {
	// verify mongodb connection
	await dbConnection();
	const isMongoConnected = dbClient.isAlive();

	// verify redis connection
	const isRedisConnected = redisClient.isAlive();

	res.json({ "redis": isRedisConnected, "db": isMongoConnected });
}

export async function getStats(req, res) {
	const userCount = await nbUsers();
	const filesCount = awiat nbFiles ();

	res.json({ users: userCount, files: filesCount });
}