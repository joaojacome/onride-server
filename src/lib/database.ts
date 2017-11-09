import * as Promise from 'bluebird';
import * as RethinkDB from "rethinkdb";
import * as fs from "fs";
import Logger from "lib/util/logger";
export default class Database {
    public static bootstrap(): Promise<any> {
        return new Promise( (resolve, reject) => {
            Logger.log("Initializing database");
            let a:RethinkDB.ConnectionOptions = {
                host: "",
                port: 18707,
                db: "",
                password: "",
                ssl: {
                        ca: [new Buffer(fs.readFileSync("./certs/database.crt"))]
                },
            };
            RethinkDB.connect(a, (err, conn) => {
                if (err) throw err;
                resolve(conn);
            });
        });
    }
}