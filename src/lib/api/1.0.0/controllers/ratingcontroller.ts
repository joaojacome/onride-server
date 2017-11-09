import * as Promise from 'bluebird';
import * as Express from "express";
import * as RethinkDB from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";

export default class RatingController {

    public router: Express.Router;
    public db: any;/* RethinkDB.Db */
    public models: any;

    constructor(db: any, models: any) {
        this.db = db;
        this.models = models;
    }

    public avaliando_carona(req, res) {
        let data = req.body;
        this.models.Ride.updateCarona(data.ride, 3).then( response => {
            res.send({ resposta: response });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }
    public avaliacao_caroneiro(req, res) {
        let data = req.body;
        // global.LOG("Ride", "buscando avaliação da carona");
        this.models.Rating.getAvaliacao(1).then( data => {
            res.send({ resposta: data });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }

    
    public avaliacao_carona(req, res) {
        let data = req.body;
        // global.LOG("Ride", "buscando avaliação da carona");
        this.models.Rating.getAvaliacao(0).then( result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }
}