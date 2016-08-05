/*
 * This file is part of FortressJS - Fast, secure, powerful and simple I/O framework
 * Copyright (c) 2014-2016 Adrien THIERRY
 * http://fortressjs.com - http://seraum.com
 *
 * sources : https://github.com/seraum/fortressjs
 *
 * this program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * You can be released from the requirements of the license by purchasing
 * a commercial license. Buying such a license is mandatory as soon as you
 * develop commercial activities involving the FortressJS software without
 * disclosing the source code of your own applications. Visit http://seraum.com/
 * and feel free to contact us.
 *
 */

module.exports = new API01();

function API01()
{
  var VERSION = "0.1";
  this.version = "0.1";

  this.parse = function(parts)
  {
	  // SECURITY OBJECT FOR ACCESS
	  this.security = createSecurityObject(this.req);
	  var tokenError =
	  {
		  error: false,
		  message: "",
		  code: 0,
	  };
	  if(this.req.get !== undefined && this.req.get.token !== undefined)
	  {
		try
		{
			token = JSON.parse(UTILS.Crypto.decryptText(this.req.get.token));

			if(new Date(token.exp) < new Date())
			{
				tokenError.error = true;
				tokenError.code = 401;
				tokenError.message = "Expired Access TOKEN"
			}
			else
			{
				this.security.token = token;
				this.security.logged = true;
			}

		}
		catch(e){
			tokenError.error = true;
			tokenError.code = 400;
			tokenError.message = "Invalid Access TOKEN"
			}
	  }

	  if(tokenError.error === true)
	  {
		  this.error(tokenError.code, tokenError.message);
		  return;
	  }

      switch(parts[2])
      {
        case 'get':
          this.get(parts[3], parts[4]);
          break;
        case 'post':
          this.post(parts[3]);
          break;
        case 'put':
          this.put(parts[3]);
          break;
        case 'delete':
              this.delete(parts[3], parts[4]);
              break;
        case 'method':
          this.method(parts[3]);
          break;
            default:
              this.error(2, "undefined api selector");
              break;
      }

  }

  this.put = function(selector, verified)
  {
      var UPDATE = ["$push"];
    if(this.req.method != "PUT")
    {
       this.error(100, "bad method error");
    }
    else
    {
	  if(selector !== undefined && selector.length !== undefined && selector.length > 0 && this.req.HOST.MODELS[selector] !== undefined )
      {
		if(this.req.DB[this.DB] !== undefined)
		{
			var model = new this.req.HOST.MODELS[selector](true);
			model.link = this.req.DB[this.DB];
			model.method = "PUT";
			var uArr = {};
			if(model.rest !== undefined && model.rest === true  && (model.PUT === undefined || model.PUT === true) )
			{
				if(this.req.post === undefined)
				{
					this.error(202, "post data is empty");
				}
				else if(this.req.post.query === undefined)
				{
					this.error(203, "query data is empty");
				}
				else if(this.req.post.update === undefined)
				{
					this.error(204, "update data is empty");
				}
				else if(model.access === undefined || (typeof model.access == "function" && model.access(this.security, res)))
				{
                    if(!verified && model.verify && typeof model.verify == "function")
                    {
                        var ROOT = this;
                        model.verify(this.req, this.res, function(err)
                        {
                            if(!err)
                                ROOT.put(selector, true)
                            else
                                ROOT.error(err.code, err.message);
                        });
                    }
                    else
                    {
                        var res = this.res;
                        var req = this.req;
                        var version = this.version;
                        var success = this.success;
                        var error = this.error;

                        var query = {};
                        var update = {};

                        for(var u in this.req.post.update)
                        {
                            if(model.field[u] !== undefined && (model.field[u].private === undefined || model.field[u].private !== true) && this.req.post.update[u] !== undefined)
                            {
                                update[u] = this.req.post.update[u];
                                if(model.field[u].unique !== undefined && model.field[u].unique === true)
                                    uArr[u] = this.req.post.update[u];
                            }
                            else if(UPDATE.indexOf(u) > -1)
                            {
                                update[u] = this.req.post.update[u];
                            }
                        }

                        for(var q in this.req.post.query)
                        {
                            if(model.field[q] !== undefined && this.req.post.query[q] !== undefined)
                            {
                                query[q] = this.req.post.query[q];
                            }
                        }

                        var isRequired = false;
                        var requiredField = "";
                        for(var f in model.field)
                        {
                            if(model.field[f].require !== undefined && (model.field[f].require === true || model.field[f].require.indexOf('put') > -1 ) && update[f] === undefined)
                            {
                                isRequired = true;
                                requiredField = f;
                                break;
                            }
                        }
                        if(!isRequired)
                        {
                            if(Object.keys(update).length > 0)
                            {
                                // CHECK UNIQUE ENTRY
                                if(Object.keys(uArr).length > 0)
                                {
                                    var error = this.error;
                                    var success = this.success;
                                    var yes = function(err, data)
                                    {
										model.query = query;
										model.data = update;
										model.cb = function(err, data)
										{
											if(err)
											{
												error(10, err.message, res, version);
											}
											else
											{
												data = sanitData(data, model.sanitize);
												success("put", data , res, version);
											}
										}
										model.Update();

                                    };

                                    var no = function(err, data)
                                    {
                                        error(22, "Duplicate entry : " + req.DUPLICATE, res, version);
                                    }
                                    uniqueCB(this, this.req, selector, uArr, yes, no);
                                }
                                else
                                {
									model.query = query;
									model.data = update;

									model.cb = function(err, data)
									{
										if(err)
										{
											error(10, err.message, res, version);
										}
										else
										{
											data = sanitData(data, model.sanitize);
											success("put", data , res, version);
										}
									}
									model.Update();
                                }
                            }
                            else
                            {
                                this.error(23, "No valid put data");
                            }
                        }
                        else
                        {
                            this.error(22, "Field is required : [ " + requiredField + " ]");
                        }
                    }
				}
				else
				{
					this.error(300, "put access  error");
				}

			}
			else
			{
				this.error(200, "PUT method forbidden");
			}
		}
		else
		{
			this.error(21, "DB not initialised");
		}

      }
      else
      {
         this.error(2, "undefined or empty put selector");
      }
    }
  }

  this.post = function(selector, verified)
  {
      if(!verified) verified = false;
    if(this.req.method != "POST")
    {
       this.error(100, "bad method error");
    }
    else
    {
      if(selector !== undefined && selector.length !== undefined && selector.length > 0 && this.req.HOST.MODELS[selector] !== undefined)
      {
		if(this.req.DB[this.DB] !== undefined)
		{
			var model = new this.req.HOST.MODELS[selector]();
			model.link = this.req.DB[this.DB];
			model.method = "POST";
			var uArr = {};

			if(this.req.post === undefined)
			{
				this.error(202, "post data is empty");
			}
			else if(this.req.post.query === undefined)
			{
				this.error(203, "post query data is empty");
			}
			else if(model.rest !== undefined && model.rest && (model.POST === undefined || model.POST === true) )
			{
				if(model.access === undefined || (typeof model.access == "function" && model.access(this.security)))
				{
                    if(!verified && model.verify && typeof model.verify == "function")
                    {
                        var ROOT = this;
                        model.verify(this.req, this.res, function(err)
                        {
                            if(!err)
                                ROOT.post(selector, true)
                            else
                                ROOT.error(err.code, err.message);
                        });
                    }
                    else
                    {

                        var res = this.res;
                        var req = this.req;
                        var version = this.version;
                        var success = this.success;
                        var error = this.error;

                        // LOAD UNIQUE VALUE
                        //for(var q in this.req.post.query)
                        for(var q in model.field)
                        {
                            if(model.field[q] !== undefined && (model.field[q].private === undefined || model.field[q].private !== true))
                            {
                                if(this.req.post.query[q] != undefined)
                                {
                                  model.data[q] = this.req.post.query[q];
                                }
                                if(model.field[q].unique !== undefined && model.field[q].unique === true && model.data[q] != undefined)
                                {
                                    uArr[q] = model.data[q];
                                }
                            }
                        }
                        var isRequired = false;
                        var requiredField = "";
                        for(var f in model.field)
                        {
                            if(model.field[f].require !== undefined && (model.field[f].require === true || model.field[f].require.indexOf('post') > -1 ) && model.data[f] === undefined)
                            {
                                isRequired = true;
                                requiredField = f;
                                break;
                            }
                        }
                        if(!isRequired)
                        {
                            if(Object.keys(model.data).length > 0)
                            {
                                // CHECK UNIQUE ENTRY
                                if(Object.keys(uArr).length > 0)
                                {
                                    var error = this.error;
                                    var success = this.success;
                                    var yes = function(err, data)
                                    {
                                        model.cb = function(err, data)
                                        {
                                            if(err)
                                            {
                                                error(10, err.message, res, version);
                                            }
                                            else
                                            {
                                                data = sanitData(data, model.sanitize);
                                                if(!model.postSuccess)
                                                {
													var length = 0;
													if(data && data.length) length = data.length;
                                                   success("post", data, res, version);
                                                }
                                                else model.postSuccess(req, res, data, version)
                                            }
                                        }
                                        model.Save();

                                    };

                                    var no = function(err, data)
                                    {
                                        error(22, "Duplicate entry : " + req.DUPLICATE, res, version);
                                    }
                                    uniqueCB(this, this.req, selector, uArr, yes, no);
                                }
                                else
                                {
                                    // SAVE ENTRY
                                    model.cb = function(err, data)
                                    {
                                        if(err)
                                        {
                                            error(10, err.message, res, version);
                                        }
                                        else
                                        {
                                            data = sanitData(data, model.sanitize);
											var dLength = 0;
											if(data && data.length) dLength = data.length;
                                            if(!model.postSuccess)
                                            {
                                               success("post", data, res, version);
                                            }
                                            else model.postSuccess(req, res, data, version)
                                        }
                                    };
                                    model.Save();
                                }
                            }
                            else
                            {
                                this.error(21, "No valid post data");
                            }
                        }
                        else
                        {
                            this.error(22, "Field is required : [ " + requiredField + " ]");
                        }
                    }
				}
				else
				{
					this.error(300, "post access error");
				}

			}
			else
			{
				this.error(201, "POST method forbidden");
			}
		}
		else
		{
			this.error(21, "DB not initialised");
		}
      }
      else
      {
         this.error(2, "undefined or empty post selector");
      }
    }
  }

  this.get = function(selector, query, verified)
  {
    if(!verified) verified = false;
    var OPTION = ["options"];
    if(this.req.method != "GET")
    {
       this.error(100, "bad method error");
    }
    else
    {
      if(selector !== undefined && selector.length !== undefined && selector.length > 0)
      {
        if(this.req.HOST.MODELS[selector] !== undefined)
		{
			if(this.req.DB[this.DB] !== undefined)
			{
				var model = new this.req.HOST.MODELS[selector](true);
				model.link = this.req.DB[this.DB];
				model.method = "GET";
				if(model.rest !== undefined && model.rest && (model.GET === undefined || model.GET === true) )
				{
					if(model.access === undefined || (typeof model.access == "function" && model.access(this.security)))
					{
                        if(!verified && model.verify && typeof model.verify == "function")
                        {
                            var ROOT = this;
                            model.verify(this.req, this.res, function(err)
                            {
                                if(!err)
                                    ROOT.get(selector, query, true)
                                else
                                    ROOT.error(err.code, err.message);
                            });
                        }
                        else
                        {
                            var qArr = this.parseQuery(query);
                            var option = this.parseOption(query);

                            if(this.req.get.option)
                            {
                                for(var go in this.req.get.option)
                                {
                                    option[go] = this.req.get.option[go];
                                }
                            }
                            var res = this.res;
                            var req = this.req;

							if(req.get.query)
                            {
                                for(var r in req.get.query)
                                {
                                    qArr[r] = req.get.query[r]
                                }
                            }

                            if(this.security.get.query)
                            {
                                for(var r in this.security.get.query)
                                {
                                    qArr[r] = this.security.get.query[r]
                                }
                            }

                            var version = this.version;
                            var success = this.success;
                            var error = this.error;

                            for(var q in qArr)
                            {
                                if(model.field[q] !== undefined && qArr[q] !== undefined)
                                {
                                    switch(q)
                                    {

                                        default:
                                            model.data[q] = qArr[q];
                                            break;
                                    }
                                }
                            }

                            for(var o in option)
                            {
                                if(OPTION.indexOf(o) > -1)
                                {
                                    if(!model[o]) model[o] = {};
                                    for(var v in option[o])
                                    {
                                        try
                                        {
                                            switch(v)
                                            {
                                                case "skip":
                                                case "limit":
                                                    model[o][v] = parseInt(option[o][v]);
                                                    break;
                                                case "sort":
                                                    model[o][v] = option[o][v];
                                                    for(var z in model[o][v])
                                                    {
                                                        model[o][v][z] = parseInt(model[o][v][z])
                                                    }
                                                    break;
                                                default:
                                                    model[o][v] = option[o][v];
                                                    break;
                                            }
                                        }catch(e){}

                                    }

                                }
                            }

                            var isRequired = false;
                            var requiredField = "";
                            for(var f in model.field)
                            {
                                if(model.field[f].require !== undefined && (model.field[f].require === true || model.field[f].require.indexOf('get') > -1 ) && model.data[f] === undefined)
                                {
                                    isRequired = true;
                                    requiredField = f;
                                    break;
                                }
                            }

                            if(!isRequired)
                            {
                                model.cb = function(err, data)
                                {
                                    if(err)
                                    {
                                        error(10, err.message, res, version);
                                    }
                                    else
                                    {
                                        data = sanitData(data, model.sanitize);
                                        switch(req.get.action)
                                        {
                                            case "count":
                                                if(!model.getSuccess)
                                                   success("get", data.length, res);
                                                else model.getSuccess(req, res, data.length, version)
                                                break;
                                            default:
                                                if(!model.getSuccess)
                                                   success("get", data, res);
                                                else model.getSuccess(req, res, data, version)
                                                break;
                                        }
                                    }
                                };
                                model.Find();
                            }
                            else
                            {
                                this.error(22, "Field is required : [ " + requiredField + " ]");
                            }
                        }

					}
					else
					{
						this.error(300, "GET access error");
					}
				}
				else
				{
					this.error(201, "GET method forbidden");
				}
			}
			else
			{
				this.error(21, "DB not initialised");
			}
		}
		else
		{
			this.error(21, "unknown get selector");
		}
      }
      else
      {
         this.error(2, "undefined or empty get selector");
      }
    }
  }

  this.delete = function(selector, query, verified)
  {
      if(!verified) verified = false;
    if(this.req.method != "DELETE")
    {
       this.error(100, "bad method error");
    }
    else
    {
      if(selector !== undefined && selector.length !== undefined && selector.length > 0)
      {
        if(this.req.HOST.MODELS[selector] !== undefined)
		{
			if(this.req.DB[this.DB] !== undefined)
			{
				var model = new this.req.HOST.MODELS[selector](true);
				model.link = this.req.DB[this.DB];
				model.method = "DELETE";
				if(model.rest !== undefined && model.rest && (model.DELETE === undefined || model.DELETE === true) )
				{
					if(model.access === undefined || (typeof model.access == "function" && model.access(this.security)))
					{
                        if(!verified && model.verify && typeof model.verify == "function")
                        {
                            var ROOT = this;
                            model.verify(this.req, this.res, function(err)
                            {
                                if(!err)
                                    ROOT.delete(selector, query, true)
                                else
                                    ROOT.error(err.code, err.message);
                            });
                        }
                        else
                        {
                            var qArr = this.parseQuery(query);
                            var req = this.req;
                            var res = this.res;
                            if(req.get.query)
                            {
                                for(var r in req.get.query)
                                {
                                    qArr[r] = req.get.query[r]
                                }
                            }
                            var version = this.version;
                            var success = this.success;
                            var error = this.error;

                            for(var q in qArr)
                            {
                                if(model.field[q] !== undefined && qArr[q] !== undefined)
                                {
                                    switch(q)
                                    {

                                        default:
                                            model.data[q] = qArr[q];
                                            break;
                                    }
                                }
                            }

                            if(Object.keys(model.data).length > 0)
                            {
                                var isRequired = false;
                                var requiredField = "";
                                for(var f in model.field)
                                {
                                    if(model.field[f].require !== undefined && (model.field[f].require === true || model.field[f].require.indexOf('delete') > -1 ) && model.data[f] === undefined)
                                    {
                                        isRequired = true;
                                        requiredField = f;
                                        break;
                                    }
                                }
                                if(!isRequired)
                                {
                                    model.cb = function(err, data)
                                    {
                                        if(err)
                                        {
                                            error(10, err.message, res, version);
                                        }
                                        else
                                        {
                                            data = sanitData(data, model.sanitize);

                                            if(!model.deleteSuccess)
                                                   success("delete", data, res);
                                            else model.deleteSuccess(req, res, data, version)
                                        }
                                    };
                                    model.Delete();
                                }
                                else
                                {
                                    this.error(22, "Field is required : [ " + requiredField + " ]");
                                }
                            }
                            else
                            {
                                this.error(200, "No DELETE data");
                            }
                        }
					}
					else
					{
						this.error(300, "delete access error");
					}
				}
				else
				{
					this.error(201, "DELETE method forbidden");
				}
			}
			else
			{
				this.error(21, "DB not initialised");
			}
		}
		else
		{
			this.error(21, "unknown DELETE selector");
		}
      }
      else
      {
         this.error(2, "undefined or empty DELETE selector");
      }
    }
  }

   // PERMET DE DETERMINER LES METHODES VALABLES POUR UN MODEL
  this.method = function(selector, query)
  {
    if(this.req.method != "GET")
    {
       this.error(100, "bad method error");
    }
    else
    {
      if(selector !== undefined && selector.length !== undefined && selector.length > 0)
      {
        if(this.req.HOST.MODELS[selector] !== undefined)
		{
			if(this.req.DB[this.DB] !== undefined)
			{
				var model = new this.req.HOST.MODELS[selector]();
				model.link = this.req.DB[this.DB];
				model.empty = true;
				model.method = "METHOD";
				if(model.rest !== undefined && model.rest  )
				{
					// ON LISTE TOUTES LES METHOD POSSIBLES
					var mlist = [ "GET", "POST", "PUT", "DELETE"]
					var data = [];
					var mi = mlist.length;
					for(var i = 0; i < mi; i++)
					{
						if(model[mlist[i]] === undefined || model[mlist[i]] === true)
							data.push(mlist[i]);
					}
					this.success("method", data, this.res);
				}
				else
				{
					this.error(200, "Unknown method selector");
				}
			}
			else
			{
				this.error(21, "DB not initialised");
			}
		}
		else
		{
			this.error(21, "Unknown method selector");
		}
      }
      else
      {
         this.error(2, "undefined or empty method selector");
      }
    }
  }

  function createSecurityObject(req)
  {
	 var security =
	 {
          method: req.method,
          apiRight: req.apiRight,
          userRight: req.userRight,
          apiUser: req.apiUser,
		  header: req.headers,
		  get: req.get,
		  post: req.post,
		  cookie: req.cookie,
          userCookie: req.userCookie,
		  rawUrl: req.rawUrl,
		  remoteAddress: req.connection.remoteAddress,
		  httpVersion: req.httpVersion,
		  logged: false,
		  token: {},
	  };

	  return security;
  }

  function sanitData(data, modifier)
  {
		 /*
		   modifier : { _id:"id", access:null, search:null }
		  */


		if(data === undefined || data === null) return data;

		var j = data.length;
		for(var i = 0; i < j; i++)
		{
		  for(var m in modifier)
		  {
			if(data[i] !== undefined && data[i][m] !== undefined)
			{
			  if(modifier[m] == null)
			  {
				 delete data[i][m];
			  }
			  else
			  {
				data[i][modifier[m]] = data[i][m];
				delete data[i][m];
			  }
			}
		  }
		}

		return data;
	}

  this.parseOption = function(query)
  {
      var res = {};
	  if(query === undefined) return res;
	  var pqa = query.split(';');
	  var pL = pqa.length;
	  for(var i = 0; i < pL; i++)
	  {
		  if(pqa[i] !== undefined)
		  {
			var tmpQ = pqa[i].split(':');
			if(tmpQ !== undefined && tmpQ.length > 0 && tmpQ[0] !== undefined && tmpQ[0].length > 0)
			{
                if(tmpQ[0].indexOf('.') > -1)
                {
                    var tmpO = tmpQ[0].split('.');
                    if(!res[tmpO[0]]) res[tmpO[0]] = {};
                    if(tmpQ[1] && tmpQ[1].indexOf('=') > -1)
                    {
                        var tmpV = tmpQ[1].split('=');
                        res[tmpO[0]][tmpO[1]] = {};
                        res[tmpO[0]][tmpO[1]][tmpV[0]] = tmpV[1];
                    }
                    else res[tmpO[0]][tmpO[1]] = tmpQ[1];
                }
			}
		  }
	  }
	  return res;
  }

  this.parseQuery = function(query)
  {
	  // _id:1111111111;name:aaa;age:10;
	  var res = {};
	  if(query === undefined) return res;
	  query = unescape(query);
	  var pqa = query.split(';');
	  var pL = pqa.length;
	  for(var i = 0; i < pL; i++)
	  {
		  if(pqa[i] !== undefined)
		  {
			var tmpQ = pqa[i].split(':');
			if(tmpQ !== undefined && tmpQ.length > 0 && tmpQ[0] !== undefined && tmpQ[0].length > 0)
			{
                if(tmpQ[0].indexOf['.'] > -1)
                {
                    var tmpO = tmpQ[0].split['.'];
                    if(!res[tmpO[0]]) res[tmpO[0]] = {};
                    if(tmpQ[1] && tmpQ[1].indexOf('=') > -1)
                    {
                        var tmpD = tmpQ[1].split('=');
                        res[tmpO[0]][tmpO[1]] = {};
                        res[tmpO[0]][tmpO[1]][tmpD[0]] = tmpD[1];
                    }
                    else res[tmpO[0]][tmpO[1]] = tmpQ[1];
                }
				else if(tmpQ[0] !== undefined && tmpQ[0].length > 0 && tmpQ[1] !== undefined && tmpQ[1].length > 0)
				{
                    if(tmpQ[1] && tmpQ[1].indexOf('=') > -1)
                    {
                        var tmpD = tmpQ[1].split('=');
                        res[tmpQ[0]] = {};
                        res[tmpQ[0]][tmpD[0]] = tmpD[1];
                    }
					else res[tmpQ[0]] = tmpQ[1];
				}

			}
		  }
	  }
	  return res;
  }

	// SEND API SUCCESS
	this.success = function(type, data, res, version)
	{
        if(data == undefined) data = [];
		if(res === undefined) res = this.res;
		if(version === undefined) version = VERSION;
		var checksum = UTILS.Crypto.createMD5(JSON.stringify(data));
		var s =
		{
			"status": "success",
			"version": version,
			"datetime": new Date(),
			"code": 0,
			"message" : type + " api success",
			"checksum": checksum,
			"data": data,
        }
		res.end(JSON.stringify(s));
	}

	//SEND API ERROR
	this.error = function(code, msg, res, version)
	{
	  if(res === undefined) res = this.res;
	  if(version === undefined) version = this.version;

	  var err =
	  {
			"status": "error",
			"version": version,
			"datetime": new Date(),
			"code": code,
			"message" : msg,
        }
	  res.end(JSON.stringify(err));
	}

	function uniqueCB(self, req, selector, data, yes, no, value)
	{
		if(value === undefined) value = false;
		if(value === true) { no(); return; }// VALUE IS NOT UNIQUE
		else if(Object.keys(data).length === 0) { yes(); return ; }// VALUE IS UNIQUE

		var cbReq = req;
		var cbSelector = selector;
		var cbData = data;
		var cbYes = yes;
		var cbNo = no;
		var cbValue = value;

		var model = new req.HOST.MODELS[selector](true);

		model.link = req.DB[self.DB];
		model.empty = true;
		model.method = "NONE";
		for(var d in cbData)
		{
			req.DUPLICATE = "[ " + d + " -> " + data[d] + " ]";
			var cb = function(err, data)
			{
				var cbvalue = false;
				if(err === null && data.length > 0)
				{
					cbvalue = true;
				}
				uniqueCB(self, cbReq, cbSelector, cbData, cbYes, cbNo, cbvalue);
			}

			model.cb = cb;
			model.data[d] = cbData[d];
			delete cbData[d];
			model.Find();

			break;
		}
	}

}

/*
                  error :
                  0 : no error
                  1 : undefined version
                  2 : undefined selector
				  21 : unknown selector
                  3 : selector empty
                  4 : post empty

                100: bad http method
				200: DB note initialised
				201: DB error

                */

				/*

					UNIQUE :
					si un champs d'un model a la valeur "unique" à true, alors il y a aura une pré-requête pour valider que cette valeur est unique
					yes = callback si valeur n'existe pas
					no = callback si valeur existe déjà

				*/
