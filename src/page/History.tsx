import React, { FC } from "react";
// import ReactDOM from 'react-dom';
import {
  Viewer,
  Entity /*PointGraphics*/,
  Clock,
  Globe,
  Model,
  ModelGraphics,
  BillboardCollection,
  Billboard,
  CameraFlyTo,
  PointGraphics,
  BillboardGraphics,
  BoxGraphics,
  EllipseGraphics,
} from "resium";
import { Cartesian3, Transforms, Color } from "cesium";
import Airplane from "./Airplane";

import "./Map.css";

const position = Cartesian3.fromDegrees(-122.595172, 45.5895, 100); // (-122.595172, 45.5895, 10)}  (PDX: long, lat)
const cameraDest = Cartesian3.fromDegrees(-122.595172, 45.5895, 210000);

function HistoryPage() {
  const [airplanes, updateAirplanes] = React.useState([]);

  // const SetResult: FC<{ s: string }> = ({ s }) => {
  //   return <p>{s}</p>;
  // };

  let counter: number = 0;
  function onTick() {
    if (counter++ % 64 === 0) {
      // UPdate about every 1 second.
      // const t = Math.floor(counter / 64);
      // SetResult({counter.toString()});
      console.log(`QQQ`);
    }
  }

  // LA: -118.322, 33.974
  const urlBase: string = "http://localhost:5000/api?file=2016-07-01-1400Z.json&lng=-118.322&lat=33.974&range=10000";
  let url: string;

  function fetchData() {
    fetch(url)
      .then((response) => {
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

  url = urlBase;
  return (
    <div className='cesiumContainer'>
      <button onClick={fetchData}>Click me</button>
      <Viewer>
        <Entity position={position}>
          <CameraFlyTo destination={cameraDest} duration={1} />
          <Airplane lng={-122.595172} lat={45.5895} high={100} color={Color.CYAN} />
        </Entity>
        <Globe enableLighting />
        <Clock onTick={onTick} />
      </Viewer>
    </div>
  );
}

export default HistoryPage;
