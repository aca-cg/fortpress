module.exports =
{
      "theme": "simpleblog",
      "handle_home_page": true, // handle / or not
			"post_folder": "__MAIN_PATH__post", // blog post folder, could be a linux/windows path : /home/johndoe/post
			"name": "Seraum - Blog", // The blog name
			"domain": "*", // "*" if any, else something.tld to force to your domain
			"url": "/", // default url, / by default, could be : http://my.blog/
			"uri": "", // default uri, "" if /
			"favicon": "/favicon.ico", // favicon
			"main_title": "Fortpress - Fast, simple and secure Blog", // blog title for micro data
			"title": "Fortpress", // Blog title
			"subtitle": "My fast, simple and secure Blog", // Blog subtitle
			"footer": "&copy; 2016 Seraum - Blog ", // Blog footer
			"locale": "en-US", // blog default locale
			"logo": "/images/logo.jpg", // blog logo
			"logo_style":"background-color:#ffffff;", // logo custom style
			"refresh": 1000 * 60 * 60, // load new post every hour
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

        {
          "href":"http://eepurl.com/coztIv",
					"title": "Newsletter",
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
					"title": "Hackmyfortress - Blog - Search engine",
					"description": "Search on Hackmyfortress - Blog",
					"image": "",
				},
				"404":
				{
					"uri": "404",
					"view":"404",
					"type": "article",
					"title": "Hackmyfortress - 404 Error",
					"description": "This content doesn't exist - 404 Error",
					"image": "",
				}
			},

			"special":
			{

				"search.json":
				{
					"uri": "search.json"
				},

				"tags":
				{
				 	"uri": "tags",
					"type": "article",
					"title": "Hackmyfortress - Archive indexed by tags",
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
          "custom": // add custom link in author column
          [
            {
              "url": "http://hackmyfortress.com",
              "title": "Hackmyfortress",
              "class": "fa-dollar", // you can use font-awesome
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
				"facebook": "https://facebook.com/seraumdotcom",
				"twitter": "https://twitter.com/seraum",
				"gplus": "https://plus.google.com/+seraumdotcom",
				"github": "https://github.com/seraum/",
        "linkedin": "https://www.linkedin.com/in/adrien-thierry-6448a664",
			},

			"account":
			{
				"twitter": "@seraum", // TWITTER ACCOUNT WITH @
			},

			"stats":
			{
				"ga": "", // GA ID
			},

			"disqus": "", // DISQUS ID

			"sort": function(a, b)
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

