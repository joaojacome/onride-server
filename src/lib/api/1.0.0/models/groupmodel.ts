import * as Promise from 'bluebird';
import * as r from "rethinkdb";

import Logger from "lib/util/logger";
import FacebookAPI from "lib/util/facebook";
export default class GroupModel {

    public tableName: string = "grupo";
    public table:r.Table;
    public db: any;

    constructor(db: any) {
        this.db = db;
        this.table = r.table(this.tableName);
    }


    public updateFriends(data: any):Promise<any> {
       //global.LOG("Friends", "Checking user data");
       return new Promise( (resolve, reject) => {
        FacebookAPI.graphGetUserFriends(data.accessToken).then( res => {
            let lista_amigos = [];
            let friends = res;
            for (let i = 0; i < friends.data.length; i++) {
                let v = friends.data[i];
                //console.log(v.name);
                let amigo = {
                    'id': v.id + data.id,
                    'amigo': v.id,
                    'imagem': v.picture.data.url,
                    'nome': v.name
                };
                lista_amigos.push(amigo);
            }
            this.updateGroups(data.id, lista_amigos).then( result => {
                //global.LOG("Amigos", "Atualizando a lista de amigos ");
                resolve(data);
            }).catch( error => {
                //console.log(error);
                reject();
                //global.LOG("Amigos", "Error ao atualizando a lista de amigos" + error);
            })
        });
       });
    }

    public updateGroups(user: any, friends: any):Promise<any> {
        return new Promise( (resolve, reject) => {
            let group = {
                'amigos': friends,
                data: r.now()
            };
            this.table
                .filter(r.row("usuario").eq(user).and(r.row("tipo").eq(0)))
                .update(group, { returnChanges: true })
                .run(this.db)
                .then( result => {
                    resolve();
                })
                .catch( err => {
                    throw err;
                });
       });
    }
    public getGrupos(usuario) {
        return new Promise( (resolve, reject) => {
            this.table.filter({ 'usuario': usuario }).run(this.db).then( result => {
                let rows = [];
                result.each( (err, row) => {
                    rows.push(row);
                }, () => {
                    resolve(false)
                });
                resolve(rows);
            }).catch( err => {
                reject();
            });
        });
    }
    public getAmigosByGrupo(grupo, female) {
        return new Promise( (resolve, reject) => {
            this.table.filter({ 'id': grupo }).run(this.db).then( result => {
                let usuarios = [];
                result.each( (err, row) => {
                    usuarios = row.amigos;
                    let ids = [];
                    for (let i = 0; i < usuarios.length; i++) {
                        let usuario = usuarios[i].amigo;
                        ids.push(usuario);
                    }
                    r.table('usuario').filter( (doc) => {
                        return r.expr(ids).contains(doc('id'))
                    }).run(this.db).then( resultado => {
                        //console.log('estou aki para vcs 3')
                        usuarios = [];
                        try {
                            resultado.each( (errr, roww) => {
                                if (female) {
                                    if (roww.sexo === 'female') {
                                        usuarios.push(roww);
                                    }
                                } else {
                                    usuarios.push(roww);
                                }
                            }, () => {
                                resolve(usuarios)
                            });
                        } catch (err) {
                            //console.log(err.message)
                            reject();
                        }
                    }).catch( err => {
                        reject();
                    });
                });
            }).catch( err => {
                reject();
            });
        })
    }

    public getAmigosByGrupoTodos(user, female) {
        return new Promise( (resolve, reject) => {
            this.table.filter({ 'tipo': 0, 'usuario': user }).run(this.db).then( result => {
                let usuarios = [];
                result.each( (err, row) => {
                    usuarios = row.amigos;
                    let ids = [];
                    if( usuarios ){
                        for (let i = 0; i < usuarios.length; i++) {
                            let usuario = usuarios[i].amigo;
                            ids.push(usuario);
                        }
                    }
                    r.table('usuario').filter( doc => {
                        return r.expr(ids).contains(doc('id'));
                    }).run(this.db).then( result => {
                        usuarios =   [];
                        result.each( (err, row) => {
                            if (female) {
                                if (row.sexo === 'female') {
                                    usuarios.push(row);
                                }
                            } else {
                                usuarios.push(row);
                            }
                        }, () => {
                            resolve(usuarios)
                        });
                    }).catch( err => {
                        reject();
                    });
                });
            }).catch( err => {
                reject();
            });
        });
    }

    public atualizaGrupo(usuario, amigos) {
        return new Promise( (resolve, reject) => {
            let grupo = {
                'amigos': amigos,
                data: new Date()
            };
            this.table.filter(r.row("usuario").eq(usuario).and(r.row("tipo").eq(0))).update(grupo, { returnChanges: true }).run(this.db).then( results => {
                resolve();
            }).catch( err => {
                reject();
            });
        });
        
    }


    public novoGrupo(grupo) {
        return new Promise( (resolve, reject) => {
            this.table.insert(grupo, { returnChanges: true }).run(this.db).then( result => {
                resolve();
            }).catch( err => {
                reject();
            });
        });
        
    }

    public editaGrupo(grupo) {
        return new Promise( (resolve, reject) => {
            //console.log( grupo.id );
            this.table.get(grupo.id).update(grupo, { returnChanges: true }).run(this.db).then( result => {
                resolve();
            }).catch( err => {
                reject();
            });
        });
        
    }

    public excluirGrupo(grupo) {
        return new Promise( (resolve, reject) => {
            this.table.get(grupo.id).delete().run(this.db).then( result => {
                resolve();
            }).catch( err => {
                reject();
            })
        });
        
    }

    
}






