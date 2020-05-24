import React from "react";
// import ReactDOM from 'react-dom';
import "./Home.css";

// (-122.595172, 45.5895, 10)}  (long, lat) 

//const url = "https://adsbx-flight-sim-traffic.p.rapidapi.com/api/aircraft/json/lat/45.5895/lon/-122.595172/dist/25/";
const url = "https://adsbx-flight-sim-traffic.p.rapidapi.com/api/aircraft/json/lat/_LAT_/lon/_LON_/dist/25/";


function fetchData() {
  fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "adsbx-flight-sim-traffic.p.rapidapi.com",
      "x-rapidapi-key": "ff1949cfaamsh7acf24456654c6fp1f1679jsn2c9d6264fded",
    },
  })
    .then((response) => {
      // console.log(response);
      return response.json();
    })
    .then((data) => {
      // console.log("this is json");
      console.log(data);
    })
    .catch((err) => {
      console.log("Error!");
      console.log(err);
    });
}

function HomePage() {
  return (
    <div className='HomePage'>
      <h2>Home</h2>
      <button onClick={fetchData}>Click me</button>
      <div className='results'></div>
    </div>
  );
}

export default HomePage;
