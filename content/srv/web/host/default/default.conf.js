var hostConf=
{
	"state": true,
	"pos": 0,
	"default_zone": "front", // default zone for /
	"default_page": "home", // default view for /
    "host":
    {
      "*": "All domains",
    },

    "app":
    {
      "log": "Log plugins",
      "core": "Blog core plugins",
    },
}
module.exports = hostConf
