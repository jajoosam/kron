# ping
Schedule jobs by programatically requesting webhooks 🔗 🕒 😮

ping lets you schedule get requests to your server - which can be extremely useful for deployments on platforms such as [now](https://zeit.co/now), [heroku](https://www.heroku.com), [repl.it](https://repl.it) and anyplace where your applications may sleep, preventing you from using inbuilt timer functions.

ping is not meant to maintain uptime for your application, rather to schedule processes to occour within the precision of ~1s - opening up the possibility of cron jobs 🤖

*example:*
1 hour (`3600` seconds) after this request is sent, `https://google.com` will recieve a `get` request from `https://ping.4ty2.fun`.

```
https://ping.4ty2.fun/?time=3600&url=https://google.com
```

You **should** encode URLs when passing them to ping. Once encoded - your the URLs you pass can have query strings as well 🥳

ping does **not** repeat requests at regular intervals - but you can set periodic requests to ping which let you do that - [example](https://repl.it/@jajoosam/ping-test)


It is recommended you self host ping, the hosted version at https://ping.4ty2.fun is running on a tiny 1GB VPS at [Vultr](https://vultr.com).

Sponsored by [ICYMI](https://icymi.fyi)
