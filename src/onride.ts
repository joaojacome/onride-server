/// <reference path="./onride.d.ts" />
process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();


import EServer from "lib/eserver";
import Database from "lib/database";

Database.bootstrap().then( conn => {
    EServer.bootstrap(conn);
})