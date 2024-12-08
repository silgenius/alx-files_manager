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
            this.dbClient = new MongoClient(this.url);
            await this.dbClient.connect();
            this.verifyConnection = true;

            this.db = this.dbClient.db(this.dbName);
        } catch(err) {
            this.verifyConnection = false;
            console.log('mongodb encountered an error');
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
}

let dbClient = new DBClient();

(async () => {
    await dbClient.init()
})();

module.exports = dbClient;
