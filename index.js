const express = require('express');
var mustacheExpress = require('mustache-express');
const axios = require ('axios');
const isbot = require('isbot');
const app = express()
const port = 3000

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

var active = 0;

app.get('/', (req, res) => {
	if(req.query.time && req.query.url && !isbot(req.headers["user-agent"])){
		active+=1;
		setTimeout(function(){
		axios.get(decodeURIComponent(req.query.url))
		  .then(function (response) {
				console.log("OK");
				active-=1;
		  })
		  .catch(function (error) {
				console.log("ERROR");
				active-=1;
		  });
		}, parseInt(req.query.time)*1000);
		return res.send(`OK`);
	}
	else{
		return res.render("index", {current: active});
	}
});

app.get('*', function(req, res){
  res.send(`🤷 - what are you even trying to do?`, 404);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))