var wf = WF();

var blogConf=
	{
		"state": true,
		"pos": 10,
		"hook": "route",
		"blog":
		{
      "handle_home_page": true, // handle auto "/" or not

			"post_folder": wf.CONF['CONTENT_PATH'] + "blog",
			"name": "Hackmyfortress - Blog",
			"domain": "*", // "*" if any
			"url": "http://localhost:8080/",
			"uri": "", // "" if /
			"favicon": "/favicon.ico",
			"main_title": "Hackmyfortress - Blog - News, Hacking, IT and fun",
			"title": "Hackmyfortress - Blog",
			"subtitle": "News about the Fortress, hacking and IT",
			"footer": "&copy; 2016 Hackmyfortress - Blog ",
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

			],

			"page": // automaticaly loaded
			{
				"search":
				{
					"uri": "search",
					"view":"search",
					"type": "article",
					"title": "FortPress - Blog - Search engine",
					"description": "Search on Hackmyfortress - Blog",
					"image": "",
				},
				"404":
				{
					"uri": "404",
					"view":"404",
					"type": "article",
					"title": "FortPress - 404 Error",
					"description": "This content doesn't exist - 404 Error",
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
					"title": "FortPress - Archive indexed by tags",
					"description": "An archive of posts sorted by tag.",
					"image": "",
				}
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
				"facebook": "https://facebook.com/hackmyfortress",
				"twitter": "https://twitter.com/hackmyfortress",
				"gplus": "https://plus.google.com/+Hackmyfortress",
				"github": "https://github.com/seraum/hmf-training",
        "linkedin": "https://www.linkedin.com/in/adrien-thierry-6448a664",
			},

			"account":
			{
				"twitter": "@hackmyfortress", // TWITTER ACCOUNT WITH @
			},

			"stats":
			{
				"ga": "", // GA ID
			},

			"disqus": "", // DISQUS ID

			"sort": function(a, b)
			{
				return new Date(b.date) - new Date(a.date);
			}

		}
	}
module.exports = blogConf;
