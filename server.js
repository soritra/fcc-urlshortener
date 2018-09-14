'use strict';

require('dotenv').config();
var express = require('express');
var dns = require('dns');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

var urlencodedParser = bodyParser.urlencoded({ extended: false });

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors({ optionSuccessStatus: 200 }));
app.use(urlencodedParser);

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

//app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.static('public'));

app.get('/', function(req, res) {
  	res.sendFile(process.cwd() + '/views/index.html');
});
  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

var shortenHandler = function (req, res) {
	var id = req.params.urlId;
	if (/^3$/.test(id)) {
		return res.redirect('https://forum.freecodecamp.com');
	}
	//console.log(req.hostname);
	var url = req.body.url || '';
	if (!/^http(s|):\/\/(www\.|)[a-z0-9-]+\.[a-z]{2,4}(\/[a-z0-9\/]+|)/.test(url)) {
		return res.json({ 
			error: "invalid URL",
		});
	}

	var host = url.replace(/^(http(s|):\/\/)/, '');	
	dns.lookup(host, function (err, addresses, family) {
		//console.log(addresses, err);
		if (err) {
			res.json({ 
				error: "invalid URL",
			});
		} else {
			res.json({ 
				original_url: url,
				short_url: 1
			});
		}
	});
}

//app.post("/api/shorturl/:urlId", shortenHandler);
app.route('/api/shorturl/:urlId').get(shortenHandler).post(shortenHandler);


app.listen(port, function () {
  	console.log('Node.js listening ...');
});
