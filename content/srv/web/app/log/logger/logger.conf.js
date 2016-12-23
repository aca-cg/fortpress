var wf = WF();
var blog = require(wf.CONF['MAIN_PATH'] + "blog.conf.js");
console.log(blog.log);

var conf =
{
	state: blog.log // true/false , default is true if not set
}
module.exports = conf;
