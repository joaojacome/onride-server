import * as Promise from 'bluebird';
import * as r from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";
export default class RideModel {

    public tableName: string = "carona";
    public table:r.Table;
    public db: any;

    constructor(db: any) {
        this.db = db;
        this.table = r.table(this.tableName);
    }

    public getMyRide(data) {
        return new Promise( (resolve, reject) => {
            this.table.filter( r.row('status').lt(3).and( r.row("usuario")("id").eq(data.id).or( r.row("caroneiro")("id").eq(data.id) ) ) )
            .run(this.db).then( result => {
                result.each( (err, row) =>{
                    if (err) throw err;
                    let data = new Date()
                    data.setTime(row.data);
                    data.setMinutes(data.getMinutes() + 20);
                    if ((data.getTime() <= new Date().getTime()) && row.status == 0) {
                        row.status = 4;
                        this.updateCarona(row, 0);
                        resolve(false)
                    } else {
                        resolve(row);
                    }
                }, () => {
                    resolve(false)
                });
            }).catch( err => {
                console.log(err)
                reject();
            })
        });
    }



    public updateCarona(ride, statusVerificar) {
        return new Promise( (resolve, reject) => {
            let query = r.row("id").eq(ride.id).and(r.row('status').lt(3));
            if (statusVerificar) {
                query = r.row("id").eq(ride.id).and(r.row('status').eq(statusVerificar));
            }
            this.table.filter(query).update(ride, { returnChanges: true }).run(this.db).then( result => {
                if (result.changes) {
                    if(result.changes.length > 0) {
                        resolve(result.changes[0].new_val)
                    } else {
                        resolve(true)
                    };
                } else {
                    resolve(false);
                }
            }).catch( err => {
                throw err;
            });
        })
    }
    public resumoCaronaByUsuario(usuario) {
        return new Promise( (resolve, reject) => {
            let resumo = { 'carona': null, 'distancia': null, 'nota': null };
            this.table.filter(r.row('status').eq(3).and(r.row("usuario")("id").eq(usuario.id).or(r.row('caroneiro')('id').eq(usuario.id)))).run(this.db).then( result => {
                resumo.nota = 0;
                resumo.carona = 0;
                resumo.distancia = 0;
                result.each( (err, ride) => {
                    if (err) throw err;
                    resumo.carona++;
                    resumo.distancia = resumo.distancia + (ride.distancia - 0)
                    if (ride.usuario.id != usuario.id ) {
                        if( ride.usuario.avaliacao ){
                            resumo.nota = resumo.nota + ride.usuario.avaliacao
                        }
                    } else {
                        if( ride.caroneiro.avaliacao ){
                            resumo.nota = resumo.nota + ride.caroneiro.avaliacao
                        }
                    }
                }, () => {
                    if (resumo.nota > 0) {
                        resumo.nota = (resumo.nota / resumo.carona) - 0
                    }
                    resumo.distancia = 0 + " km";
                    resolve(resumo)
                });
            }).catch( err => {
                reject();
            })
        });
    }

    public save(ride) {
        return new Promise ( (resolve, reject) => {
            let destino = JSON.parse(ride.destino);
            if (destino.favorito) {
                destino = { "endereco": destino.favorito.endereco, "lat": destino.favorito.lat, "lng": destino.favorito.lng }
            }

            let origem = JSON.parse(ride.origem);
            let carona = {
                'origem': origem,
                'destino': destino,
                'grupo': ride.grupo.id,
                'status': 0,
                'data': r.now(),
                'distancia': 0,//api.calculaDistancia(origem.lat, origem.lng, destino.lat, destino.lng),
                'usuario': ride.usuario
            };


            this.table.insert(carona, { returnChanges: true }).run(this.db).then( result => {
                resolve(result.changes[0].new_val);
            }).catch( err => {
                reject();
            });
        });
    }
    public getRideById(ride) {
        return new Promise( (resolve, reject) => {
            this.table.get(ride).run(this.db).then( result => {
                resolve(result);
            }).catch( err => {
                reject();
            });
        });
    }
    public concluirRide(ride) {
        return new Promise( (resolve, reject) => {
            ride.status = 3;
            this.table.filter(r.row("id").eq(ride.id).and(r.row('status').lt(3))).update(ride, { returnChanges: true }).run(this.db).then( result => {
                if (result.changes) {
                    r.table('push').filter(r.row("message")("data")("ride_id").eq(ride.id)).delete().run(this.db).then( result => {
                        console.log('PUSH cancelados com sucesso!')
                    });/*.catch( err => {
                        reject(true);
                    });*/
                    if (result.changes.length > 0) {
                        //console.log(result.changes)
                        resolve(result.changes[0].new_val);
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            }).catch( err => {
                reject();
            });
        });
    }
}
