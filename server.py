from flask import Flask, render_template, request, redirect
import os
import pandas as pd
from web3 import Web3
import json

app = Flask(__name__, template_folder='templates')
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.getcwd(), "static"))
ALLOWED_EXTENSIONS = set(['py'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))

with open("static/Market.json", 'r') as f:
     datastore = json.load(f)
     abi = datastore["abi"]
     #print(abi.at('address'))
     contract_address = Web3.toChecksumAddress('0x8e11707e937487bf6f9b70cca9917bc7796bafbb') #datastore["contract_address"]

w3.eth.defaultAccount = w3.eth.accounts[1]


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
        
@app.route('/')
def hello():
    return render_template("index.html",title= 'Etheros')

@app.route("/sensorAdd", methods=['POST', 'GET'])
def sensorAdd():
    if request.method == 'POST':
        # Create the contract instance with the newly-deployed address
        market = w3.eth.contract(address=contract_address, abi=abi)
        #body = request.get_json()
        tag = request.values['tag']
        name = request.values['nameNdesc']
        wallet_addr = request.values['walletaddr'] #'0x29543BAea4aC8aA06f9c01F8aa1c00f4E3970E33'
        _price = Web3.toWei('1.0', "ether")
        print(tag)
        print(name)
        print(_price)

        #if error:
        #    return jsonify(error), 422
        tx_hash = market.functions.sellArticle(
           tag, name, _price
        )
        tx_hash = tx_hash.transact({'from': wallet_addr})
        # Wait for transaction to be mined...
        w3.eth.waitForTransactionReceipt(tx_hash)
        #print(tx_hash)
        #user_data = market.events.LogSellArticle
        #return jsonify({"data": user_data}), 200
        #print(user_data['_seller'])
        #print(user_data['_name'])
        return redirect('/')
    else:
        return render_template("sensorform.html") 

@app.route("/fetchData", methods=['POST', 'GET'])
def sensorAdd():
    if request.method == 'POST':
        #body = request.get_json()
        timeStart = request.values['timeStart']
        timeEnd = request.files['timeEnd']
        uploaded_file = request.files['file']
        if uploaded_file and allowed_file(uploaded_file.filename):
            file_ext = os.path.splitext(uploaded_file.filename)[1]
            filesave = str('MachineLearning') + str(file_ext)
            uploaded_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filesave))
        print(timeStart)
        print(timeEnd)
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)