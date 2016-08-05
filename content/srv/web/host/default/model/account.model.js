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

module.exports = account;

function account(empty)
{
	this.collection = "account";
	this.rest = true;
	this.description = "Account Model";

  this.screen = "http://fortressjs.com";
  this.doc = ["http://seraum.com", "http://fortressjs.com"];

	this.getDescription = "Get account object";
	this.postDescription = "Create account object";
	this.putDescription = "Update account object";
	this.deleteDescription = "Delete account object";

	this.getScreen = ["http://fortressjs.com", "http://seraum.com"];
	this.getDoc = "http://fortressjs.com";
	this.getLink = "http://fortressjs.com";

  this.deleteScreen = ["http://fortressjs.com", "http://seraum.com"];
	this.deleteLink = "http://fortressjs.com";

	this.getAccess = function()
	{
		return true;
	}

	this.sanitize =
	{
		password: null, // Hide password
	};

    this.access = function(req, res)
    {
        // ADD LOGIN SCHEMA HERE
		// return false OR true
        return true;
    };

	this.field =
	{
		email:
		{
      require: ["get"],
			unique: true,
      input: "email",
			example: "test@myemail.dom",
      validator: function(data)
			{
				var validEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
				return validEmail.test(data);
			},
		},

		password:
		{
			example: "**********",
      validator: function(data)
			{
				if(data && data.length > 5) return true;
        else return false;
			},
      input: "password",
		},

		nickname:
		{
			example: "Joe123",
			require: true,
			bydefault: "Anonymous",
			type: "string",
			description: "User nickname",
      unique: true,
		},

    firtname:
    {
      example: "Joe",
			bydefault: "",
			type: "string",
			description: "User firtname",
    },

	};

  // CALL MODEL CLASS
	UTILS.Model.apply(this, new Array(empty));

}
