import * as Promise from 'bluebird';
import * as Express from "express";
import * as RethinkDB from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";


export default class GroupController {

    public router: Express.Router;
    public db: any;/* RethinkDB.Db */
    public models: any;

    constructor(db: any, models: any) {
        this.db = db;
        this.models = models;
    }

    public lista_groups(req, res) {
        let data = req.body;
        //global.LOG("Grupos", "Consultando grupos do usuário");
        data.id = data.user;
        this.models.Group.updateFriends(data).then( result => {
            return this.models.Group.getGrupos(result.id);
        }).then( groups => {
            res.send({
                resposta: groups
            });
        }).catch( err => {
            res.send({
                'invalid': true
            });
        });
    }
    public novo_grupo(req, res) {
        let data = req.body;
        this.models.Group.novoGrupo(data.grupo).then( result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }

    public editar_grupo(req, res) {
        let data = req.body;
        this.models.Group.editaGrupo(data.grupo).then( result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }
    public excluir_grupo(req, res) {
        let data = req.body;
        this.models.Group.excluirGrupo(data.grupo).then( result => {
            res.send({ resposta: result });
        }).catch( err => {
            res.send({ 'invalid': true });
        });
    }
}