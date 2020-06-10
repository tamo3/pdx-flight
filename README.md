Realtime Flight Tracker usiing Cesium/Resium.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
See the live demo on Heroku [https://pdx-flight.herokuapp.com/](https://pdx-flight.herokuapp.com/).

# Installation

In your working directory:

    git checkout https://github.com/tamo3/pdx-flight.git
    cd pdx-flight
    yarn install

**NOTE: npm install doesn't work. Please use yarn install.**

# Run Locally

From a terminal:

    yarn run server                     # starts node server

From another terminal:

    yarn start                          # starts web application

Linux should work too, but I used only Windows during the development.

To use Historical Flight data, obtain a copy of historical zip file from https://www.adsbexchange.com/, extract them under ./server/historical-data/xxx (for example, ./server/.historical-data/2016-07-01/\*).

# References

This application uses the following libraries and APIs:

- React
- Cesium
- Resium
- Craco
- Material-ui
- axios
- express
- OpenSky (https://opensky-network.org) for Realtime Flight Tracking.
- ABS-B Exchange (https://www.adsbexchange.com/) for Historical Flight Tracking data when running locally.
  ABS-B site has free sample historical data for evaluation (https://www.adsbexchange.com/data/).
  This program interfaces with the format used by the sample data, but should be easy to adapt to any data format.

# Comments
- Airplanes within ~10,000Km from the center of the view are plotted.
- The historical data is missing in the repo or the deployed version. You can see the "Random" data which is generated rondomly. Obviously, I had a math problem generating the random flight data -- most flights are around the north pole :-) 
