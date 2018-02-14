import time
from splinter import Browser
from bs4 import BeautifulSoup
from selenium import webdriver
import pandas as pd
import pymongo
import requests

conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

##INSTRUCTIONS - NASA Mars News

#Scrape the NASA Mars News Site and collect the latest News Title and Paragragh Text. 
#Assign the text to variables that you can reference later.

def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "chromedriver.exe"}
    return Browser("chrome", **executable_path, headless=False)


def scrape():
    
	mars_dict = {}
	url_news = "https://mars.nasa.gov/news/"
	response = requests.get(url_news)
	url_news = "https://mars.nasa.gov/news/"
	soup = BeautifulSoup(response.text, "html.parser")

	news_title_raw = soup.find("div", class_="content_title").text
	news_p_raw = soup.find("div", class_="rollover_description_inner").text    

	news_title= news_title_raw.strip()
	news_p = news_p_raw.strip()

	mars_dict["mars_news_title"] = news_title
	mars_dict["mars_news_p"] = news_p

	##INSTRUCTIONS:JPL Mars Space Images - Featured Image
	#Visit the url for JPL's Featured Space Image here.
	#Use splinter to navigate the site and find the image url for the current Featured Mars Image and assign the url string to a variable called featured_image_url.
	#Make sure to find the image url to the full size .jpg image.
	#Make sure to save a complete url string for this image.'''

	browser = init_browser()
	#defining these a second time for when the first section is commented out for debugging
	html = browser.html
	soup = BeautifulSoup(html, "html.parser")


	url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
	browser.visit(url)

	featured_image_url =  str(soup.find('a', class_='button fancybox')["data-fancybox-href"])

	full_img_url = str("https://www.jpl.nasa.gov") + featured_image_url

	mars_dict["image"] = full_image_url

	##INSTRUCTIONS: Mars Weather
	#Visit the Mars Weather twitter account here and scrape the latest Mars weather tweet from the page. 
	#Save the tweet text for the weather report as a variable called mars_weather.

	url_tweet = "https://twitter.com/marswxreport?lang=en"
	browser.visit(url_tweet)
	time.sleep(1)

	mars_weather = soup.find("p", class_="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text").get_text()

	mars_dict["weather"] = mars_weather

	    	##INSTRUCTIONS:  Mars Facts
		#Visit the Mars Facts webpage here and use Pandas to scrape the table containing facts about the planet including Diameter, Mass, etc.
		#Use Pandas to convert the data to a HTML table string.

	url_facts = "https://space-facts.com/mars/"
	facts_tables = pd.read_html(url_facts)
	mars_facts_df = facts_tables[0]

	mars_facts_df.columns = ["Metric", "Value"]
	mars_facts_df.set_index('Metric', inplace=True)

	#Use Pandas to convert the data to a HTML table string.
	html_table = mars_facts_df.to_html()
	html_table.replace('\n', '')

	hemisphere_image_urls = [
	{"title": "Valles Marineris Hemisphere", "img_url": "https://astropedia.astrogeology.usgs.gov/download/Mars/Viking/cerberus_enhanced.tif/full.jpg"},
	{"title": "Cerberus Hemisphere", "img_url": "https://astropedia.astrogeology.usgs.gov/download/Mars/Viking/schiaparelli_enhanced.tif/full.jpg"},
	{"title": "Schiaparelli Hemisphere", "img_url": "https://astropedia.astrogeology.usgs.gov/download/Mars/Viking/syrtis_major_enhanced.tif/full.jpg"},
	{"title": "Syrtis Major Hemisphere", "img_url": "https://astropedia.astrogeology.usgs.gov/download/Mars/Viking/valles_marineris_enhanced.tif/full.jpg"},
	]

	mars_dict["hemispheres"] = hemisphere_image_urls

	return mars_dict

scrape()