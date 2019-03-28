const express = require('express')
const axios = require ('axios');
const app = express()
const port = 3000

app.get('/', (req, res) => {
	if(req.query.time && req.query.url){
		setTimeout(function(){
		axios.get(decodeURIComponent(req.query.url))
		  .then(function (response) {
		    console.log("OK");
		  })
		  .catch(function (error) {
		    console.log("ERROR");
		  });
		}, parseInt(req.query.time)*1000);
		return res.send(`OK`);
	}
	else{
		return res.sendFile('index.html' , { root : __dirname});
	}
});

app.get('*', function(req, res){
  res.send(`¯\_(ツ)_/¯ - what are you even trying to do?`, 404);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

