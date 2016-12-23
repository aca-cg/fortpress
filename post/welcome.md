{
  "author": "adrien",
  "title": "Welcome in the Fortress blog !",
  "uri": "welcome-in-the-fortress-blog",
  "description": "We are pleased to announce that we have finally developed a secure blog. We wanted this blog to be as secure as Hackmyfortress.com. Its name is Fortpress.",
  "date": "2016-11-27T14:00:00.000Z",
  "tags": ["fortpress", "hackmyfortress", "fortressjs", "blog", "security"],
  "image": { "src": "http://i.imgur.com/JQGtQwE.jpg"},
  "comments": true,
  "share": true
}
<--MARKUP-->


I wanted a simple blog to be able to express myself, to share, to discover, to exchange. And that's it. A secure blog. The basic principles are :
* security
* efficiency
* simplicity
* modularity

# A solid blog like rock : Fortpress

In the past, I have audited Wordpress plugins, Joomla plugins, Drupal plugins .... The observation is always the same: many security vulnerabilities, problems of updates, a horrible slowness. I regularly help friends optimize their Wordpress: databases of more than 2GB, cache files everywhere, plugins not compatible with the current version of Wordpress. A nightmare.

So I took the initiative to code a blog as I wished: simple, light, and secure.

# Multithreaded

By default, Fortpress is Multithreaded. You can change this behavior in the web server settings here :

```
./content/srv/web/web.conf.js
```

change `thread` by the number you want.

# Look

You can change the default look of you blog by editing views and css. Views are here :

```
./theme/simpleblog/view/
```
And css is in the www folder :

```
./theme/simpleblog/www/
```

# Theming

You can create new theme simply in copying the `simpleblog` theme, and modifying what you want. Don't forget to change the `theme` value in the blog configuration : adjust it to your new theme folder.


# Security

By default, Fortpress change web server ID with 1000, the first created user on a Linux system. You can put the ID you want :

```
./conf/security.conf.js
```

You can create a new user with restricted rights, and put this user id in the security conf file.

# Log

By default, the Logger plugin is enabled. You can disable it by deleting it or by set its config state to `false`.

```
./content/srv/web/app/log/logger/logger.conf.js
```

# Feedback

Don't hesitate to give us your feedbacks !
