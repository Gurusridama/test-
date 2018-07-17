var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var dbconfig = require('./config/config');
var dbmodel = require('./lib/dbquery');
var mysql = require('mysql');

app.use(cookieParser());
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({ extended: true }) );

var dbconn = mysql.createConnection(dbconfig.dataConfig);

dbconn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
app.get('/getemail/:email', function (req, res) {

	var transporter = nodemailer.createTransport(smtpTransport({
	  service: 'Gmail',
	  host: 'smtp.gmail.com',
	  auth: {
	    user: 'intelliseeker@gmail.com',
	    pass: 'Intelli@58re'
	  }
	}));

	var mailOptions = {
	  from: 'intelliseeker@gmail.com',
	  to: 'gankalagi410@gmail.com',
	  subject: 'Sending Email using Node.js',
	  text: 'That was easy!',
	  html: '<h1>Welcome</h1><p>That was easy!</p>'
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	  res.send(info.response);
	});

	
})

app.get('/getdata/:referenceKey', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'false')
	res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if(typeof req.params.referenceKey!=='undefined' && req.params.referenceKey!=='')
	{
		dbmodel.getdata(req,dbconn,req.params.referenceKey,function(result){
			res.json(result);
		});
	}
})


app.get('/getcdata/:methodname', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'false')
	res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if(typeof req.params.methodname!=='undefined' && req.params.methodname!=='')
	{
		dbmodel.getperticulardata(req,dbconn,req.params.methodname,function(result){
			res.json(result);
		});
	}
	
})

app.post('/postcdata/:methodname', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		
	if(typeof req.params.methodname!=='undefined' && req.params.methodname!=='')
	{
		dbmodel.postdata(req,dbconn,req.params.methodname,function(result){
			res.json(result);
		});
	}
	
})


http.createServer(app).listen(1600, function (err) 
{
	console.log('running server on port 1600');
});