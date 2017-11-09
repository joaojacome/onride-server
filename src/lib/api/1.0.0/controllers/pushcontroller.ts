import * as Promise from 'bluebird';
import * as Express from "express";
import * as RethinkDB from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";

export default class PushController {

    public router: Express.Router;
    public db: any;/* RethinkDB.Db */
    public models: any;

    constructor(db: any, models: any) {
        this.db = db;
        this.models = models;
    }


    public meus_push(req, res) {
        //global.LOG("Ride", "buscando avaliação da carona");
        this.models.Push.getMyPush(res.locals.me).then( result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        })
    }

    public delete_push(req, res) {
        let data = req.body;
        //global.LOG("Ride", "Buscando avaliação da carona");
        this.models.Push.deleteRide(data.ride).then( result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }
    public excluir_push(req, res) {
        let data = req.body;
        this.models.Push.delete(data.push.id).then(function(data) {
            res.send({ resposta: data });
        }).catch(function() {
            res.send({ 'invalid': true });
        })
       }
}