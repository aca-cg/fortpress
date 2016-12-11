var wf = WF();

var blogConf=
	{
		"state": true,
		"pos": 10,
		"hook": "route",
		"blog":
		{
      "handle_home_page": true, // handle / or not

			"post_folder": wf.CONF['CONTENT_PATH'] + "blog",
			"name": "My Fortpress - Blog",
			"domain": "*", // "*" if any
			"url": "/blog/",
			"uri": "/blog", // "" if /
			"favicon": "/favicon.ico",
			"main_title": "My Fortpress Secured Blog",
			"title": "My Fortpress Secured Blog",
			"subtitle": "My Fortpress Secured Blog",
			"footer": "&copy; 2016 <a href='http://seraum.com' target='_BLANK'>Seraum</a> - Blog ",
			"locale": "en-US",
			"logo": "/images/logo.jpg",
			"logo_style":"background-color:#000;",
			"refresh": 1000 * 60 * 60,
			"menu":
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

			],

			"page": // automaticaly loaded
			{
				"search":
				{
					"uri": "search",
					"view":"search",
					"type": "article",
					"title": "Fortpress - Search engine",
					"description": "Search on Fortpress - Blog",
					"image": "",
				},
				"404":
				{
					"uri": "404",
					"view":"404",
					"type": "article",
					"title": "Fortpress - 404 Error",
					"description": "This content doesn't exist on Fortpress - 404 Error",
					"image": "",
				}
			},

			"special": // Need code/controller to work
			{

				"search.json":
				{
					"uri": "search.json"
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

      "author":
      {
        "adrien":
        {
          "name": "Adrien T.",
          "image":
          {
             "url":"/blog/author/adrien.jpg",
            "title":"Adrien T.",
          },
          "social":
          {
             "twitter": "https://twitter.com/adrien_thierry",
             "facebook": "https://www.facebook.com/adrien.thierry.fr",
             "linkedin": "https://www.linkedin.com/in/adrien-thierry-6448a664",
          },
          "custom":
          [
            {
              "url": "http://hackmyfortress.com",
              "title": "Hackmyfortress",
              "class": "fa-dollar",
            },
          ]
        },
      },

			"og":
			{
				"locale": "en_US",
				"type": "website",
				"title": "__BLOG_TITLE__",
				"url": "__BLOG_URL__",
				"name": "__BLOG_NAME__",
				"description": "__BLOG_SUBTITLE__",
			},

			"card":
			{
				"title": "__BLOG_TITLE__",
				"description": "__BLOG_SUBTITLE__",
				"image": "https://i.imgur.com/JQGtQwE.jpg",
			},

			"social":
			{
				"facebook": "https://www.facebook.com/seraumdotcom",
				"twitter": "https://twitter.com/seraum",
				"gplus": "https://plus.google.com/+Seraumdotcom",
				"github": "https://github.com/seraum/",
        "linkedin": "https://www.linkedin.com/in/adrien-thierry-6448a664",
			},

			"account":
			{
				"twitter": "@seraum", // TWITTER ACCOUNT WITH @
			},

			"stats":
			{
				"ga": "UA-37283264-6", // GA ID
			},

			"disqus": "", // DISQUS ID

			"sort": function(a, b)
			{
				return new Date(b.date) - new Date(a.date);
			}

		}
	}
module.exports = blogConf;
