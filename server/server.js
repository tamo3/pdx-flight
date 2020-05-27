// Reference: https://medium.com/@maison.moa/setting-up-an-express-backend-server-for-create-react-app-bc7620b20a61
const express = require('express');
const path = require('path');
//let assert = require('assert');
const fs = require('fs');
//const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 5000;  // Use given port when deployed, or localhost:5000.
var router = express.Router();
const axios = require("axios");


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './build')));
}
else { // TT: not sure if this is needed.
  app.use(express.static(path.join(__dirname, './public')));
}
app.use(express.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));


///////////////////////////////////////////////////////////////////////////////
// Historical Airplane Position Data API
///////////////////////////////////////////////////////////////////////////////

// Calculate distance between 2 points in meters.
function distance(lat1, lng1, lat2, lng2) {
  lat1 *= Math.PI / 180;
  lng1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  lng2 *= Math.PI / 180;
  return 6378137 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
}

// Return true if (lat1,lng1) is withing the circle at (lat0, lng0).
function InRange(shortTrailsCos, circle) {
  return (distance(shortTrailsCos[0], shortTrailsCos[1], circle[0], circle[1]) < circle[2]);
}

app.get('/api', (req, res) => {
  // URL example: "http://localhost:5000/api?file=2016-07-01-0000Z.json&lng=xxx&lat=xxx&range=xxx"

  // 45.423813, -122.727625  // oregon lat, lng
  // 37.799269, -122.463953  // sf  lat, lng   ~800km
  // const dis = distance(45.423813, -122.727625, 37.799269, -122.463953);
  // console.log(dis);

  // Since the following is a synchronous code, no need to try..catch myself(?).
  // Express would catch by itself.
  const file = req.query.file;
  const directory = file.match(/[0-9]+-[0-9]+-[0-9]+/)[0]; // May throw if the file doesn't exist.
  const circle = [req.query.lat, req.query.lng, req.query.range];

  const rawData = fs.readFileSync(`./server/.historical-data/${directory}/${file}`);
  let data = JSON.parse(rawData);

  const inRange = data.acList.filter(x => {
    return (x.TT === 'a' && x.Cos && x.Cos.length >= 4 && InRange(x.Cos, circle));
  })
  // console.log(inRange);
  console.log(`file=${file}  ${circle} ${inRange.length}`);

  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // CORS -- this was necessary.
  res.setHeader('Access-Control-Allow-Origin', '*'); // CORS -- this was necessary.
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.json(inRange);
});




app.get('/tmp', (req, res) => {
  axios({
    "method": "GET",
    "url": "https://cometari-airportsfinder-v1.p.rapidapi.com/api/airports/by-radius",
    "headers": {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "cometari-airportsfinder-v1.p.rapidapi.com",
      "x-rapidapi-key": "eccc71950emsh71a3ca86e50f985p195ea4jsndc1501ca6804"
    }, "params": {
      "radius": "50",
      "lng": "-157.895277",
      "lat": "21.265600"
    }
  })
    .then((response) => {
      console.log(response)
      return response.data;
    })
    .catch((error) => {
      console.log(error)
    })
});


///////////////////////////////////////////////////////////////////////////////
// Realtime Airplane Position Data
///////////////////////////////////////////////////////////////////////////////
app.get('/adsbx', (req, res) => {
  axios({
    "method": "GET",
    "url": "https://adsbx-flight-sim-traffic.p.rapidapi.com/api/aircraft/json/lat/45.5895/lon/-122.595172/dist/25/",
    "headers": {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "adsbx-flight-sim-traffic.p.rapidapi.com",
      "x-rapidapi-key": "ff1949cfaamsh7acf24456654c6fp1f1679jsn2c9d6264fded",
      "useQueryString": true
    }
  })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
})

///////////////////////////////////////////////////////////////////////////////
// Realtime Airplane Position Data using OpenSky
///////////////////////////////////////////////////////////////////////////////

// const origPos: Pos2D = { lat: 45.5895, lng: -122.595172 }; // PDX.
app.get('/opensky', (req, res) => {
  axios({
    "method": "GET",
    "url": "https://opensky-network.org/api/states/all?lamin=44.5895&lomin=-123.595&lamax=46.5895&lomax=-121.595",
  })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
})

app.get('/airport', (req, res) => {
  axios({
    "method": "GET",
    "url": "https://aerodatabox.p.rapidapi.com/flights/airports/icao/KPDX/2019-12-26T12%253A00/2019-12-27T00%253A00",
    "headers": {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
      "x-rapidapi-key": "ff1949cfaamsh7acf24456654c6fp1f1679jsn2c9d6264fded",
      "useQueryString": true
    }, "params": {
      "direction": "Arrival"
    }
  })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })

})
