import * as Promise from 'bluebird';
import * as Express from "express";
import * as RethinkDB from "rethinkdb";
import * as BodyParser from "body-parser";

import ControllerLoader from "./controller_loader";
import ModelLoader from "./model_loader";
import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";

export default class Routes {

    public router: Express.Router;
    public authenticatedRouter: Express.Router;
    public db: any;/* RethinkDB.Db */
    public controllers: any;
    public models: any;

    public static bootstrap(db: any): Routes {
        return new Routes(db);
    }

    constructor(db: any) {
        this.router = Express.Router();
        this.authenticatedRouter = Express.Router();
        this.db = db;
        this.models = ModelLoader.load(db);
        this.controllers = ControllerLoader.load(db, this.models);
        this.setupRoutes();
        this.setupAutheticatedRoutes();
    }
    public setupAutheticatedRoutes() {
        /** Authenticated Routes */
        this.authenticatedRouter
            .use(BodyParser.json())
            .use( (req, res, next) => {
                if(req.method == 'OPTIONS'){
                    next();
                    return;
                }
                let data = req.body;
                res.locals.data = data;
                //check if there's an access token
                if (!data || !data.accessToken) {
                    res.send({ 'invalid': true });
                    return;
                }
                FacebookAPI.graphGetUserData(data.accessToken).then( me => {
                    res.locals.me = me;
                    return this.models.User.getUser(me);
                }).then( user => {
                    res.locals.user = user;
                    next();
                }).catch( err => {
                    //send invalid
                    res.send({ 'invalid': true });
                });
            })
            .post('/lista_groups', (req, res) => { this.controllers.GroupController.lista_groups(req, res); })
            .post('/my_ride_status', (req, res) => { this.controllers.RideController.my_ride_status(req, res); })
            .post('/resumo_carona', (req, res) => { this.controllers.RideController.resumo_carona(req, res); })
            .post('/lista_favoritos', (req, res) => { this.controllers.FavoriteController.lista_favoritos(req, res); })
            .post('/salva_favorito', (req, res) => { this.controllers.FavoriteController.salva_favorito(req, res); })
            .post('/excluir_favorito', (req, res) => { this.controllers.FavoriteController.excluir_favorito(req, res); })
            .post('/save_ride', (req, res) => { this.controllers.RideController.save_ride(req, res); })
            .post('/disponivel_carona', (req, res) => { this.controllers.UserController.disponivel_carona(req, res); })
            .post('/cancela_carona', (req, res) => { this.controllers.RideController.cancela_carona(req, res); })
            .post('/save_localizacao', (req, res) => { this.controllers.UserController.save_localizacao(req, res); })
            .post('/avaliando_carona', (req, res) => { this.controllers.RatingController.avaliando_carona(req, res); })
            .post('/confirma_my_ride', (req, res) => { this.controllers.RideController.confirma_my_ride(req, res); })
            .post('/avaliacao_carona', (req, res) => { this.controllers.RatingController.avaliacao_carona(req, res); })
            .post('/concluir_my_ride', (req, res) => { this.controllers.RideController.concluir_my_ride(req, res); })
            .post('/get_ride', (req, res) => { this.controllers.RideController.get_ride(req, res); })
            .post('/friend_accept_ride', (req, res) => { this.controllers.RideController.friend_accept_ride(req, res); })
            .post('/follow_ride_friend', (req, res) => { this.controllers.RideController.follow_ride_friend(req, res); })
            .post('/so_mulheres', (req, res) => { this.controllers.UserController.so_mulheres(req, res); })
            .post('/avaliacao_caroneiro', (req, res) => { this.controllers.RatingController.avaliacao_caroneiro(req, res); })
            .post('/meus_push', (req, res) => { this.controllers.PushController.meus_push(req, res); })
            .post('/delete_push', (req, res) => { this.controllers.PushController.delete_push(req, res); })
            .post('/get_friends_list', (req, res) => { this.controllers.UserController.get_friends_list(req, res); })
            .post('/follow_ride_me', (req, res) => { this.controllers.RideController.follow_ride_me(req, res); })
            .post('/novo_grupo', (req, res) => { this.controllers.GroupController.novo_grupo(req, res); })
            .post('/editar_grupo', (req, res) => { this.controllers.GroupController.editar_grupo(req, res); })
            .post('/excluir_grupo', (req, res) => { this.controllers.GroupController.excluir_grupo(req, res); })
            .post('/excluir_push', (req, res) => { this.controllers.PushController.excluir_push(req, res); });
    }

    public setupRoutes() {
        this.router.post("/login", (req, res) => { this.controllers.UserController.login(req, res); });
    }
    
}