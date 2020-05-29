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
const toFixed = require('tofixed');

console.log('PUBLIC_URL is: ', process.env.PUBLIC_URL);

if (process.env.NODE_ENV === 'production') {
  // NOTE: static pages, such as '/' or '/home' are served by the following code ('express.static'). 
  // __dirname: Node.js script to return the directory where this script is running.
  // Heroku deploy debugging tips: 
  // To see files on Heroku, you can do this:
  //   > heroku login                                    (opens browser)
  //   > heroku run bash --app My-App-Name-In-Heroku     (i.e. pdx-flight)
  //   $ cd app
  //   $ ls
  // To see log (console log) for this server.js:
  //   > heroku logs --tail --app pdx-flight
  //   ... shows the log and it keeps displaying new log messages ...
  // 
  console.log(`QQQ using ${__dirname} ../build`);
  app.use(express.static(path.join(__dirname, '../build'))); // build directory is ./server/../build
}
else {
  // TT: this is not really used. During the debugging, React uses its own server running and doesn't use
  // express server.
  console.log(`QQQ using ${__dirname} ../public`);
  app.use(express.static(path.join(__dirname, '../public'))); // publicdirectory is ./server/../public
}
app.use(express.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));


// Route: /express_backend -- for debugging.
app.get('/debug', (req, res) => {
  console.log('server app.get /express_backend called');
  res.send({ "express": "Hello from Express!" });
});


///////////////////////////////////////////////////////////////////////////////
// Historical Airplane Position Data API
///////////////////////////////////////////////////////////////////////////////

const earthRadius = 6378137; // Meters.

// Calculate distance between 2 points in meters -- assuming the Earth is a perfect sphere.
function distance(lat1, lng1, lat2, lng2) {
  lat1 *= Math.PI / 180;
  lng1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  lng2 *= Math.PI / 180;
  return earthRadius * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
}
function distToDegree(dis) {
  return dis * 180 / Math.PI / earthRadius;
}


// Return true if (lat1,lng1) is withing the circle at (lat0, lng0).
function InRange(shortTrailsCos, circle) {
  return (distance(shortTrailsCos[0], shortTrailsCos[1], circle[0], circle[1]) < circle[2]);
}

app.get('/api', (req, res) => {
  // URL example: "http://host-name:[port]/api?file=2016-07-01-0000Z.json&lng=xxx&lat=xxx&range=xxx"

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
  console.log(`${file} lat:${toFixed(circle[0], 2)} lng:${toFixed(circle[1], 2)} r:${toFixed(circle[2] / 1000, 2)}km found:${inRange.length}`);

  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // CORS -- this was necessary.
  res.setHeader('Access-Control-Allow-Origin', '*'); // CORS -- this was necessary.
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.json(inRange);
});

///////////////////////////////////////////////////////////////////////////////
// Realtime Airplane Position Data using OpenSky
///////////////////////////////////////////////////////////////////////////////
app.get('/opensky', (req, res) => {
  // URL example: "http://host-name:[port]/api?&lng=xxx&lat=xxx&range=xxx"
  const range = req.query.range;
  const d = distToDegree(range);
  const lat = req.query.lat;
  const lng = req.query.lng;
  const url = `https://opensky-network.org/api/states/all?lamin=${lng - d}&lomin=${lnt - d}&lamax=${lng + d}&lomax=${lat + d}`;
  axios({
    "method": "GET",
    "url": url,
  })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
})

