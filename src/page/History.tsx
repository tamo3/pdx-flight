import React from 'react';
import ReactDOM from 'react-dom';
import { Viewer, Entity /*PointGraphics*/  } from 'resium';
import { Cartesian3 } from 'cesium';
import './Map.css';

// (-122.595172, 45.5895, 10)}  (long, lat) 

//const url = "https://adsbx-flight-sim-traffic.p.rapidapi.com/api/aircraft/json/lat/45.5895/lon/-122.595172/dist/25/";
const url = "http://localhost:5000/api?2016-07-01-0000Z.json";


function fetchData() {
  fetch(url)
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


function HistoryPage() {

  return (
    <div className="cesiumContainer">
      <div className="results"></div>
      <button onClick={fetchData}>Click me</button>
      <Viewer>
        <Entity
          description='Portland International Airport'
          name='PDX Airport'
          point={{ pixelSize: 10 }}
          position={Cartesian3.fromDegrees(-122.595172, 45.5895, 10)}  /* l(long, lat) */
        ></Entity>
      </Viewer>
    </div>
  );
}


export default HistoryPage;