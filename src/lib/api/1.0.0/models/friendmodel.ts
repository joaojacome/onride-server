import * as Promise from 'bluebird';
import * as r from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";

export default class FriendsModel {

    public tableName: string = "amigo";
    public table:r.Table;
    public db: any;

    constructor(db: any) {
        this.db = db;
        this.table = r.table(this.tableName);
    }

    public consultaAmigo(usuario, amigos) {
        return new Promise( (resolve, reject) => {
            this.table.insert(amigos, { conflict: "replace" }).run(this.db).then( result => {
                let grupo = { 'amigos': amigos };
                return r.table('grupo').filter(r.row("usuario").eq(usuario).and(r.row("tipo").eq(0))).update(grupo, { returnChanges: true }).run(this.db);
            }).then(result => {
                resolve();
            }).catch( err => {
                reject();
            });
        });
    }
}