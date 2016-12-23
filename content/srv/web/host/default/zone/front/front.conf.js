var wf = WF();

var blog = require(wf.CONF['MAIN_PATH'] + "blog.conf.js");

var frontConf =
{
	'uri': 'front',
	'state': true,
	'pos': 0,
	'shared': '../../../../../../../theme/' + blog.theme + '/www',
	'cache': ['.js', '.css'] // '*' => cache all files
}

module.exports = frontConf;
