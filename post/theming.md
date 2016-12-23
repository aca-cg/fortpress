{
  "author": "adrien",
  "title": "Theming with Fortpress",
  "uri": "theming",
  "description": "How to create a new theme in Fortpress : variables and files.",
  "date": "2016-11-29T14:00:00.000Z",
  "tags": ["fortpress", "theme", "code"],
  "comments": true,
  "share": true
}
<--MARKUP-->

In Fortpress, theming is easy : Copy/paste a theme, give it a name, and it's done. You can then change css, templates etc.

# CSS

You can put your css where you want in the `www` folder of your current theme. The `www` folder is virtualy linked in `/` uri. So, `www/css/` will be linked in `/css/` uri.

# Pages

You can add pages by adding a view in the html folder, and by linking it in the blog configuration in the `page` section. A `page` is written in pure HTML. A page is automatically surrounded by meta, header and footer.

# Variables

A list of main variable in theme views :

__Analytics__

* \_\_GA\_ID\_\_ : Replace by the google analytics ID

__Blog conf__

* \_<span></span>\_BLOG\_URL\_\_ : Replaced by the blog's url
* \_\_BLOG\_TITLE\_\_ : replaced by the blog's title
* \_\_BLOG\_NAME\_\_ : replaced by the blog's name
* \_\_BLOG\_SUBTITLE\_\_ : replaced by the blog's subtitle

__Author__

* \_\_AUTHOR\_IMG\_\_ : replaced by the Author's image
* \_\_AUTHOR\_NAME\_\_ : replaced by the Author's name
* \_\_DATE\_PUBLISHED\_\_ : Replaced by the publication date of the post
* \_\_DISQUS\_COMMENT\_\_ : Replaced by the count of comments if Disqus is active
* \_\_AUTHOR\_TWITTER\_\_  : Replaced by the Author's Twitter link
* \_\_AUTHOR\_FACEBOOK\_\_ : Replaced by the Author's Facebook link
* \_\_AUTHOR\_GPLUS\_\_ : Replaced by the Author's Google+ link
* \_\_AUTHOR\_LINKEDIN\_\_ : Replaced by the Author's Linkeding link
* \_\_AUTHOR\_CUSTOM\_\_ : Replaced by Author's custom links
* \_\_LEFT\_COLUMN\_CUSTOM\_\_ : Replaced by custom html

__Blog__

* \_\_IMG\_\_ : replaced by the current post's image html
* \_<span></span>\_TAGS\_\_ : replaced by tags of current article
* \_\_TITLE\_\_ : replaced by current post's title
* \_\_AUTHOR\_\_ : replaced by Author's html if any
* \_\_CONTENT\_\_ : replaced by the content of the post
* \_\_FOOTER\_TOP\_BLOG\_CUSTOM\_\_ : replaced by custom top footer html if any
* \_\_DISQUS\_\_ : replaced by Disqus html if Disqus is active
* \_\_FOOTER\_BOTTOM\_BLOG\_CUSTOM\_\_ : replaced by custom bottom footer html if any
* \_\_SHARE\_\_ : replaced by share html if share is active

__Counttag__

* \_\_TAG\_\_ : replaced by tag name
* \_\_COUNT\_\_ : replaced by count of tag name

__Disqus__

* \_\_DISQUS\_ID\_\_ : replaced by Disqus ID

__Entry__

* \_\_URI\_\_ : replaced by the uri of the post
* \_\_TITLE\_\_ : replaced by the title of the post
* \_\_JSON\_DATE\_\_ : replaced by the json date of the post
* \_\_DATE\_\_ : replaced by the date of the post
* \_\_DESCRIPTION\_\_ : replaced by the description of the post

__Footer__

* \_\_BLOG\_FOOTER\_\_ : replaced by the blog footer
* \_\_SCRIPT\_CUSTOM\_\_ : replaced by custom script html if any
* \_<span></span>\_BLOG\_URL\_\_ : replaced by blog url
* \_\_GA\_\_ : replaced by Google Analytics html if active

__Header__

* \_\_MENU\_\_ : replaced by the menu's html
* \_<span></span>\_BLOG\_URL\_\_ : replaced by the blog's url
* \_\_BLOG\_TITLE\_\_ : replaced by the blog's title
* \_\_BLOG\_LOGO\_\_ : replaced by the blog's logo
* \_\_BLOG\_TITLE\_\_ : replaced by the blog's title
* \_\_BLOG\_LOGO\_STYLE\_\_ : replaced by the blog's logo style
* \_\_BLOG\_SUBTITLE\_\_ : replaced by the blog's subtitle

__Headimg__

* \_\_SRC\_\_ : replaced by the source of post's image
* \_\_STYLE\_\_ : replaced by the style of post's image
* \_\_ALT\_\_ : replaced by the alt title of the post's image
* \_\_TITLE\_\_ : replaced by the title of the post's image

__Main__

* \_\_ENTRY\_LIST\_\_ : replaced by the list of post's in the home page

__Menu__

* \_\_HREF\_\_ : replaced by the href of the link
* \_\_TARGET\_\_ : replaced by the target of the link
* \_\_TITLE\_\_ : replaced by the title of the link

__Meta__

* \_\_MAIN\_TITLE\_\_ : replaced by the blog's main title
* \_\_TWITTER\_TITLE\_\_ : replaced by the title in card.title or by the title of the current post
* \_\_TWITTER\_DESCRIPTION\_\_ : replaced by the description in card.description or by the description of current post
* \_\_TWITTER\_SITE\_\_ : replaced by your twitter account
* \_\_TWITTER\_IMAGE\_\_ : replaced by the image in card.image or by the image of current post
* \_\_OG\_LOCALE\_\_ : replaced by the blog's locale
* \_\_OG\_TYPE\_\_ : replaced by the type of page
* \_\_OG\_TITLE\_\_ : replaced by the title of og or by the title of current post
* \_\_OG\_URL\_\_ : replaced by the current url
* \_\_OG\_SITE\_NAME\_\_ : replaced by the site name
* \_\_OG\_DESCRIPTION\_\_ : replaced by the description of og or by the description of current post
* \_\_FAVICON\_\_ : replaced by the favicon

__Tagelement__

* \_\_URL\_\_ : replaced by the forged url of the current post
* \_\_TITLE\_\_ : replaced by the title of the current post
* \_\_JSON\_DATE\_\_ : replaced by the json date of the current post
* \_\_DATE\_\_ : replaced by the date of the current post

__Tagentry__

* \_\_TAG\_\_ : replaced by the tag name
* \_\_TAG\_ELEMENT\_\_ : replaced by the tagelement html (list of posts with this tag)

__Tags__

* \_\_COUNT\_TAG\_\_ : replaced by the count of current tag
* \_\_TAG\_ENTRY\_\_ : replaced by the tagentry html
