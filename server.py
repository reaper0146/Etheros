from flask import Flask, render_template, request, redirect
import requests
import pandas as pd
from web3 import Web3
import json

app = Flask(__name__, template_folder='templates')

w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))

with open("static/Market.json", 'r') as f:
     datastore = json.load(f)
     abi = datastore["abi"]
     #print(abi.at('address'))
     contract_address = Web3.toChecksumAddress('0x8e11707e937487bf6f9b70cca9917bc7796bafbb') #datastore["contract_address"]

w3.eth.defaultAccount = w3.eth.accounts[1]

@app.route('/')
def hello():
    return render_template("index.html",title= 'Etheros')

@app.route("/sensorAdd", methods=['POST', 'GET'])
def sensorAdd():
    if request.method == 'POST':
        # Create the contract instance with the newly-deployed address
        market = w3.eth.contract(address=contract_address, abi=abi)
        body = request.get_json()
        result1 = request.values['tag']
        result2 = request.values['nameNdesc']
        result3 = '0x29543BAea4aC8aA06f9c01F8aa1c00f4E3970E33'
        print(result1)
        print(result2)
        _price = Web3.toWei('1.0', "ether");
        print(_price)
        #if error:
        #    return jsonify(error), 422
        tx_hash = market.functions.sellArticle(
           result1, result2, _price
        )
        tx_hash = tx_hash.transact({'from': result3})
        # Wait for transaction to be mined...
        w3.eth.waitForTransactionReceipt(tx_hash)
        print(tx_hash)
        user_data = market.events.LogSellArticle
        #return jsonify({"data": user_data}), 200
        #print(user_data['_seller'])
        #print(user_data['_name'])
        return redirect('/')
    else:
        return render_template("sensorform.html") 

if __name__ == "__main__":
    app.run(debug=True, port=5000)