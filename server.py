from flask import Flask, render_template, request, redirect
import requests
import pandas as p
app = Flask(__name__, template_folder='templates')

@app.route('/')
def hello():
    return render_template("index.html",title= 'Etheros')

if __name__ == "__main__":
    app.run(debug=True, port=5000)