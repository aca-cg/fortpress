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

/**
 * @namespace fileUtil
 * @description fileUtil static namespace
 *
 * @example wf.fileUtil.rmdir('mydir', function(err){ });
*/

var fileUtil = {};

/**
 * @method rmdir
 * @description recursive rm method
 * @memberof fileUtil
 * @param dir {string} Directory to delete
 * @param callback {function} Function called at end callback(err){}
 *
*/

var rmdir = function(dir, callback)
{
	  fs.readdir(dir, function(err, list)
    {
        if(err)
        {
            try
            {
                fs.unlink(dir, function(err)
                {
                    callback(err);
                });
            }
            catch(e){}
        }
        else
        {
            var i = 0;
            var j = list.length;
            var cb = function(){ fs.rmdir(dir, function(err){if(callback && typeof callback == "function") callback(err);});};
            recursiveRm(dir, i, j, list, cb);
            return;
        }
    });

    function recursiveRm(from, i, j, list, cb)
    {

        function nextFile()
        {
            i++;
            if(i < j)
            {
                recursiveRm(from, i, j, list, cb);
            }
            else
            {
                if(cb && typeof cb == "function")
                    cb();
            }
        }
        var filename = "";

        try
        {
          filename = path.join(from, list[i]);
        }
        catch(e)
        {
          nextFile();
          return;
        }

        fs.stat(filename, function(err, stat)
        {
          if(err)
          {
            nextFile();
          }
          else if(stat.isDirectory())
          {
            if(filename)
            {
              rmdir(filename, nextFile);
            }
            else
            {
              nextFile();
            }
          }
          else
          {
            fs.unlink(filename, nextFile);
          }
        });
    }
};

fileUtil.rmdir = rmdir;
module.exports.fileUtil = fileUtil;
