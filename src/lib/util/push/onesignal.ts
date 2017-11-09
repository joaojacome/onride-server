import * as Promise from 'bluebird';
import * as https from 'https';

import Logger from "lib/util/logger";

export default class OneSignal {
    public static sendNotification(data: any) {
        return new Promise( (resolve, reject) => {
            console.log("Enviando Notificacao");
            let headers = {
                "Content-Type": "application/json",
                "Authorization": "Basic XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            };

            let options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
            };
            try {
                let req = https.request(options, res => {
                    res.on('data', response => {
                        resolve();
                    });
                });

                req.on('error', e => {
                    console.log("ERROR:");
                    console.log(e);
                    reject();
                });

                req.write(JSON.stringify(data));
                req.end();
            } catch (err) {
                console.log("====ERRO====");
                console.log(err);
                reject();
            }
        });
    }
}