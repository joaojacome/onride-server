import * as Promise from 'bluebird';
import * as Express from "express";
import * as RethinkDB from "rethinkdb";

import Logger from "lib/util/logger";

export default class RideController {

    public router: Express.Router;
    public db: any;/* RethinkDB.Db */
    public models: any;

    constructor(db: any, models: any) {
        this.db = db;
        this.models = models;
    }

    public my_ride_status(req, res) {
        this.models.Ride.getMyRide(res.locals.me).then( result => {
            res.send({
                resposta: result
            });
            //global.LOG("Ride", "Success on get ride");
        }).catch( err => {
            res.send({
                'invalid': true
            });
        });
    }   

    public resumo_carona(req, res) {
        this.models.Ride.resumoCaronaByUsuario(res.locals.me).then( result => {
            // global.LOG("Ride", "Success on get ride");
            res.send({
                resposta: result
            });
        }).catch( err => {
            res.send({
                'invalid': true
            });
        });
    }

    public follow_ride_friend(req, res) {
        let data = req.body;
        this.models.Ride.getRideById(data.ride.id).then(ride => {
            ride.caroneiro.localizacao = data.ride.caroneiro.localizacao;
            return this.models.Ride.updateCarona(ride);
        }).then(result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }

    public follow_ride_me(req, res) {
        let data = req.body;

        this.models.Ride.getRideById(data.ride.id).then( ride => {
            ride.usuario.localizacao = data.ride.usuario.localizacao;
            return this.models.Ride.updateCarona(ride);
        }).then( result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }

    public get_ride(req, res) {
        let data = req.body;
        // global.LOG("Ride", "Checking ride of user");
        this.models.Ride.getRideById(data.ride).then( response => {
            res.send({ resposta: response });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }

    public friend_accept_ride(req, res) {
        let data = req.body;
        // console.log(data);
        // global.LOG("Accept Ride", "Accept ride user");
        data.ride.status = 1;
        let statusVerificar = 0;
        this.models.Ride.updateCarona(data.ride, statusVerificar).then( result => {
            // global.LOG("Accept Ride", "Ride friend accept successfully");
            if (result) {
                this.models.Push.pushAceitaCarona(result).then( () => {
                    res.send({ resposta: result });
                }).catch( err => {
                    res.send({ 'invalid': true });
                });
            } else {
                res.send({ resposta: false });
            }
        }).catch( err => {
            res.send({ 'invalid': true });
        })
    }

    public concluir_my_ride(req, res) {
        let data = req.body;
        this.models.Ride.concluirRide(data.ride).then( result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }

    public confirma_my_ride(req, res) {
        let data = req.body;
        data.ride.status = 2;
        let statusVerificar = 1
        this.models.Ride.updateCarona(data.ride, statusVerificar).then( ride => {
            this.models.Push.pushConfirmaCarona(ride).then( () => {
                res.send({ resposta: ride });
            }).catch( err => {
                res.send({ 'invalid': true });
            });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }
    public cancela_carona(req, res) {
        let data = req.body;
        let ride = data.ride;
        if (data.ride) {
            let status = data.ride.status;
            ride.status = 4;
            this.models.Ride.updateCarona(ride).then( result => {
                // global.LOG("Ride", "Ride canceled successfully");
                this.models.Push.deleteRide(ride.id);
                res.send({ resposta: data });
                if (status > 0) {
                    this.models.Push.pushCancelaCarona(result, data.usuario);
                }
            }).catch( () => {
                res.send({ 'invalid': true });
            })
        } else {
            res.send({ resposta: true });
        }
    }
    public save_ride(req, res) {
        let data = req.body;
        let user = res.locals.user;
        // global.LOG("Ride", "Checking user");
        this.models.Ride.save(data).then( ride => {
            if (user.so_mulheres) {
                this.models.Group.getAmigosByGrupo(ride.grupo, true).then( friends => {
                    this.models.Push.pushNovaCarona(ride, friends).then( data => {
                        res.send({ resposta: data });
                    }).catch( error => {
                        res.send({ 'invalid': true });
                    });
                }).catch( err => {
                    res.send({ 'invalid': true });
                });
            } else {
                this.models.Group.getAmigosByGrupo(ride.grupo).then( friends => {
                    let users = [];
                    for (let i in friends) {
                        if (user.sexo === 'male' && !friends[i].so_mulheres) {
                            users.push(friends[i]);
                        } else if (user.sexo === 'female') {
                            users.push(friends[i]);
                        }
                    }
                    this.models.Push.pushNovaCarona(ride, users).then(data => {
                        res.send({ resposta: data });
                    }).catch( err => {
                        res.send({ 'invalid': true });
                    })
                }).catch( err => {
                    console.log('error aki 2')
                    res.send({ 'invalid': true });
                })
            }
        }).catch( err => {
            console.log('error aki')
            res.send({ 'invalid': true });
        });
    }
}