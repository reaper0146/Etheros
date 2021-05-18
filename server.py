from flask import Flask, render_template, request, redirect
import requests
import pandas as pd
from web3 import Web3

app = Flask(__name__, template_folder='templates')

w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

with open("static/Market.json", 'r') as f:
     datastore = json.load(f)
     abi = datastore["abi"]
     contract_address = datastore["contract_address"]

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
        result, error = UserSchema().load(body)
        print(result['tag'])
        print(result['nameNdesc'])
        #if error:
        #    return jsonify(error), 422
        #tx_hash = user.functions.setUser(
        #    result['name'],result['gender']
        #)
        #tx_hash = tx_hash.transact()
        # Wait for transaction to be mined...
        #w3.eth.waitForTransactionReceipt(tx_hash)
        #user_data = user.functions.getUser().call()
        #return jsonify({"data": user_data}), 200
    else:
        return("sensorform.html") 

if __name__ == "__main__":
    app.run(debug=True, port=5000)