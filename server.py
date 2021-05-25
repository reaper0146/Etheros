from flask import Flask, render_template, request, redirect
import os, datetime, time
import pandas as pd
from web3 import Web3
import json, sys


app = Flask(__name__, template_folder='templates')
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.getcwd(), "static"))
ALLOWED_EXTENSIONS = set(['py'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))
w3 = Web3(Web3.HTTPProvider('https://ropsten.infura.io/v3/6cc1f696559744a1834146d327efbc88'))
#w3 = Web3(Web3.HTTPProvider('http://host.docker.internal:7545'))

with open("static/Market.json", 'r') as f:
     datastore = json.load(f)
     abi = datastore["abi"]
     #print(abi.at('address'))
     contract_address = Web3.toChecksumAddress('0x8e11707e937487bf6f9b70cca9917bc7796bafbb') #datastore["contract_address"]

w3.eth.defaultAccount = '0xe8d4Ff65d67053b3AF46c3342cb8F7BCfd00a7cd' # w3.eth.accounts[1]

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
        _price = w3.toWei('0.0001', "ether")
        tx_count = (w3.eth.get_transaction_count('0xd3CdA913deB6f67967B99D67aCDFa1712C293601') +100000)
        tx_gasP =  int(w3.eth.gasPrice * 2)
        print(tx_count)
        print(tx_gasP)
        print(name)
        print(_price)
        key = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318'

        #if error:
        #    return jsonify(error), 422
        #tx_hash = market.functions.sellArticle(
        #   tag, name, _price
        #)
        #tx_hash = tx_hash.transact({'from': wallet_addr})
        # Wait for transaction to be mined...
        #w3.eth.waitForTransactionReceipt(tx_hash)
        #print(tx_hash)
        #user_data = market.events.LogSellArticle
        #return jsonify({"data": user_data}), 200
        #print(user_data['_seller'])
        #print(user_data['_name'])
        contract_call = market.functions.sellArticle(
           tag, name, _price
        )
        unsigned_txn = contract_call.buildTransaction({'chainId': 3, 'gasPrice': 10000000000, 'gas': 4500000, 'nonce': tx_count})
        signed_txn = w3.eth.account.sign_transaction(unsigned_txn, private_key=key)
        w3.eth.sendRawTransaction(signed_txn.rawTransaction)
        return redirect('/')
    else:
        return render_template("sensorform.html") 

@app.route("/sendTime", methods=['POST', 'GET'])
def sendTime():
    if request.method == 'POST':
        print("HII")
        #body = request.get_json()
        timeStart = request.json['timeStart']
        print(timeStart)
        timeEnd = request.json['timeEnd']
        print(timeEnd)
        element = datetime.datetime.strptime(timeStart,"%m/%d/%Y %H:%M:%S")
        timestamp1 = int(datetime.datetime.timestamp(element))
        element = datetime.datetime.strptime(timeEnd,"%m/%d/%Y %H:%M:%S")
        timestamp2 = int(datetime.datetime.timestamp(element))
        print(timestamp1)
        print(timestamp2)
        #sys.argv = ['influxdata.py',timestamp1, timestamp2]
        #execfile('influxdata.py')
        temp = 'python influxdata.py ' + str(timestamp1) +" " + str(timestamp2)
        print(temp)
        os.system(temp)
        os.system('rm static/MachineLearning.py')

        return redirect('/')

@app.route("/fetchData", methods=['POST', 'GET'])
def fetchData():
    if request.method == 'POST':


        uploaded_file = request.files['file']
        if uploaded_file and allowed_file(uploaded_file.filename):
            file_ext = os.path.splitext(uploaded_file.filename)[1]
            filesave = str('MachineLearning') + str(file_ext)
            uploaded_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filesave))

    return redirect('/sensorAdd')

  
if __name__ == "__main__":
    app.run(debug=True, port=5000)