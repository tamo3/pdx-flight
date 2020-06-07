// Reference: https://medium.com/@maison.moa/setting-up-an-express-backend-server-for-create-react-app-bc7620b20a61
const express = require('express');
const path = require('path');
//let assert = require('assert');
const fs = require('fs');
//const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 5000;  // Use given port when deployed, or localhost:5000.
// var router = express.Router();
const axios = require("axios");
const toFixed = require('tofixed');

console.log('PUBLIC_URL is: ', process.env.PUBLIC_URL);


const KEY_AVIATIONSTACK = process.env.API_KEY_AVIATIONSTACK;


///////////////////////////////////////////////////////////////////////////////
// Static File Serving 
///////////////////////////////////////////////////////////////////////////////

let reactRootDir;

if (process.env.NODE_ENV === 'production') {
  // NOTE: static pages, such as '/' or '/home' are served by the following code ('express.static'). 
  // __dirname: Node.js script to return the directory where this script is running.
  // Heroku deploy debugging tips: 
  // To see files on Heroku, you can do this:
  //   > heroku login                                    (opens browser)
  //   > heroku run bash --app My-App-Name-In-Heroku     (i.e. pdx-flight)
  //   $ ls
  // To see log (console log) for this server.js:
  //   > heroku logs --tail --app pdx-flight
  //   ... shows the log and it keeps displaying new log messages ...
  // 
  console.log(`Using ${__dirname}../build`);
  reactRootDir = '../build';
  // app.use(express.static(path.join(__dirname, '../build'))); // build directory is ./server/../build
}
else {
  // TT: this is not really used. During the debugging, React uses its own server running and doesn't use
  // express server.
  console.log(`Using ${__dirname}../public`);
  reactRootDir = '../public';
  // app.use(express.static(path.join(__dirname, '../public'))); // publicdirectory is ./server/../public
}
app.use(express.static(path.join(__dirname, reactRootDir)));

app.use(express.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));



///////////////////////////////////////////////////////////////////////////////
// Route: /api/debug -- for debugging.
///////////////////////////////////////////////////////////////////////////////
app.get('/api/debug', (req, res) => {
  console.log('server app.get /express_backend called');
  res.send({ "express": "Hello from Express!" });
  // let k = process.env.API_KEY_AVIATIONSTACK;
  // console.log("a" + k);
  // k = process.env.REACT_APP_CESIUM;
  // console.log(k);
});



app.get('/api/weoriu', (req, res) => {
  // Scan directories under .historical-data.
  const directories = fs.readdirSync(`./server/.historical-data/`);
  console.log(' server app.get /express_backend called');
  const k = process.env.REACT_APP_CESIUM;
  const data = { "weoriu": k, "dirs": directories };
  res.send(data);
  console.log(data);
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



app.get('/api/history', (req, res) => {
  // URL example: "/api/history?file=2016-07-01-0000Z.json&lng=-122.595172&lat=45.5895&range=1000000
  // 45.423813, -122.727625  // oregon lat, lng
  // 37.799269, -122.463953  // sf  lat, lng   ~800km
  // const dis = distance(45.423813, -122.727625, 37.799269, -122.463953);

  // Since the following is a synchronous code, no need to try..catch myself(?).
  // Express would catch by itself.
  let file = req.query.file;
  console.log(file);
  if (/*file.indexOf("2038-01-01") === 0 ||*/  file.indexOf("Random") === 0) {
    file = "2016-07-01-0000Z.json";
  }

  let directory = file.match(/[0-9]+-[0-9]+-[0-9]+/)[0]; // May throw if the file doesn't exist.
  const circle = [req.query.lat, req.query.lng, req.query.range];

  const rawData = fs.readFileSync(`./server/.historical-data/${directory}/${file}`);
  let data = JSON.parse(rawData);

  // Filter out data:
  // - Cos[] array has position and time.
  //   TT==='a' means the 4th value is the altitude. Filter out data without the altitude.
  // - Also, if the position is outside of the circular range, filter that out.
  const inRange = data.acList.filter(x => {
    return (x.TT === 'a' && x.Cos && x.Cos.length >= 4 && InRange(x.Cos, circle));
  })
  // console.log(inRange);
  console.log(`${file} lat:${toFixed(circle[0], 2)} lng:${toFixed(circle[1], 2)} r:${toFixed(circle[2] / 1000, 0)}km ${inRange.length} airplanes`);

  res.setHeader('Access-Control-Allow-Origin', '*'); // CORS -- this was necessary.
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.json(inRange); // Send JSON response.
});


///////////////////////////////////////////////////////////////////////////////
// Realtime Airplane Position Data using OpenSky
///////////////////////////////////////////////////////////////////////////////

app.get('/api/opensky', (req, res) => {
  // URL example: "/api/opensky?lng=-122.595172&lat=45.5895&range=1000000"
  const range = req.query.range;
  const d = distToDegree(range);
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const url = `https://opensky-network.org/api/states/all?lamin=${lat - d}&lomin=${lng - d}&lamax=${lat + d}&lomax=${lng + d}`;
  // console.log(url);
  axios({
    "method": "GET",
    "url": url,
  })
    .then((response) => { // Response is JSON format.
      return response.data;
    })
    .then((data) => {
      // console.log(data)
      // res.setHeader('Access-Control-Allow-Origin', '*'); // CORS -- this was necessary.
      // res.setHeader('Access-Control-Allow-Methods', 'GET');
      console.log(data.states[0])
      res.send(data); // Send JSON response.
    })
    .catch((error) => {
      console.log(error + ` url:${url}`)
    })
})



///////////////////////////////////////////////////////////////////////////////
// Realtime Airplane Position Data using AviationStack
// - Used to get destination and origin from call-sign.
///////////////////////////////////////////////////////////////////////////////

// Our volatile database -- just cache already looked up data.
let flightDb = new Map();

app.get('/api/aviationstack', (req, res) => {
  // URL example: "/api/aviationstack?call=UAL2147"
  const callSign = req.query.call.trip();
  // Not quite sure the difference between call sign and CIAO, but the call sign returned by OpenSky can be
  // used as 'ciao' in AviationStack.

  const dat = flightDb.get(callSign);
  if (dat) {
    res.send(dat); // Data already in DB, so just send it (JSON).
  }
  else {
    const params = {
      access_key: KEY_AVIATIONSTACK,
      flight_icao: callSign,
    }
    axios.get('http://api.aviationstack.com/v1/flights', { params })
      .then(response => {
        return response.data;
      })
      .then((data) => {
        console.log(data)
        // res.setHeader('Access-Control-Allow-Origin', '*'); // CORS -- this was necessary.
        // res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.send(data); // Send JSON response.
        flightDb.set(callSign, data); // Add to our database.
      })
      .catch(error => {
        console.log(error);
      });
  }
})


// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, reactRootDir, 'index.html'));
});
