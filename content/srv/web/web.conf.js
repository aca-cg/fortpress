var wf = WF();

var blog = require(wf.CONF['MAIN_PATH'] + "blog.conf.js");
var webConf=
{
    "state": true, // true | false, default is true
    "type": "http", // "http", "net", ... see base/server/
    "name": "Webserver", // Server name
    "port": {"http": blog.port}, // { "http": 80, "http2":81 }
    "thread": blog.thread, // int value or os.cpus().length
    "engine":
    {
      "http-start": {at: "start"},
      "http-data": {at: "start"},
      "http-zone": {at: "start"},
      "http-page": {at: "start"},
      "http-default": { at: "default"},
      "http-route": {at: "route"},
      "http-error": {at: "error"}
    },
    "map": ["start", "app", "default", "route", "error" ] // Order app/engine launching map
}
module.exports = webConf;
