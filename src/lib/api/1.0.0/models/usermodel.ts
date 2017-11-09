import * as Promise from 'bluebird';

import * as r from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";

export default class UserModel {

    public tableName: string = "usuario";
    public table:r.Table;
    public db: any;


    constructor(db: any) {
        this.db = db;
        this.table = r.table(this.tableName);
    }

    public login(data: any):Promise<any> {
        return new Promise( (resolve, reject) => {
            this.table.filter({ 'id': '' + data.id }).count().run(this.db).then( result => {
                if (result > 0) {
                    this.table.filter({ 'id': '' + data.id }).update(data, { returnChanges: true }).run(this.db)
                        .then( result => {
                            resolve(result.changes[0].new_val);
                            })
                            .catch( err => {
                                throw err;
                            });
                    } else {
                        data.so_mulheres = false;
                        this.table.insert(data, { returnChanges: true }).run(this.db)
                            .then( result => {
                                let grupo = {
                                    'nome': 'Todos',
                                    'tipo': 0,
                                    'data': new Date(),
                                    'usuario': data.id
                                };
                                r.table("grupo").insert(grupo, { returnChanges: true }).run(this.db)
                                    .then( resultado => {
                                        resolve(result.changes[0].new_val);
                                    })
                                    .catch( err => {
                                        throw err;
                                    })
                            })
                            .catch( err => {
                                throw err;
                            });
                    }
                })
                .catch( err => {
                    throw err;
                });
            });
    }

    public saveLocalizacao(data) {
        return new Promise( (resolve, reject) => {
            let usuario = { 'localizacao': { 'lat': data.lat, 'lon': data.lng } };
            this.table.filter({ 'id': '' + data.usuario }).update(usuario).run(this.db).then( resulta => {
                return r.table('localizacao').insert(data, { returnChanges: true }).run(this.db);
            }).then( result => {
                resolve(result.changes[0].new_val);
            }).catch( err => {
                reject(true);
            })
        })       
    }

    public updateSoMulheres(user) {
        return new Promise( (resolve, reject) => {
            this.table.filter({ 'id': '' + user.id }).update({ 'so_mulheres' : user.so_mulheres }, { returnChanges: true }).run(this.db).then(result => {
                //console.log(result.changes[0])
                resolve(result.changes[0].new_val);
            }).catch( err => {
                reject()
            })
        })

    }
    public configUpdate(user, configs) {
        return new Promise( (resolve, reject) => {
            //this.table.filter({id: user.id}).
        });
    }


    public getUser(me) {
        return new Promise( (resolve, reject) => {
            this.table.filter({ 'id': me.id }).run(this.db).then( result => {
                result.each( (err, row) => {
                    resolve(row);
                }, () => {
                    resolve();
                });
            }).catch( err => {
                reject();
            })
        })
    }
}