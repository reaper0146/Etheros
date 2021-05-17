require('dotenv').config();
const express= require('express')
const app =express()
const routes = require('./routes')
const Web3 = require('web3')
const utils = require('web3-utils')
//const mongodb = require('mongodb').MongoClient
const contract = require('truffle-contract')
const artifacts = require('./build/contracts/Market.json')
app.use(express.json())
app.use(express.static('./src'))

//console.log(Web3.version)
temp = 1.0;
articlePrice = temp.toString()
const _price = utils.toWei('1.0', "ether");
//console.log(_price)

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
  } else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
}
const LMS = contract(artifacts)
LMS.setProvider(web3.currentProvider)

//home
//sellArticle: async () => {
  //const accounts = await web3.eth.getAccounts();
  //const lms = await LMS.deployed();
//}
//routes(app, lms, accounts)
app.listen(process.env.PORT || 8082, async() => {
  const accounts = await web3.eth.accounts;
  const lms = await LMS.deployed();
  //console.log(accounts[0])
  routes(app, lms, accounts,_price)//, accounts)
  console.log('listening on port 8082');
})
