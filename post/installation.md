{
  "author": "adrien",
  "title": "How to install Fortpress",
  "uri": "how-to-install-fortpress",
  "description": "In this post, we will install Fortpress on Debian 8, and make it persistent with Systemd.",
  "date": "2016-11-30T14:00:00.000Z",
  "tags": ["fortpress", "install", "git", "nodejs"],
  "comments": true,
  "share": true
}
<--MARKUP-->

Install Fortpress is really simple : all the necessary is packaged with Fortpress, the only thing you need is NodeJS and git.


# Install NodeJS

On Debian or Ubuntu, the installation of the lastest version of Nodejs is easy :

```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
```

If you are on another system, you can find how to [install NodeJS here](https://nodejs.org/en/download/package-manager/)


# Install Fortpress

To install Fortpress, you need git.

```
sudo apt-get install git
```

Then, go to `/opt` and clone Fortpress :

```
cd /opt && sudo git clone https://github.com/seraum/fortpress
```

We use sudo to be sure that a lambda user couldn't modify files. If you clone it with another user, be sure to give the good permissions to Fortpress :

```
chown -R root: fortpress
chown -R 755 fortpress
```

Next, go to the fresh cloned Fortpress directory and launch it :

```
cd fortpress && node fortpress.js
```

You should see that Fortpress is launching multiple server on port 8080. Try to connect to the blog with your browser at the server url. Example with localhot :

```
http://localhot:8080/
```

# Next step

The next step is to make Fortpress persistent and to bind it to port 80
