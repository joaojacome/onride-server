import * as Promise from 'bluebird';
import * as r from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";
export default class FavoriteModel {

    public tableName: string = "favorito";
    public table:r.Table;
    public db: any;

    constructor(db: any) {
        this.db = db;
        this.table = r.table(this.tableName);
    }

    public getFavorites(usuario) {
        return new Promise( (resolve, reject) => {
            this.table.filter({ 'usuario': usuario }).run(this.db).then( result => {
                let rows = [];
                result.each( (err, row) => {
                    rows.push(row);
                }, () => {
                    resolve(false)
                });
                resolve(rows);
            }).catch( err => {
                console.log(err)
                reject();
            })
        });
    }   

    public newFavorite(favorite) {
        return new Promise( (resolve, reject) => {
            this.table.insert(favorite, { returnChanges: true }).run(this.db).then( result => {
                return this.getFavorites(favorite.usuario);
            }).then( favoritos =>{
                resolve(favoritos);
            }).catch( err => {
                reject();
            });
            
        });
    }

    public excluirFavorito(favorito) {
        return new Promise( (resolve, reject) => {
            this.table.get( favorito.id ).delete().run(this.db).then( result => {
                resolve();
            }).catch( err => {
                reject();
            });
        });
    }
}