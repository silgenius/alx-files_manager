import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        this.dbHost = 'localhost';
        this.dbPort = '27017';
        this.dbName = 'files_manager';
        this.url = `mongodb://${this.dbHost}:${this.dbPort}`;
        this.dbClient =  null;
        this.verifyConnection = false;
        this.db = null;
    }

    async init() {
        try {
            this.dbClient = new MongoClient(this.url, { 
		    useNewUrlParser: true,
		    useUnifiedTopology: true 
	    });
            await this.dbClient.connect();
            this.verifyConnection = true;

            this.db = this.dbClient.db(this.dbName);
        } catch(err) {
            this.verifyConnection = false;
            console.log(`mongodb encountered an error: ${err}`);
        }
    }

    isAlive() {
        return this.verifyConnection
    }

    async nbUsers() {
        if (this.db) {
            let userCollection = this.db.collection('users');
            const result = await userCollection.countDocuments();
            return result
        }
        
    }

    async nbFiles () {
        if (this.db) {
            let filesCollection = this.db.collection('files');
            const result = await filesCollection.countDocuments();
            return result
        }
    }

    async createUser(userDetails) {
        if (this.db) {
            let userCollection = this.db.collection('users');
            const result = await userCollection.insertOne(userDetails);
            return result;
        }
    }

    async findUser(userDetails) {
        if (this.db) {
            let userCollection = this.db.collection('users');
            const result = await userCollection.findOne(userDetails);
            return result;
        }
    }

    async createFile(fileDetails) {
        if (this.db) {
            let fileCollection = this.db.collection('files');
            const result = await userCollection.insertOne(fileDetails);
            return result;
        }
    }

    async findFile(fileDetails) {
        if (this.db) {
            let fileCollection = this.db.collection('files');
            const result = await userCollection.findOne(fileDetails);
            return result;
        }
    }

}

let dbClient = new DBClient();

(async () => {
    await dbClient.init()
})();

module.exports = dbClient;
