import * as Express from "express";
import * as BodyParser from "body-parser";
import * as fs from "fs";
import * as https from 'https';
import Logger from "lib/util/logger";

/* loading routes */

import Route100 from "lib/api/1.0.0/routes";

export default class EServer {
    public app: Express.Application;
    public db: any;

    public static bootstrap(conn): EServer {
        return new EServer(conn);
    }
    constructor(conn) {
        this.app = Express();
        this.config();
        this.start();
        this.db = conn;
    }

    public config() {
        this.app.use( (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.header('Access-Control-Allow-Credentials', "true");
            next();
        });
        this.app.use(BodyParser.json());
    }
    public start() {
        let privateKey = fs.readFileSync( './certs/onride.key' );
        let certificate = fs.readFileSync( './certs/onride.crt' );
        if (process.env.PORT) {
            this.app.listen(process.env.PORT, () => {
                this.registerRoutes();
                Logger.log("Server started!");
               // global.LOG('SERVER','started');
            });
        } else {
            https.createServer({
                key: privateKey,
                cert: certificate
            }, this.app).listen(8080, () => {
                this.registerRoutes();
                Logger.log("Server started!");
            });
        }
    }

    public registerRoutes() {
        let routes = {
            "1.0.0": Route100.bootstrap(this.db),
            "004": Route100.bootstrap(this.db),
        };
        for(let i in routes) {
            this.app.use('/'+i, routes[i].router);
            this.app.use('/'+i, routes[i].authenticatedRouter);
        }
    }
}