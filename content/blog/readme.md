{
  "type": "article",
  "layout": "post",
  "title": "How to develop with FortressJS !",
  "uri": "how-to-develop-with-fortressjs",
  "description": "This article is a list of rule to code harmoniously with FortressJS",
  "date": "2016-11-28T14:00:00.000Z",
  "categories": "articles",
  "tags": ["FortressJS", "blog", "code"],
  "image":
  {
    "src": "http://i.imgur.com/JQGtQwE.jpg"

  },
  "comments": true,
  "share": true
}
<--MARKUP-->


This is a list of rules to code harmoniously with FortressJS / FortPress

* Basics

* No more 300 lines in a file
* No more 50 lines in a function (please)
* If you add an external lib, verify the license (MIT)
* Don't touch at /base/*, if there is something wrong in, add a pull request in FortressJS


# Engine / App / Plugin

Engines, apps and plugins work the same : they are loaded at start and do some actions. There are 4 mains actions :

* Main action hooked at each time : this.code(req, res)
* Routes, added with wf.Router.ANY(host, route, controller)
* Events : you could add setInterval or stuff like that to do something regularly
* Or, you could use this.runOnce() to start an action in only 1 thread (FortressJS is multithreaded)

# Callback

All callbacks must be like that :

* callback(error, data)
