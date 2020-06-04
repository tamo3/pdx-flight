import React from "react";

// Should not exceed 12 hours
// fetch(
//   "https://aerodatabox.p.rapidapi.com/flights/airports/icao/KPDX/2020-05-25T10%253A00/2020-05-25T20%253A00?withLeg=false&direction=Both",
//   {
//     method: "GET",
//     headers: {
//       "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
//       "x-rapidapi-key": "ff1949cfaamsh7acf24456654c6fp1f1679jsn2c9d6264fded",
//     },
//   }
// )
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//   // URL example: "/api/opensky?lng=-122.595172&lat=45.5895&range=1000000

const urlAirport = "http://localhost:5000/airport";
function getAirport() {
  fetch(urlAirport)
    .then((response) => {
      console.log(response);
      return response.json;
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

const urlAirlane = "/api/opensky?lng=-122.595172&lat=45.5895&range=1000000";
function getAirplane() {
  fetch(urlAirlane)
    .then((response) => {
      // console.log(`res 0 ${res.states[0]}`);
      // console.log(response);
      return response.json();
    })
    .then((data) => {
      const dat: any = data;
      console.log(`data 0 ${dat[0]}`);
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

export default function DebugPage() {
  return (
    <div>
      <h1>Debug Page</h1>
      <button onClick={getAirplane}>AirPlane</button>
      <button onClick={getAirport}>AirPort</button>
    </div>
  );
}
