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

module.exports = restfulPage;

function restfulPage(page)
{
    this.code = function(req, res)
    {
		var rest = this.view.restful;
		var result = "";
		var method = ["GET", "POST", "PUT", "DELETE"];
		var access = "Access";
		var doc = "Doc";
		var screen = "Screen";
		var link = "Link";
		var desc = "Description";

		var PUT_SPECIAL = {
			"$push":
			{
				type: "object",
				description: "Push object in array",
				demo: '$push:{"arr":"a_value"}',
			}
		};

		var QUERY = "query";
		var DATA = "data";

		var title = "";
			if(page.init.title) title = page.init.title;
		rest = rest.replace(/_TITLE/gi, title);

    var _LOOP = 0;

		for(var m in req.HOST.MODELS)
		{
			var objModel = new req.HOST.MODELS[m]();
			if(objModel.rest)
			{
				var tmpBloc = this.view.bloc.slice(0);
				var name = "";

				tmpBloc = tmpBloc.replace(/_MODEL/gi, m);

				var mdesc = "";
				if(objModel.description) mdesc = objModel.description;
				tmpBloc = tmpBloc.replace(/_DESCRIPTION/gi, mdesc);

				var maccess = "";
				if(objModel.access) maccess = page.init.access;
				tmpBloc = tmpBloc.replace(/_ACCESS/gi, maccess);


        // DOC
        var mdoc = formatLink(objModel["doc"], this.view.doc, /_DOC/gi);
        tmpBloc = tmpBloc.replace(/_DOC/gi, mdoc);

        // SCREEN
        var mscreen = formatLink(objModel["screen"], this.view.screen, /_SCREEN/gi);
        tmpBloc = tmpBloc.replace(/_SCREEN/gi, mscreen);

        // LINK
        var mlink = formatLink(objModel["link"], this.view.link, /_LINK/gi);
        tmpBloc = tmpBloc.replace(/_LINK/gi, mlink);


				var methodResult = "";
				for(var i in method)
				{
					if(objModel[method[i]] == undefined || objModel[method[i]] == true)
					{
						var tmpMethod = this.view.method;

						var parameter = "";
						var example_result = {};
						tmpMethod = tmpMethod.replace(/_MODEL/gi, m);
            tmpMethod = tmpMethod.replace(/_LOOP/gi, _LOOP);
						tmpMethod = tmpMethod.replace(/_METHOD_LOWER/gi, method[i].toLowerCase());
						tmpMethod = tmpMethod.replace(/_METHOD_UPPER/gi, method[i].toUpperCase());
						tmpMethod = tmpMethod.replace(/_FUNCTION/gi, method[i] + "('" + _LOOP + "', '" + m + "', '" + page.init.url + "')");

						// method description
						var gdesc = "";
						if(objModel[method[i].toLowerCase() + desc]) gdesc = objModel[method[i].toLowerCase() + desc];
							tmpMethod = tmpMethod.replace(/_DESCRIPTION/gi, gdesc);

						// method access
						var gaccess = "";
						if(objModel[method[i].toLowerCase() + access]) gaccess = page.init.access;
						tmpMethod = tmpMethod.replace(/_ACCESS/gi, gaccess);




             // DOC
            var tmpdoc = formatLink(objModel[method[i].toLowerCase() + doc], this.view.doc, /_DOC/gi);
            tmpMethod = tmpMethod.replace(/_DOC/gi, tmpdoc);

            // SCREEN
            var tmpscreen = formatLink(objModel[method[i].toLowerCase() + screen], this.view.screen, /_SCREEN/gi);
            tmpMethod = tmpMethod.replace(/_SCREEN/gi, tmpscreen);

            // LINK
            var tmplink = formatLink(objModel[method[i].toLowerCase() + link], this.view.link, /_LINK/gi);
            tmpMethod = tmpMethod.replace(/_LINK/gi, tmplink);


						for(var f in objModel.field)
						{
							example_result[f] = objModel.field[f].example || "";
							var tmpParameter = this.view.parameter;
							tmpParameter = tmpParameter.replace(/_VAR/gi, QUERY);
							tmpParameter = tmpParameter.replace(/_NAME/gi, f);

							// check require :
							var require = "";
							if(objModel.field[f].require !== undefined && (objModel.field[f].require === true || objModel.field[f].require.indexOf(method[i].toLowerCase()) > -1)) require = "*";
							tmpParameter = tmpParameter.replace(/_REQUIRE/gi, require);

							// check description :
							var odesc = "";
							if(objModel.field[f].description) odesc = objModel.field[f].description;
							tmpParameter = tmpParameter.replace(/_DESCRIPTION/gi, odesc);

							// check type :
							var otype = "";
							if(objModel.field[f].type) otype = objModel.field[f].type;
							tmpParameter = tmpParameter.replace(/_TYPE/gi, otype);


              // check input type
              var oinput = "text";
							if(objModel.field[f].input) oinput = objModel.field[f].input;
							tmpParameter = tmpParameter.replace(/_INPUT/gi, oinput);


							// check default value :
							var bydefault = "";
							if(objModel.field[f].bydefault)
							{
								if( typeof objModel.field[f].bydefault == "object" )
									bydefault = JSON.stringify(objModel.field[f].bydefault);
								else
									bydefault = objModel.field[f].bydefault;
							}
							tmpParameter = tmpParameter.replace(/_DEFAULT_VALUE/gi, bydefault);

              // check unique
              var UNIQUE = "";
              if(objModel.field[f].unique) UNIQUE = page.init.check;
              tmpParameter = tmpParameter.replace(/_UNIQUE/gi, UNIQUE);

              // check private
              var PRIVATE = "";
              if(objModel.field[f].private) UNIQUE = page.init.check;
              tmpParameter = tmpParameter.replace(/_PRIVATE/gi, PRIVATE);

							parameter += tmpParameter;
						}
						tmpMethod = tmpMethod.replace(/_PARAMETER/gi, parameter);
						tmpMethod = tmpMethod.replace(/_EXAMPLE_RESULT/gi, JSON.stringify(example_result));

						var data = "";

						// SET DATA PARAMETERS
						if(method[i] == "PUT")
						{
							data = this.view.data;
							var dataParam = "";
							for(var n in PUT_SPECIAL)
							{
								objModel.field[n] = PUT_SPECIAL[n];
							}

							for(var f in objModel.field)
							{
								var tmpParameter = this.view.parameter;
								tmpParameter = tmpParameter.replace(/_VAR/gi, DATA);
								tmpParameter = tmpParameter.replace(/_NAME/gi, f);

								// check require :
								var require = "";
								if(objModel.field[f].require !== undefined && (objModel.field[f].require === true || objModel.field[f].require.indexOf(method[i].toLowerCase()) > -1)) require = "*";
								tmpParameter = tmpParameter.replace(/_REQUIRE/gi, require);

								// check description :
								var odesc = "";
								if(objModel.field[f].description) odesc = objModel.field[f].description;
								tmpParameter = tmpParameter.replace(/_DESCRIPTION/gi, odesc);

								// check type :
								var otype = "";
								if(objModel.field[f].type) otype = objModel.field[f].type;
								tmpParameter = tmpParameter.replace(/_TYPE/gi, otype);

								// check default value :
								var bydefault = "";
								if(objModel.field[f].bydefault)
								{
									if( typeof objModel.field[f].bydefault == "object" )
										bydefault = JSON.stringify(objModel.field[f].bydefault);
									else
										bydefault = objModel.field[f].bydefault;
								}
								tmpParameter = tmpParameter.replace(/_DEFAULT_VALUE/gi, bydefault);


                // check input type
                var tinput = "text";
							  if(objModel.field[f].input) tinput = objModel.field[f].input;
							  tmpParameter = tmpParameter.replace(/_INPUT/gi, tinput);

                 // check unique
                var TUNIQUE = "";
                if(objModel.field[f].unique) TUNIQUE = page.init.check;
                tmpParameter = tmpParameter.replace(/_UNIQUE/gi, TUNIQUE);

                // check private
                var TPRIVATE = "";
                if(objModel.field[f].private) TPRIVATE = page.init.check;
                tmpParameter = tmpParameter.replace(/_PRIVATE/gi, TPRIVATE);


								dataParam += tmpParameter;
							}
							data = data.replace(/_PARAMETER/gi, dataParam);
							data = data.replace(/_DATA/gi, method[i]);
						}

						tmpMethod = tmpMethod.replace(/_DATA/gi, data);
						methodResult += tmpMethod;
					}

          _LOOP++;
				}

				tmpBloc = tmpBloc.replace(/_METHOD/gi, methodResult);
				result += tmpBloc;
			}
		}
		rest = rest.replace("_VIEW", result);
        res.end(rest);
    };
}


function formatLink(obj, tpl, regexp)
{
  var res = "";

  if(obj)
  {
    switch(typeof obj)
    {
      case "string":
        res = tpl;
        res = res.replace(/_ONCLICK/gi, "");
        res = res.replace(regexp, obj);
        break;
      case "object":
        res = tpl;
        res = res.replace(/_ONCLICK/gi, "setModal(" + JSON.stringify(obj) + ");openModal();");
        res = res.replace(regexp, "javascript:void(0)");
        break;
      default:
        break;
    }
  }

  return res;
}
