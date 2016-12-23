var wf = WF();

var blog = require(wf.CONF['MAIN_PATH'] + "blog.conf.js");

var frontConf =
{
	'uri': 'front',
	'state': true,
	'pos': 0,
	'shared': '../../../../../../../theme/' + blog.theme + '/' + wf.CONF['DEFAULT_SHARED_FOLDER'],
	'cache': blog.cache // '*' => cache all files
}

module.exports = frontConf;
