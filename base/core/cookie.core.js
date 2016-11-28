// VIRER DOMAIN ET LE REMPLACER PAR REQ.HOST

module.exports = new Cookie();
UTILS.Cookie = new Cookie();
var wf = WF();


function Cookie()
{
	this.Set = function(res, cArr)
	{
    var tmp = "";
    if(cArr !== undefined)
    {
      for(var c in cArr)
      {
        if(cArr[c].value !== undefined)
          tmp += c + '=' + cArr[c].value + '; ';
        else tmp += ' ' + c + ' ';

      }
    }
		res.setHeader( 'Set-Cookie', [tmp] );
	}

  this.Create = function(req, secret, ckey, key, value, exp) // expire en sec
  {
    // BROWSER_HEADER
    // REMOTE_IP
    // COOKIE_KEY
    // COOKIE_IV
    // USER_ID
    // EXPIRE
    if(exp == undefined) exp = 1000 * 60 * 60 * 24;
    var date = new Date();
    date.setTime(date.getTime()+(exp));
    var head = req.headers['user-agent'];
    var ip = req.socket.remoteAddress;
    var exp = date.getTime();
    var iv = wf.Crypto.randomString(wf.Crypto.randomInt(3, 5));
    var ck = ckey;

    var cookie = {

      "header": head,
      "ip": ip,
      "iv": iv,
      "key": ck,
      "data": value,
      "expire": exp,

    };
      var sig = wf.Crypto.createMD5(JSON.stringify(cookie));
      cookie.sig = sig;

    var cArr = {};
    cArr[key] = { "value": wf.Crypto.encryptText(JSON.stringify(cookie), secret) }
    cArr['Expires'] = { "value": date.toGMTString() }
    cArr['Path'] = { "value": wf.CONF['COOKIE_PATH'] }
	if(wf.CONF['COOKIE_HTTPONLY'] !== undefined && wf.CONF['COOKIE_HTTPONLY']) cArr['HttpOnly'] = { 'value': wf.CONF['COOKIE_HTTPONLY'] };
	if(wf.CONF['COOKIE_SECURE'] !== undefined && wf.CONF['COOKIE_SECURE']) cArr['secure'] = { 'value': wf.CONF['COOKIE_SECURE'] };
	if(wf.CONF['COOKIE_DOMAIN'] !== undefined) cArr['domain'] = { 'value': wf.CONF['COOKIE_DOMAIN'] };

    return cArr;

  }

  this.Get = function(req, secret, key)
  {
    var ret = {};
    if(req.cookie !== undefined && req.cookie[key] !== undefined)
    {

		var dec = wf.Crypto.decryptText(req.cookie[key], secret);
		if(dec !== undefined)
		{
			try
			{
				ret = JSON.parse(dec);
			}
			catch(e){};
		}
    }
    return ret;
  }

  this.Check = function(req, cookie, ckey, IP)
  {
      if(IP == undefined) IP = true;
	  var date = new Date().getTime();
	  if(req !== undefined && cookie !== undefined && cookie.key !== undefined && cookie.expire !== undefined && cookie.ip !== undefined && cookie.header !== undefined && cookie.sig !== undefined)
	  {
          var test =
            {
                  "header": cookie.header,
                  "ip": cookie.ip,
                  "iv": cookie.iv,
                  "key": cookie.key,
                  "data": cookie.data,
                  "expire": cookie.expire,
            }
          var sig = wf.Crypto.createMD5(JSON.stringify(test));
          if(cookie.sig == sig)
          {
              if(cookie.key === ckey)
              {
                  var ed = cookie.expire;
                  if(ed > date)
                  {
                      if(!IP || (IP && req.socket.remoteAddress == cookie.ip))
                      {
                          if(!IP || (IP && cookie.header == req.headers['user-agent']))
                          {
                            return true;
                          }
                      }
                  }
              }
          }
	  }
	  return false;
  }

  this.Delete = function(res, key)
  {

    var date = new Date();
    date.setTime(date.getTime() - (10000 * 1000));

    var cArr = {};
    cArr[key] = {
      "value": "deleted",
    }
    cArr['Expires'] = {
      "value": date.toGMTString(),
    }
    //cArr['Domain'] = { 'value': req.host }
    cArr['Path'] = {
      "value": '/',
    }
    cArr['HttpOnly'] = { }

    UTILS.Cookie.Set(res, cArr);

  }
}
