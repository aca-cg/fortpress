module.exports =
{
      "theme": "simpleblog",
      "handle_home_page": true, // handle / or not
      "log": true,
			"post_folder": "__MAIN_PATH__post", // blog post folder, could be a linux/windows path : /home/johndoe/post
			"name": "Fortpress - Blog", // The blog name
			"domain": "*", // "*" if any, else something.tld to force your domain
			"url": "http://fortpress.seraum.com/", // default url, / by default, could be : http://my.blog, with last /
			"uri": "", // default uri, "" if /
			"favicon": "/favicon.ico", // favicon
			"main_title": "Fortpress - Fast, simple and secure Blog", // blog title for micro data
			"title": "Fortpress", // Blog title
			"subtitle": "My fast, simple and secure Blog", // Blog subtitle
			"footer": "&copy; 2016 <a href='http://seraum.com' target='_BLANK'>Seraum</a> ", // Blog footer
			"locale": "en-US", // blog default locale
			"logo": "/images/logo.jpg", // blog logo
			"logo_style":"background-color:#ffffff;", // logo custom style
			"refresh": 1000 * 60 * 60, // load new post every hour
			"menu": // Forge your menu here
			[
				{
					"href":"__BLOG_URL__",
					"title": "Blog",
					"target": "",
				},

				{
					"href":"__BLOG_URL__search",
					"title": "Search",
					"target": "",
				},

				{
					"href":"__BLOG_URL__tags",
					"title": "Archives",
					"target": "",
				},

        {
          "href":"http://hackmyfortress.com/",
					"title": "Challenge",
					"target": "_BLANK",
        },

        {
          "href":"http://eepurl.com/coztIv",
					"title": "Newsletter",
					"target": "_BLANK",
        },

			],

			"page": // automaticaly loaded with view/*, describe your custom page here
			{
				"search":
				{
					"uri": "search",
					"view":"search",
					"type": "article",
					"title": "Fortpress - Blog - Search engine",
					"description": "Search on Fortress - Blog",
					"image": "",
				},
				"404":
				{
					"uri": "404",
					"view":"404",
					"type": "article",
					"title": "Fortress - 404 Error",
					"description": "This content doesn't exist - 404 Error",
					"image": "",
				}
			},

			"special": // don't touch this if you don't know how it works
			{

				"search.json":
				{
					"uri": "search.json"
				},

        "sitemap":
        {
          "uri": "sitemap.xml",
          "type": "sitemap",
          "url": "__URL__", // Is replaced by blog URL

          "mainfreq": "daily",
          "postfreq": "weekly",
          "specialfreq": "weekly",
          "pagefreq": "weekly",

          "mainpriority": "1.00",
          "postpriority": "0.80",
          "specialpriority": "0.70",
          "pagepriority": "0.80",
          "indexed": false, // you don't want to index sitemap.xml in sitemap.xml : ]

        },

				"tags":
				{
				 	"uri": "tags",
					"type": "article",
					"title": "Fortpress - Archive indexed by tags",
					"description": "An archive of posts sorted by tag.",
					"image": "",
				}
			},

      "author": // You can as many authors as you want
      {
        "adrien":
        {
          "name": "Adrien T.",
          "image":
          {
            "url":"/blog/author/adrien.jpg",
            "title":"Adrien T.",
          },
          "link":
          [
            {"class":"fa fa-twitter-square", "title":"My Twitter", "url":"https://twitter.com/adrien_thierry"},
            {"class":"fa fa-facebook-square", "title":"My Facebook", "url":"https://www.facebook.com/adrien.thierry.fr"},
            {"class":"fa fa-linkedin-square", "title":"My Linkedin", "url":"https://www.linkedin.com/in/adrien-thierry-6448a664"},
            {"class":"fa fa-dollar", "title":"Hackmyfortress", "url":"http://hackmyfortress.com"},
          ],
        },
      },

			"og":
			{
				"locale": "en_US",
				"type": "website",
				"title": "__BLOG_TITLE__", // Is replaced by Blog title or post title
				"url": "__BLOG_URL__",// Is replaced by Blog url or post url
				"name": "__BLOG_NAME__", // Is replaced by Blog name
				"description": "__BLOG_SUBTITLE__", // Is replaced by blog subtitle or post description
			},

			"card":
			{
        "account": "@seraum",  // TWITTER ACCOUNT WITH @
				"title": "__BLOG_TITLE__", // Is replaced by Blog title or post title
				"description": "__BLOG_SUBTITLE__", // Is replaced by blog subtitle or post description
				"image": "https://i.imgur.com/JQGtQwE.jpg",
			},

			"social":
      [

        { "custom": "fa fa-facebook-square fa-2x", "url": "https://facebook.com/seraumdotcom"},
        { "custom": "fa fa-twitter-square fa-2x", "url": "https://twitter.com/seraum"},
        { "custom": "fa fa-google-plus-square fa-2x", "url": "https://plus.google.com/+seraumdotcom"},
        { "custom": "fa fa-github-square fa-2x", "url": "https://github.com/seraum/fortpress"},
        { "custom": "fa fa-linkedin-square fa-2x", "url": "https://www.linkedin.com/in/adrien-thierry-6448a664"},
      ],

			"stats":
			{
				"ga": "UA-37283264-10", // GA ID
			},

			"disqus": "fortpress", // DISQUS ID

			"sort": function(a, b) // Sort post by date, you can sort post with what you want
			{
				return new Date(b.date) - new Date(a.date);
			},

      "custom_meta":
      [

      ],

      "custom_script":
      [

      ],

      "custom_left_column":
      [

      ],

      "custom_footer_blog_top":
      [

      ],

      "custom_footer_blog_bottom":
      [

      ],

}

