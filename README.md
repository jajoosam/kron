
<p align="center">
  <img src="https://res.cloudinary.com/jajoosam/image/upload/v1553837488/kron_1_my3lcm.png"><br>
  <strong>Schedule jobs by programatically requesting webhooks 🔗 🕒 😮</strong> 
</p>
<br>

kron lets you schedule get requests to your server - which can be extremely useful for deployments on platforms such as [repl.it](https://repl.it), [glitch](https://glitch.com), [now](https://zeit.co/now), [heroku](https://www.heroku.com) - and any place where your applications may sleep, preventing you from using inbuilt timer functions.

kron is not meant to maintain uptime for your application, rather to schedule processes to occour within the precision of ~1s - opening up the possibility of cron jobs 🤖

*example*: **POST** https://kron.fun/new

`1 hour` after this request is sent, `https://example.com/sendEmail` will recieve a `POST` request from https://kron.fun.

```json
{
  "url": "https://example.com/sendEmail",
  "duration": "1 hour",
  "method": "POST",
  "payload":{
    "username": "johnDoe",
    "ID": "3wr12rfcewu"
  }
}
```

Full documentation on https://kron.fun/docs 💯

Is kron useful to you? Consider helping out on [patreon](https://patreon.com/jajoosam) 😄
