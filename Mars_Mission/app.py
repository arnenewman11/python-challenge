from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo
import scrape_surf

app = Flask(__name__)

mongo = PyMongo(app)


# @TODO
    # Create a route and view function that:
    # 1. returns one document from your mongo db
    # 2. renders an index.html template with that data
    # CODE GOES HERE
@app.route('/')
def index():
    weather_things = mongo.db.listings.find_one()
    return render_template("index.html", weather_things=weather_things)