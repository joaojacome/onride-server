//const r = require('rethinkdb');

export default class Logger {

    public static log(message: any, data?: any) {
        let currentdate = new Date();
        let datetime = "\x1b[33m[SERVER][" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + "] \x1b[36m";
        console.log(datetime+message);
    }
}
/*
exports = function(conn) {
    this.conn = conn;
    this.log = (where, message, data, severity, type) => {
        if (typeof(severity) === 'undefined') {
            severity = 0;
        }
        if (typeof(type) === 'undefined') {
            type = "notice";
        }
        if (typeof(data) === 'undefined' || data == null) {
            data = {};
        }
        if (global.CONFIG.DEBUG) {
            let datetime = "[" + currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + "] ";
            console.log(datetime + "[" + where + "] " + message + " - data: " + data);
        }
        if (severity >= global.CONFIG.LOG_SEVERITY) {
            //enviar para o banco
            r.table("logs").insert({
                server_id: global.CONFIG.SERVER_ID,
                severity: severity,
                date: r.now(),
                type: type,
                location: where,
                message: message,
                data: data
            }).run(conn);
            
        }
    }
    global.LOG = this.log;
}

module.exports = (conn) => {
    return new exports(conn);
}*/