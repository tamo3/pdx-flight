import React, { FC, useEffect } from "react";
// import ReactDOM from 'react-dom';
import {
  Viewer,
  Entity /*PointGraphics*/,
  CameraFlyTo,
  Clock,
  Globe,
  // Model,
  // ModelGraphics,
  // Billboard,
  // PointGraphics,
  // BoxGraphics,
  // EllipseGraphics,
} from "resium";
import { Cartesian3, Transforms, Color } from "cesium";
import Airplane from "./Airplane";

import "./Map.css";

type Pos2D = {
  lat: number;
  lng: number;
};
// const origPos: Pos2D = {lat:33.974, lng:-118.322}; // LA
const origPos: Pos2D = { lat: 45.5895, lng: -122.595172 }; // PDX.
const position = Cartesian3.fromDegrees(origPos.lng, origPos.lat, 100);
const cameraDest = Cartesian3.fromDegrees(origPos.lng, origPos.lat, 210000);

function HistoryPage() {
  const urlBase: string = "http://localhost:5000/api?file=2016-07-01-1400Z.json&lng=_LNG_&lat=_LAT_&range=1000000";

  const [airplaneData, setAirplaneData] = React.useState<any>([]);
  // const [url, setUrl] = React.useState(urlBase);
  const [posTime, setPosTime] = React.useState<Pos2D>({
    lng: origPos.lng,
    lat: origPos.lat,
  });

  let counter: number = 0;
  function onTick() {
    if (counter++ % 64 === 0) {
      // UPdate about every 1 second.
      // const t = Math.floor(counter / 64);
      // SetResult({counter.toString()});
      console.log(`QQQ`);
    }
  }

  useEffect(() => {
    // Replace longitude & latitude in URL query string.
    const url = urlBase.replace("_LNG_", posTime.lng.toString()).replace("_LAT_", posTime.lat.toString());
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setAirplaneData(data); // Set the received data array.
      })
      .catch((err) => {
        console.log("Error!");
        console.log(err);
      });
  }, [posTime]);

  const pos: Pos2D = origPos;
  return (
    <div className='cesiumContainer'>
      <button onClick={() => setPosTime(pos)}>Click me</button>
      <Viewer>
        <Entity position={position}>
          <CameraFlyTo destination={cameraDest} duration={1} />
          <div>
            {airplaneData.map((x: any) => {
              return <Airplane key={x.Id} lng={x.Cos[1]} lat={x.Cos[0]} high={x.Cos[3]} />;
            })}
          </div>
          <Airplane lng={-122.595172} lat={45.5895} high={100} color={Color.CYAN} />
        </Entity>
        <Globe enableLighting />
        {/* <Clock onTick={onTick} /> */}
      </Viewer>
    </div>
  );
}

export default HistoryPage;
