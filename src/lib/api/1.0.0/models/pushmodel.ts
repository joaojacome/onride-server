import * as Promise from 'bluebird';
import * as r from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";
import OneSignal from "lib/util/push/onesignal";
import Distance from "lib/util/distance";

export default class PushModel {

    public tableName: string = "push";
    public table:r.Table;
    public db: any;

    constructor(db: any) {
        this.db = db;
        this.table = r.table(this.tableName);
    }
    
    public save(push) {
        return new Promise( (resolve, reject) => {
            //console.log('estou aki sim')
            this.table.insert(push, { returnChanges: true }).run(this.db).then( result => {
                resolve(result.changes[0].new_val);
            }).catch( err => {
                reject();
            })
        });
    }

    public getMyPush(data) {
        return new Promise( (resolve, reject) => {
            this.table.filter(r.row("usuario").eq(data.id)).run(this.db).then( result => {
                let push = [];
                result.each( (err, row) => {
                    if (err) throw err;
                    var data = row.data;
                    data.setMinutes(data.getMinutes() + 20);
                    if (data.getTime() >= new Date().getTime()) {
                        push.push(row);
                    } else {
                        this.table.get(row.id).delete().run(this.db).then( result => {
                        }).catch( err => {
                            throw err;
                        });
                    }
                }, () => {
                    resolve(push);
                });
            }).catch( err => {
                reject();
            });
        })
    }

    public delete(push) {
        return new Promise( (resolve, reject) => {
            this.table.get(push).delete().run(this.db).then( result => {
                resolve();
            }).catch( err => {
                reject();
            });
        });
    }

    public deleteRide(ride) {
        return new Promise( (resolve, reject) => {
            this.table.filter(r.row("message")("data")("ride_id").eq(ride)).delete().run(this.db).then( result => {
                resolve(true);
            }).catch( err => {
                reject(true);
            });
        });
    }

    public pushNovaCarona(ride, users) {
        return Promise.resolve().then( () => {
            //console.log(users);
            let message = {
                app_id: "c2523693-a3c2-4e32-946e-4c27657a05c1",
                contents: { "en": "Seu amigo " + ride.usuario.nome + " está pedindo uma carona!" },
                data: { ride_id: ride.id, picture: ride.usuario.imagem, name: ride.usuario.nome, type: 0 },
                include_player_ids: []
            };
            for (var i in users) {
                console.log(users[i]);
                console.log(ride.origem.lat, ride.origem.lng, users[i].localizacao.lat, users[i].localizacao.lon);
                //if (api.distLatLong(ride.origem.lat, ride.origem.lng, users[i].localizacao.lat, users[i].localizacao.lon)) {
                let push = {
                    'message': message,
                    'usuario': users[i].id,
                    'data': r.now(),
                    'tipo': 0
                };
                this.save(push);
                if (users[i].installationId) {
                    message.include_player_ids.push(users[i].installationId);
                }
            }
            return OneSignal.sendNotification(message);
        });
    }

    public pushConfirmaCarona(ride: any):Promise<any> {
        return Promise.resolve().then( () => {
            let message = {
                app_id: "c2523693-a3c2-4e32-946e-4c27657a05c1",
                contents: {
                    "en": 'Seu amigo ' + ride.usuario.nome + ' está te aguardando!'
                },
                android_group: ride.id,
                data: {
                    ride_id: ride.id,
                    name: ride.usuario.nome,
                    picture: ride.usuario.imagem,
                    type: 2
                },
                include_player_ids: [ride.caroneiro.installationId]
            };
            return OneSignal.sendNotification(message);
        });
    }

    public pushAceitaCarona(ride:any):Promise<any> {
        return Promise.resolve().then( () => {
            let message = {
                app_id: "c2523693-a3c2-4e32-946e-4c27657a05c1",
                android_group: ride.id,
                contents: {
                    "en": "Seu amigo " + ride.caroneiro.nome + " aceitou o seu pedido !"
                },
                data: {
                    ride_id: ride.id,
                    imagemusuariocaroneiro: ride.caroneiro.imagem,
                    usuariocaroneiro: ride.caroneiro.nome,
                    type: 1
                },
                include_player_ids: [ride.usuario.installationId]
            };
            return OneSignal.sendNotification(message);
        });
    }

    public pushCancelaCarona(ride, usuario):Promise<any> {
        return Promise.resolve().then( () => {
            let nome = usuario != ride.usuario.id ? ride.caroneiro.nome : ride.usuario.nome;
            let message = {
                app_id: "c2523693-a3c2-4e32-946e-4c27657a05c1",
                contents: {
                    "en": "Carona cancelada por " + nome
                },
                android_group: ride.id,
                data: {
                    type: 4,
                    user: nome
                },
                include_player_ids: []
            };
            if (usuario != ride.usuario.id){
                if (ride.usuario.installationId) {
                    message.include_player_ids.push(ride.usuario.installationId);
                }
            }
            if (usuario != ride.caroneiro.id) {
                if (ride.caroneiro) {
                    if (ride.caroneiro.installationId) {
                        message.include_player_ids.push(ride.caroneiro.installationId);
                    }
                }
            }
            return OneSignal.sendNotification(message);
        });
    }

    public disponivelCarona(message: any, usuario: any, friends: any):Promise<any> {
        return Promise.resolve().then( () => {
            let message = {
                app_id: "c2523693-a3c2-4e32-946e-4c27657a05c1",
                contents: {
                    "en": "Seu amigo " + usuario.nome + " está disponível para carona!"
                },
                data: {
                    id: usuario.id,
                    picture: usuario.imagem,
                    name: usuario.nome,
                    type: 5
                },
                include_player_ids: []
            };
            let users = [];
            for (var i in friends) {
                if (usuario.sexo === 'male' && !friends[i].so_mulheres) {
                    users.push(friends[i]);
                } else if (usuario.sexo === 'female') {
                    users.push(friends[i]);
                }
            }
            for (let i in users) {
                //console.log(users[i]);
                //console.log(usuario.localizacao.lat, usuario.localizacao.lon, users[i].localizacao.lat, users[i].localizacao.lon);
                if (Distance.distLatLong(usuario.localizacao.lat, usuario.localizacao.lon, users[i].localizacao.lat, users[i].localizacao.lon)) {
                    let push = {
                        'message': message,
                        'usuario': users[i].id,
                        'data': new Date(),
                        'tipo': 5
                    }
                    this.save(push);
                    if (users[i].installationId) {
                        message.include_player_ids.push(users[i].installationId);
                    }
                }
            }
            return OneSignal.sendNotification(message);
        });
     }
}
