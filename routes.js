const shortid = require('shortid')
const path = require('path')
const multer = require('multer')
const helpers = require('./helper')
const exec = require('child_process').exec

const storage = multer.diskStorage({
destination: function(req, file, cb) {
    cb(null, './src');
},
filename: function(req, file, cb) {
    cb(null, file.fieldname + '-ML' + path.extname(file.originalname));
}
});

//const _price = utils.toWei('1.0', "ether");

var temp = ''
function routes(app, lms, accounts, _price){

    function toTimestamp(strDate){
      var datum = Date.parse(strDate);
      return datum;
    };


    app.get("/",function(req,res){
        res.sendFile(path + "index.html");
    })
    app.post('/fileUpload', (req,res)=>{
        let idd = shortid.generate()
  //console.log('Post a Customer: ' + JSON.stringify(req.body));

  let upload = multer({ storage: storage, fileFilter: helpers.typeFilter }).single('file');

upload(req, res, function(err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    //console.log(req)
    //console.log(req.file)

    if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    else if (!req.file) {
        return res.send('Please select a python file to upload');
    }
    else if (err instanceof multer.MulterError) {
        return res.send(err);
    }
    else if (err) {
        return res.send(err);
    }
    else
    var cmd = "python3 ./src/file-ML.py"// + timeStart + " " + timeEnd
    exec(cmd, function(err, stdout, stderr) {
      if (err) {
        console.error(err);
        return;
      }
      temp=stdout.toString()
      console.log(temp);
    });
    console.log(temp);
    console.log(typeof(temp));
    setTimeout(() => {    return res.send(temp); }, 5000);


 });

    })

    app.post('/sendTime', (req,res)=>{
      let timeStart = toTimestamp(req.body.timeStart)
      let timeEnd = toTimestamp(req.body.timeEnd)
      var cmd = "python3 ./src/influxdata.py " + timeStart + " " + timeEnd
      console.log(timeStart)
      console.log(cmd)
      exec(cmd, function(err, stdout, stderr) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
      });


    })
    app.post('/sensorAdd', (req,res)=>{
        //let buffer = req.body.tag
        const name = req.body.tag
        const description = req.body.nameNdesc
        const wallet_addr = req.body.wallet_addr
        //console.log(typeof(accounts[0]))


        console.log(wallet_addr)
        //console.log(accounts[0])
        lms.sellArticle(name, description, _price, {from: wallet_addr})
        //let name = req.body.name
        //let title = req.body.title
        //res.sendFile(path + "index.html");
    })
    app.get('/access/:email/:id', (req,res)=>{
        if(req.params.id && req.params.email){


        }else{
            res.status(400).json({"status":"Failed", "reason":"wrong input"})
        }
    })
}
module.exports = routes
