var express = require('express');
var app = express();
const bodyParser=require('body-parser');
const {spawn} = require('child_process');
const {exec} = require("child_process");
const fs = require('fs');
var http = require("http");


const port = 5005;
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.json());
// Setting up the public directory
app.use(express.static('src'));
app.set('view engine', 'ejs');

function toTimestamp(strDate){
 var datum = Date.parse(strDate);
 return datum/1000;
}

app.post('/test', function(req,res){

  //var temp=req.query.package;
  //var temppackage= "pip3 install "+
  //test1= req.query;
  console.log(req.query)
  var starttime=req.query.testStart;
  var endtime=req.query.testEnd;
  console.log(starttime)
  console.log(endtime)
  var startstamp=toTimestamp(starttime)
  var endstamp=toTimestamp(endtime) //toTimestamp('02/13/2009 23:31:30')
  //console.log(startstamp)
  //console.log(endstamp)
  var strt="./influxdata.py";
  //console.log(endtime)
  //return res.render('index');

  //var dataToSend;
  ////const python = spawn(strt, [starttime, endtime]);
/*  python.stdout.on('data', function (data) {
   console.log('Pipe data from python script ...');
   dataToSend = data.toString();
  });
  python.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);*/
  // send data to browser
  goto="http://localhost:3000/d/5_8OLaVGk/home?orgId=1&from=1599067885670&to=1599068185670";
  goto1="http://localhost:3000/d/5_8OLaVGk/home?orgId=1&from="+startstamp+"&to="+endstamp //1599067885670&to=1599068185670";
  console.log(goto)
  console.log(goto1)
  res.writeHead(301,{Location: goto1});
  res.end();
//});

})

app.listen(port, () => console.log(`listening on port ${port}!`));

/*
  exec("./influxdata.py", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
*/
