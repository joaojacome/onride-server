import * as Promise from 'bluebird';
import * as Express from "express";
import * as RethinkDB from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";

export default class RideController {

    public router: Express.Router;
    public db: any;/* RethinkDB.Db */
    public models: any;

    constructor(db: any, models: any) {
        this.db = db;
        this.models = models;
    }

    public lista_favoritos(req, res) {
        let data = req.body;
        //global.LOG("Favoritos", "consultando os favoritos");
        this.models.Favorite.getFavorites(data.id).then( favoritos => {
            res.send({
                resposta: favoritos
            });
        }).catch( err => {
            res.send({
                'invalid': true
            });
        })
    }

    
    public salva_favorito(req, res) {
        let data = req.body;
        //global.LOG("Favorite", "Checking user");
        this.models.Favorite.newFavorite(data.favorite).then(favoritos => {
            res.send({
                resposta: favoritos
            });
        }).catch( err =>{
           res.send({
             'invalid': true
           });
        })
    }


    public excluir_favorito(req, res) {
        let data = req.body;
        this.models.Favorite.excluirFavorito(data.favorito).then( result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }
}