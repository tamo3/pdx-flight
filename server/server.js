// Reference: https://medium.com/@maison.moa/setting-up-an-express-backend-server-for-create-react-app-bc7620b20a61
const express = require('express');
const path = require('path');
//let assert = require('assert');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;  // Use given port when deployed, or localhost:5000.

var router = express.Router();


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './build')));
}
else { // TT: not sure if this is needed.
  app.use(express.static(path.join(__dirname, './public')));
}
app.use(express.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// Route: /express_backend -- for debugging.
app.get('/express_backend', (req, res) => {
  console.log('server app.get /express_backend called');
  res.send({ "express": "Hello from Express!" });
});

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

  console.log(`server app.get /api called, file=${file}  ${circle}`);
  const rawData = fs.readFileSync(`./server/.historical-data/${directory}/${file}`);
  let data = JSON.parse(rawData);

  // const withAlt = data.acList.filter(x => {
  //   idx++;
  //   return (x.TT === 'a' && x.Cos && x.Cos.length >= 4)
  // })
  const inRange = data.acList.filter(x => {
    return (x.TT === 'a' && x.Cos && x.Cos.length >= 4 && InRange(x.Cos, circle));
  })
  console.log(inRange);

  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // CORS -- this was necessary.
  res.setHeader('Access-Control-Allow-Origin', '*'); // CORS -- this was necessary.
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.json(inRange);
});



