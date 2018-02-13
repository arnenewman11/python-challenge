from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo
import scrape_mars

app = Flask(__name__)

mongo = PyMongo(app)

# @TODO
    # Create a route and view function that:
    # 1. returns one document from your mongo db
    # 2. renders an index.html template with that data
    # CODE GOES HERE
@app.route('/')
def index():
    #querying mars
    mars = mongo.db.mars.find_one()
    return render_template("index.html", mars=mars)

@app.route('/scrape')
def scrape():
	#create the  mars DB
	mars = mongo.db.mars
	#setup a variable to hold scraped data
	mars_data = scrape_mars.scrape()
	#insert the mars  data
	mars.update(
            {},
            mars_data,
            upsert=True)

	return redirect("http://localhost:5000/", code=302)

if __name__ == "__main__":
    app.run(debug=True)