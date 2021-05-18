(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var {spawn} = require('child_process');
var {exec} = require("child_process");
var fs = require('fs');

influxtest = () => {
  console.log("Influx Test")
//var starttime=req.query.start
//var endtime=req.query.end
//var strt="python3 test.py"//+starttime+" "+endtime
//console.log(strt)
/*exec('python3 script1.py', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
  });*/
//console.log(temppackage)
/*  exec(temppackage, (error, stdout, stderr) => {
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

  var tempcode=req.query.code;
  fs.writeFile('execute.py', tempcode, (err) => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      console.log('Code saved!');
  });
*/

var dataToSend;
const python = spawn('python3', ['test.py']);
python.stdout.on('data', function (data) {
 console.log('Pipe data from python script ...');
 dataToSend = data.toString();
});
python.on('close', (code) => {
console.log(`child process close all stdio with code ${code}`);
});
console.log(dataToSend)
};

},{"child_process":2,"fs":2}],2:[function(require,module,exports){

},{}]},{},[1]);
