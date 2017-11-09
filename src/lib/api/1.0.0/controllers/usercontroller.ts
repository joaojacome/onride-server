import * as Promise from 'bluebird';
import * as Express from "express";
import * as RethinkDB from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";
import Distance from "lib/util/distance";


export default class UserController {

    public router: Express.Router;
    public db: any;/* RethinkDB.Db */
    public models: any;

    constructor(db: any, models: any) {
        this.db = db;
        this.models = models;
    }

    public login(req, res) {
        let data = req.body;
        FacebookAPI.graphGetUserData(data.accessToken).then(me => {
            if (!data.installationId) data.installationId = "";
            let userData = {
                id: me.id,
                imagem: me.picture.data.url,
                picture: me.picture.data.url,
                nome: me.name,
                name: me.name,
                sexo: me.gender,
                gender: me.gender,
                localizacao: { 'lat': null, 'lon': null },
                accessToken: data.accessToken,
                data: new Date(),
                email: me.email ? me.email : null,
                installationId: data.installationId,
                settings: {
                    timeZone: ""
                },
                facebook: {
                    id: me.id,
                    accessToken: data.accessToken,
                },
                push: {
                    OneSignal: data.installationId
                }
            };
            this.models.User.login(userData).then( data => {
                return this.models.Group.updateFriends(userData);
            }).then( result => {
                res.send({ resposta: result });
            }).catch( error => {
                res.send({ 'invalid': true });
            })
        }).catch(err => {
            console.log(err);
            res.send({ invalid: true});
        });
    }
    
    public save_localizacao(req, res) {
        let data = req.body;
        this.models.User.saveLocalizacao(data.localizacao).then( response => {
            res.send({ resposta: response });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }
    public get_friends_list(req, res) {
        let data = req.body;
        //global.LOG("Friends", "Checking user data");
        data.id = res.locals.me.id;
        FacebookAPI.graphGetUserFriends(data.accessToken).then( res2 => {
            if (res2.data.length > 0) {
                let lista_amigos = [];
                let friends = res2;
                for (let i = 0; i < friends.data.length; i++) {
                    let v = friends.data[i];
                    let amigo = {
                        'facebook': v.id,
                        'picture': v.picture.data.url,
                        'name': v.name,
                        usuario: data.id
                    };
                    lista_amigos.push(amigo);
                }
                this.models.Group.updateFriends(data);
                res.send({ resposta: lista_amigos });
            } else {
                throw 1;
            }
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }  
    public so_mulheres(req, res) {
        let data = req.body;
        data.id = res.locals.me.id;
        this.models.User.updateSoMulheres(data).then( result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }


    public disponivel_carona(req, res) {
        let data = req.body;
        let user = res.locals.user;
        // global.LOG("Ride", "Checking user");
        let somulheres = false;
        if (user.so_mulheres) {
            somulheres = true;
        }
        this.models.Group.getAmigosByGrupoTodos(user.id, somulheres).then( friends => {
            return this.models.Push.disponivelCarona(user, friends);
        }).then( result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }
}