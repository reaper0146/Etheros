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
