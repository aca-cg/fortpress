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

module.exports = RESTAPI;
var UAPI = "api";

function RESTAPI(hostConf)
{
	var V01 = new require('./lib/v01.js');
	this.code = function(req, res)
	{
		if(req.DB == undefined) return;
		var root = "/";
		var uri = req.url.replace(root, "");

		var parts = uri.split('/');
        if(parts[4])
        {
            var endParts = parts.splice(4).join("/");
            parts[4] = endParts;
        }
		if(parts[0] !== undefined && parts[0] == UAPI)
		{
            var error = function(code, msg, version)
            {
                res.end('{ "result": { "status": "error", "version": "' + version + '", "code": ' + code + ', "message": "' + msg + '" } }');
            }

			req.continue = false;

			  if(parts[1] !== undefined)
			  {
				switch(parts[1])
				{
				  case "0.1":
				    V01.DB = hostConf.init.database;
					  V01.req = req;
					  V01.res = res;
					  V01.HOST = req.HOST;
					  V01.parse(parts);
					break;
				  default:
					  error(2, "undefined api version", "null");
					break;
				}
			  }
			else
			  error(1, "undefined api version", "null");
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

                */
}
