import pandas as  pd
import numpy as np 

# SQL Alchemy
from sqlalchemy import create_engine,Column, Integer, String, Float,  func, DateTime, ForeignKey, inspect, MetaData, and_
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

import matplotlib.pyplot as plt

# PyMySQL 
import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask, jsonify

# Create an engine for the `hawaii.sqlite` database
engine = create_engine("sqlite:///hawaii.sqlite", echo=False)
conn = engine.connect()

# Declare a base to reflect database tables
Base = automap_base()
Base.prepare(engine, reflect=True)

# Assign the classes to variables

Stations = Base.classes.stations
Measurements = Base.classes.measurements

session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/<start><br/>"
        f"/api/v1.0/<start>/<end>"
    )

@app.route("/api/v1.0/precipitation")
def precipitation():
    """Query for the dates and temperature observations from the last year.
    Convert the query results to a Dictionary using date as the key and tobs as the value.
    Return the json representation of your dictionary."""

    precip_results = session.query(Measurements.date, Measurements.prcp).filter(Measurements.date >= '2016-08-23').\
    group_by(Measurements.date).\
    order_by(Measurements.date.desc()).all()

     # Create a dictionary from the row data and append to a list of all_passengers
    precip_data = []
    for row in precip_results:
        precip_dict = {}
        precip_dict["date"] = row.date
        precip_dict["precip"] = row.prcp
        precip_data.append(precip_dict)

    return jsonify(precip_data)
    
    
@app.route("/api/v1.0/stations")
def stations():
    """Return a json list of stations from the dataset."""

    station_results = session.query(Stations.station, Stations.name).all()

    station_data = []
    for row in station_results:
        station_dict = {}
        station_dict["station"] = row.station
        station_dict["name"] = row.name
        station_data.append(station_dict)

    return jsonify(station_data)
    
@app.route("/api/v1.0/tobs")
def prior_year_temp():
    """Return a json list of Temperature Observations (tobs) for the previous year"""

    tobs_data = session.query(Measurements.tobs).all()
    return jsonify (tobs_data)


@app.route("/api/v1.0/<start>")
def start_date_temp(start):
    """Return a json list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.
    When given the start only, calculate TMIN, TAVG, and TMAX for all dates greater than and equal to the start date."""

    tmax = session.query(func.max(Measurements.tobs)).filter(Measurements.date >= start).all()
    tmin = session.query(func.min(Measurements.tobs)).filter(Measurements.date >= start).all()
    tavg = session.query(func.avg(Measurements.tobs)).filter(Measurements.date >= start).all()
    
    temp_stats = {"tmax": tmax, "tmin": tmin, "tavg":tavg}

    return jsonify(temp_stats)
    
@app.route("/api/v1.0/<start>/<end>")
def start_end_temp(start,end):
    """Return a json list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.
    When given the start and the end date, calculate the TMIN, TAVG, and TMAX for dates between the start and end date inclusive."""
    tmax = session.query(func.max(Measurements.tobs)).filter(and_(Measurements.date >= start, Measurements.date <= end)).all()
    tmin = session.query(func.min(Measurements.tobs)).filter(and_(Measurements.date >= start, Measurements.date <= end)).all()
    tavg = session.query(func.avg(Measurements.tobs)).filter(and_(Measurements.date >= start, Measurements.date <= end)).all()
    
    temp_stats = {"tmax": tmax, "tmin": tmin, "tavg":tavg}

    return jsonify(temp_stats)
    
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)    