import { Collection, MongoClient } from 'mongodb';



export class MongoDBDataSource {
    private client?: MongoClient;
    private token;
    //private user;

    constructor(options: { token: string }) {
        this.token = options.token;
    }

    public async init(): Promise<void> {
        const url = 'mongodb://localhost:27017';
        this.client = new MongoClient(url)
        await this.client.connect()
    }

    public async createUser(): Promise<void> {
        const res = await this.getCollection("users")?.insertOne({ name: "Lucas Gouvea" })
        if (res?.acknowledged !== true) {
            throw new Error("Could not create user")
        }
    }

    public async getUsers(): Promise<unknown> {
        const users = await this.getCollection("users")?.find().toArray()
        return users
    }

    private getCollection(name: string): Collection {
        const db = this.client?.db("database")
        if (db?.collection(name) === undefined) {
            throw new Error("Could not get collection")
        }
        return db?.collection(name)
    }


}