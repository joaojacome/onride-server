import * as Promise from 'bluebird';
import * as r from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";
export default class RatingModel {

    public tableName: string = "avaliacao";
    public table:r.Table;
    public db: any;

    constructor(db: any) {
        this.db = db;
        this.table = r.table(this.tableName);
    }
    public getAvaliacao(tipo) {
        return new Promise( (resolve, reject) => {
            this.table.orderBy({ 'index': r.desc('peso') }).filter(r.row('tipo').eq(tipo)).run(this.db).then( result => {
                let avaliacoes = [];
                result.each( (err, row) => {
                    if (err) throw err;
                    avaliacoes.push(row)
                }, () => {
                    resolve(avaliacoes);
                });
            }).then( err => {
                    reject();
            });
        })
    }
}