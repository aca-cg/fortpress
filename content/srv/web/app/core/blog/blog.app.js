/*
 * This file is part of Fortpress - Fast, secure, and simple Blog
 * Copyright (c) 2014-2016 Adrien THIERRY
 * http://fortpress.seraum.com - http://seraum.com
 *
 * sources : https://github.com/seraum/fortpress
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

module.exports = Blog;
var wf = WF();
var MD = require('./lib/marked.js');
var MAIN = "";
var MENU = "";
var TAGS_LIST = "";
var PAGES = {};
var SITEMAP = "";

var SEPARATOR = "<--MARKUP-->";

var POST_CONTENT = {};
var SEARCH_CONTENT = [];

function Blog(app)
{


  if(app.init.blog.handle_home_page)
  {

    this.code = function(req, res)
    {
      if(req.url == "/")
      {
        req.continue = false;
        res.end(MAIN);
      }
    }

  }


  var blogRoute = app.init.blog.uri + "/:uri?";
  wf.Router.GET(app.init.blog.domain, blogRoute, blogRouter);
  function blogRouter(req, res)
  {
    try
    {
      res.setHeader('content-type', 'text/html;charset=utf-8');
      if(req.param.uri == null || req.param.uri == undefined )
      {
        res.end(MAIN);
      }
      else if(PAGES[req.param.uri])
      {
        res.end(PAGES[req.param.uri]);
      }
      else if(req.param.uri == app.init.blog.special["search.json"].uri)
      {
        res.end(JSON.stringify(SEARCH_CONTENT));
      }
      else if(req.param.uri == app.init.blog.special["tags"].uri)
      {
        res.end(TAGS_LIST);
      }
      else if(req.param.uri == app.init.blog.special["sitemap"].uri)
      {
        res.writeHead(200,
		    {
  			  'Content-type': 'application/xml'
        });
        res.end(SITEMAP);
      }
      else if(POST_CONTENT[req.param.uri])
      {
          res.end(POST_CONTENT[req.param.uri].content);
      }
      else res.end(PAGES['404']);
    }catch(e){console.log(req.url);};
  }


/** CONSTRUCT **/
function setUpBlog()
{
    function Loaded()
    {
      forgeMain()
      preparePages();
      forgeTagsList();
      forgeSitemap();
    }
    forgeMD(Loaded);
}
setUpBlog();
setInterval(setUpBlog, app.init.blog.refresh);
/** CONSTRUCT **/
  function forgeSitemap()
  {
    var sitemap = "";
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\
                <urlset\
                  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\
                  http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\
              <url>\
                <loc>' + app.init.blog.special.sitemap.url + '</loc>\
                <changefreq>' + app.init.blog.special.sitemap.mainfreq + '</changefreq>\
                <priority>' + app.init.blog.special.sitemap.mainpriority + '</priority>\
              </url>';


    for(var i = 0; i < SEARCH_CONTENT.length; i++)
    {
       sitemap += "<url>"
       sitemap += "<loc>" + SEARCH_CONTENT[i].link + "</loc>";
       sitemap += "<changefreq>" + app.init.blog.special.sitemap.postfreq + "</changefreq>";
       sitemap += "<priority>" + app.init.blog.special.sitemap.postpriority + "</priority>";
       sitemap += "</url>";
    }

    for(var p in app.init.blog.page)
    {
      if(app.init.blog.page[p].indexed == undefined || app.init.blog.page[p].indexed != false)
      {
       sitemap += "<url>"
       sitemap += "<loc>" + app.init.blog.special.sitemap.url + app.init.blog.page[p].uri + "</loc>";
       sitemap += "<changefreq>" + app.init.blog.special.sitemap.pagefreq + "</changefreq>";
       sitemap += "<priority>" + app.init.blog.special.sitemap.pagepriority + "</priority>";
       sitemap += "</url>";
      }
    }

    for(var s in app.init.blog.special)
    {
      if(app.init.blog.special[s].indexed == undefined || app.init.blog.special[s].indexed != false)
      {
       sitemap += "<url>"
       sitemap += "<loc>" + app.init.blog.special.sitemap.url + app.init.blog.special[s].uri + "</loc>";
       sitemap += "<changefreq>" + app.init.blog.special.sitemap.specialfreq + "</changefreq>";
       sitemap += "<priority>" + app.init.blog.special.sitemap.specialpriority + "</priority>";
       sitemap += "</url>";
      }
    }
    sitemap += "</urlset>";
    SITEMAP = forgeRecursive(sitemap, ["__URL__"], [app.init.blog.url]);
  }

  function forgeMain()
  {
    var mainPage = app.view['main'].toString();
    var entryView = "";
    for(var i = 0; i < SEARCH_CONTENT.length; i++)
    {
        var uri = SEARCH_CONTENT[i].uri;
        var tmp = app.view['entry'].toString();
        var localeDate = new Date(SEARCH_CONTENT[i].date);
        localeDate = localeDate.toLocaleDateString(app.init.blog.locale);
        var from = ["__URI__", "__TITLE__", "__JSON_DATE__", "__DATE__", "__DESCRIPTION__"];
        var to = [app.init.blog.url + uri, SEARCH_CONTENT[i].title, SEARCH_CONTENT[i].date, localeDate, SEARCH_CONTENT[i].description]
        entryView += forgeRecursive(tmp, from, to);
    }
    mainPage = mainPage.replace("__ENTRY_LIST__", entryView);
    MAIN =  forgeMeta(app.init.blog) + forgeHeader(app.init.blog) + mainPage + forgeFooter(app.init.blog);
  }

  function addFile(json, md)
  {
    var conf = JSON.parse(json);
    if(conf.uri && conf.date && new Date(conf.date) < new Date(Date.now()))
    {
      var mdHtml = MD(md);
      var postConf = wf.Clone(app.init.blog);

      postConf.main_title = conf.title + " - " + app.init.blog.name;
      postConf.title = ""; // no main title on blog post
      postConf.subtitle = ""; // no subtitle on blog post

      postConf.current_url = postConf.url + conf.uri;
      postConf.card.title = conf.title;
      postConf.card.description = conf.description;
      postConf.card.image = "" ;
      if(conf.image && conf.image.src && conf.image.src.length > 0) postConf.card.image = conf.image.src;

      postConf.og.type = conf.type,
      postConf.og.title = conf.title;
      postConf.og.url = postConf.current_url;
      postConf.og.description = conf.description;

      var img = "";
      if(conf.image && conf.image.src && conf.image.src.length > 0)
      {
        img = app.view['headimg'].toString();
        var from = ["__SRC__", "__STYLE__", "__ALT__", "__TITLE__"];
        var to = [conf.image.src, conf.image.style, conf.image.alt, conf.image.title];
        img = forgeRecursive(img, from, to);
      }

      var author = "";
      var author_conf = conf.author;

      if(author_conf && app.init.blog && app.init.blog.author[author_conf])
      {
        author_conf = app.init.blog.author[author_conf];
        author_conf.custom_left_column = app.init.blog.custom_left_column;
        author_conf.comment = app.init.blog.disqus;
        author_conf.date =
          {
            "timestamp": conf.date,
            "friendly": new Date(conf.date).toLocaleDateString(app.init.blog.locale),
          };
        author = forgeAuthor(author_conf);

      }

      var disqusView = "";
      var disqus = app.init.blog.disqus;
      if(disqus && conf.comments)
      {
        disqusView = app.view['disqus'].toString();
        var from = ["__DISQUS_ID__"];
        var to = [disqus];
        disqusView = forgeRecursive(disqusView, from, to);
      }

      var shareView = "";
      if(conf.share)
      {
        shareView = app.view['share'].toString();
      }

      var tags = forgeTags(conf.tags);
      var pageView = app.view['blog'].toString();

      var footer_top = "";
      var footer_bottom = "";
      if(app.init.blog.custom_footer_blog_top) footer_top = app.init.blog.custom_footer_blog_top.join("");
      if(app.init.blog.custom_footer_blog_bottom) footer_bottom = app.init.blog.custom_footer_blog_bottom.join("");

      var from = ["__TITLE__", "__IMG__", "__AUTHOR__", "__FOOTER_TOP_BLOG_CUSTOM__", "__FOOTER_BOTTOM_BLOG_CUSTOM__", "__DISQUS__", "__SHARE__", "__CONTENT__", "__TAGS__", "__BLOG_URL__"];
      var to = [conf.title, img, author, footer_top, footer_bottom, disqusView, shareView, mdHtml, tags, app.init.blog.url];
      pageView = forgeRecursive(pageView, from, to)
      var postView = forgeMeta(postConf) + forgeHeader(postConf) + pageView + forgeFooter(app.init.blog);

      POST_CONTENT[conf.uri] =
      {
        "conf": conf,
        "content": postView
      };
      SEARCH_CONTENT.push(
        {
          "tags": conf.tags,
          "uri": conf.uri,
          "title": conf.title,
          "description": conf.description,
          "date": conf.date,
          "link": app.init.blog.url + conf.uri,
        });
    }
  }

  function forgeMD(cb)
  {
    var targetPath = app.init.blog.post_folder;
     fs.readdir(targetPath, function(err, result)
     {
       if(!err)
       {
         SEARCH_CONTENT = [];
         for(var i = 0; i < result.length; i++)
         {
           let j = i;
           var data = fs.readFileSync(path.join(targetPath, result[j]));
           var content = data.toString();
           var index = content.indexOf(SEPARATOR);
           if(index > -1)
           {
              var json = content.substring(0, index);
              var md = content.substring(index + SEPARATOR.length);
              try
              {
                addFile(json, md);
              }
              catch (e)
              {
                console.log("Error in : " + result[j] + " - " + e);
              }
           }
           if(app.init.blog.sort && typeof app.init.blog.sort == "function")
           {
             SEARCH_CONTENT.sort(app.init.blog.sort);
           }
          if(j == result.length - 1) cb();
         }
       }
       else cb();
     });
  }

  function forgePage(conf, uri)
  {
    var page = app.init.blog.page[uri];
    var pageConf = wf.Clone(conf);

    pageConf.current_url = app.init.blog.url + page.uri;
    pageConf.card.title = page.title;
    pageConf.card.description = page.description;
    pageConf.card.image = page.image;

    pageConf.og.type = page.type,
    pageConf.og.title = page.title;
    pageConf.og.url = pageConf.current_url;
    pageConf.og.description = page.description;

    var pageView = app.view[page.view].toString();
    return forgeMeta(pageConf) + forgeHeader(conf) + pageView + forgeFooter(conf);
  }

  function forgeMenu(conf)
  {
    MENU = "";
    for(var i = 0; i < conf.menu.length; i++)
    {
      var tmp = conf.menu[i];
      var from = ["__BLOG_URL__", "__HREF__", "__TITLE__", "__TARGET__"];
      var to = [conf.url, tmp.href, tmp.title, tmp.target];
      MENU += forgeRecursive(app.view['menu'].toString(), from, to);
    }
  }

  function forgeHeader(conf)
  {
    forgeMenu(conf);

    var header = app.view['header'].toString();
    var from = ["__MENU__", "__BLOG_LOGO__", "__BLOG_LOGO_STYLE__", "__BLOG_URL__", "__BLOG_TITLE__", "__BLOG_LOGO_TITLE__", "__BLOG_SUBTITLE__",  ];
    var to = [MENU, conf.logo, conf.logo_style, conf.url, conf.title, app.init.blog.main_title, conf.subtitle];
    return forgeRecursive(header, from, to);
  }

  function forgeMeta(conf)
  {
    var meta = app.view['meta'].toString();
    var from = ["__FAVICON__", "__META_CUSTOM__", "__TWITTER_TITLE__", "__TWITTER_DESCRIPTION__", "__TWITTER_SITE__", "__TWITTER_IMAGE__",
    "__OG_LOCALE__", "__OG_TYPE__", "__OG_TITLE__", "__OG_URL__", "__OG_SITE_NAME__", "__OG_DESCRIPTION__",
     "__BLOG_URL__", "__BLOG_NAME__", "__MAIN_TITLE__", "__BLOG_TITLE__", "__BLOG_SUBTITLE__"];
    var to = [ conf.favicon, conf.custom_meta.join(""), conf.card.title, conf.card.description, conf.card.account, conf.card.image,
      conf.og.locale, conf.og.type, conf.og.title, conf.og.url, conf.og.name, conf.og.description,
      conf.url, conf.name, conf.main_title, conf.title, conf.subtitle];
    return forgeRecursive(meta, from, to);
  }

  function forgeFooter(conf)
  {
    var ga = "";
    if(conf.stats && conf.stats.ga && conf.stats.ga.length > 0)
    {
       ga = app.view['analytics'].toString();
       ga = forgeRecursive(app.view['analytics'].toString(), ["__GA_ID__"], [conf.stats.ga]);
    }

    var footerView = app.view['footer'].toString();
    var from = ["__BLOG_NAME__", "__BLOG_URL__", "__BLOG_FOOTER__", "__GA__", "__SOCIAL_LINK__", "__SCRIPT_CUSTOM__"];

    var custom_script = "";

    if(conf.custom_script) custom_script = conf.custom_script.join("");

    var social = "";
    for(var i = 0; i < app.init.blog.social.length; i ++)
    {
       if(app.init.blog.social[i].url)
       {
          var custom = "";
          if(app.init.blog.social[i].custom) custom = app.init.blog.social[i].custom;

          social += forgeRecursive(app.view['social'].toString(), ["__ACCOUNT_URL__", "__BLOG_NAME__", "__BLOG_URL__", "__CUSTOM__"],
                                   [app.init.blog.social[i].url, conf.name, conf.url, custom]);
       }
    }


    var to = [conf.name, conf.url, conf.footer, ga, social, custom_script];
    return forgeRecursive(footerView, from, to);
  }

  function forgeTags(arr)
  {
    var tags = "";
    for(var i = 0; i < arr.length; i++)
    {
      var tmp = arr[i];
      var from = ["__TAG_URI__", "__TAG__"];
      var to = [app.init.blog.special.tags.uri, tmp];
      tags += forgeRecursive(app.view['tag'].toString(), from, to);
    }
    return tags;
  }

  function forgeTagsList()
  {
    var COUNT = {};
    var PARTS = {};
    var ELEMENTS = {};
    var ORDER = [];
    var tagsPage = app.view['tags'].toString();
    var countTag = "";
    var tagEntry = "";
    for(var i = 0; i < SEARCH_CONTENT.length; i++)
    {
        var tags = SEARCH_CONTENT[i].tags;
        if(tags)
        {
          for(var j = 0; j < tags.length; j++)
          {
            if(ORDER.indexOf(tags[j]) < 0) ORDER.push(tags[j]);
            if(!COUNT[tags[j]]) COUNT[tags[j]] = 0;
            COUNT[tags[j]]++;
            if(!PARTS[tags[j]])
            {
               var from = ["__TAG__"];
               var to = [tags[j]];
               PARTS[tags[j]] = app.view['tagentry'].toString();
               PARTS[tags[j]] = forgeRecursive(PARTS[tags[j]], from, to);
            }
            if(!ELEMENTS[tags[j]])
            {
               ELEMENTS[tags[j]] = "";
            }
            var element = app.view['tagelement'].toString();
            var localeDate = new Date(SEARCH_CONTENT[i].date);
            localeDate = localeDate.toLocaleDateString(app.init.blog.locale);
            var from = ["__URL__", "__TITLE__", "__JSON_DATE__", "__DATE__"];
            var to = [SEARCH_CONTENT[i].link, SEARCH_CONTENT[i].title, SEARCH_CONTENT[i].date, localeDate];
            ELEMENTS[tags[j]] += forgeRecursive(element, from, to);

          }

        }
    }

    ORDER.sort(function(a, b)
    {
      var A = a.toLowerCase();
      var B = b.toLowerCase();
      if(A < B) return -1
      else if (A > B) return 1;
      else return 0;
    })

    var counttag = app.view['counttag'].toString();
    for(var i = 0; i < ORDER.length; i++)
    {
      tagEntry += forgeRecursive(PARTS[ORDER[i]], ["__TAG_ELEMENT__"], [ELEMENTS[ORDER[i]]]);
      countTag += forgeRecursive(counttag, ["__TAG__", "__COUNT__"], [ORDER[i], COUNT[ORDER[i]]]);
    }

    tagsPage = forgeRecursive(tagsPage, ["__COUNT_TAG__", "__TAG_ENTRY__"], [countTag, tagEntry]);
    var tagsConf = createSpecialConf("tags");
    var result = forgeMeta(tagsConf) + forgeHeader(tagsConf) + tagsPage + forgeFooter(tagsConf);
    TAGS_LIST = result;
  }

  function createSpecialConf(uri)
  {
    var page = app.init.blog.special[uri];
    var pageConf = wf.Clone(app.init.blog);

    pageConf.current_url = pageConf.url + uri;
    pageConf.card.title = page.title;
    pageConf.card.description = page.description;
    pageConf.card.image = page.image;

    pageConf.og.type = page.type,
    pageConf.og.title = page.title;
    pageConf.og.url = pageConf.current_url;
    pageConf.og.description = page.description;

    return pageConf;
  }

  function forgeAuthor(conf)
  {
    var Author = app.view['author'].toString();
    var authorLink = app.view['authorlink'].toString();

    var result = "";
    var comment = "";
    var twitter = "";
    var facebook = "";
    var gplus = "";
    var linkedin = "";
    var link = "";
    var author_custom = "";

    if(conf.comment) comment = app.view['disquscomment'];
    if(conf.custom_left_column) author_custom = conf.custom_left_column.join("");

    if(conf.link && conf.link.length && conf.link.length > 0)
    {
       for(var i = 0; i < conf.link.length; i++)
       {
          link += forgeRecursive(authorLink, ["__URL__", "__TITLE__", "__CLASS__"], [conf.link[i].url, conf.link[i].title, conf.link[i].class]);
       }
    }

    result = forgeRecursive(Author,

                            ["__IMG_URL__", "__IMG_TITLE__", "__AUTHOR_NAME__", "__TIMESTAMP__", "__DATE__", "__DISQUS_COMMENT__", "__AUTHOR_LINK__", "__LEFT_COLUMN_CUSTOM__"],

                            [conf.image.url, conf.image.title, conf.name, conf.date.timestamp, conf.date.friendly, comment, link, author_custom]);


    return result;
  };


  function preparePages()
  {
    for(var p in app.init.blog.page)
    {
      PAGES[app.init.blog.page[p].uri] = forgePage(app.init.blog, app.init.blog.page[p].uri);
    }
  }

  function forgeRecursive(src, from, to)
  {
    for(var i = 0; i < from.length; i++)
    {
      if(to[i] == undefined || to[i] == null) to[i] = "";
      var re = new RegExp(from[i], 'g');
      src = src.replace(re, to[i]);
    }
    return src;
  }

}
