import * as Promise from 'bluebird';
import * as graph from 'fbgraph';

export default class FacebookAPI {

    public static graphGetUserData(accessToken: string): Promise<any> {
        return new Promise( (resolve, reject) => {
            graph.setAccessToken(accessToken);
            graph.get("me?fields=id,name,gender,email,picture.width(150).height(150)", (err, res) => {
                //that.log("Facebook","Validando toker informado");
                if(res != null && typeof(res) !== 'undefined' && typeof(res.error) !== 'undefined' && typeof(res.error.type) !== 'undefined' && res.error.type === 'OAuthException'){
                    //that.log("Graph","AccessToken inválido");
                    reject()
                    return;
                }
                if(err || !res || typeof(res.id) === 'undefined' || res == null) {
                    //that.log("Graph","Erro ou nenhum usuário encontrado.");
                    reject();
                    return;
                }
                let d1 = {
                    facebook_userID: res.id,
                    email: res.email,
                    accessToken: accessToken,
                    name: res.name,
                    picture: res.picture.data.url
                };
                resolve(res);
            });

        });
    }
    public static graphGetUserFriends(accessToken: string): Promise<any> {
        return new Promise( (resolve, reject) => {
            if (!accessToken) {
                reject();
                return;
            }
            graph.setAccessToken(accessToken);
            graph.get("me/friends?fields=picture.width(150).height(150),name&limit=5000", (err, res) => {
                let friends = res;
                if (err){
                    reject();
                    return;
                } else {
                    resolve(friends);
                    return;
                }
            });
        });
    }

    public static areFriends(accessToken: String, facebook_userID: String): Promise<any> {
        return new Promise( (resolve, reject) => {
            if (!accessToken) {
                reject();
                return;
            }
            graph.setAccessToken(accessToken);
            graph.get("me/friends/"+facebook_userID, (err, res) => {
                if(err || !res || typeof(res.data) === 'undefined' || res.data.length == 0) {
                    reject();
                    return;
                }
                resolve();
            });
        });
    }
}