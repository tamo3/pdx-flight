// Reference: https://medium.com/@maison.moa/setting-up-an-express-backend-server-for-create-react-app-bc7620b20a61
const express = require('express');
const path = require('path');
//let assert = require('assert');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;  // Use given port when deployed, or localhost:5000.

var router = express.Router();


if(process.env.NODE_ENV === 'production') {
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


app.get('/api', (req, res) => {
  console.log('server app.get /api called');

  const rawdata = fs.readFileSync('./server/.historical-data/2016-07-01/2016-07-01-0000Z.json');
  let data = JSON.parse(rawdata);
  console.log(data);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // CORS -- this was necessary.
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.send(data);
});



