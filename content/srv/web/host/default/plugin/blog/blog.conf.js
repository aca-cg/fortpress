var wf = WF();
var blog = require(wf.CONF['MAIN_PATH'] + "blog.conf.js");

blog.post_folder = blog.post_folder.replace("__CONTENT_PATH__", wf.CONF['CONTENT_PATH']);
blog.post_folder = blog.post_folder.replace("__MAIN_PATH__", wf.CONF['MAIN_PATH']);

var blogConf=
	{
		"state": true,
		"pos": 10,
		"hook": "route",
		"blog": blog,
	}
module.exports = blogConf;
