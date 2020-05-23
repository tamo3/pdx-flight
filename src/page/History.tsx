import React, { FC, useEffect, useState, useRef } from "react";
// import ReactDOM from 'react-dom';
import {
  Viewer,
  Entity /*PointGraphics*/,
  CameraFlyTo,
  Clock,
  Globe,
  Scene,
  CesiumComponentRef,
  // Model,
  // ModelGraphics,
  // Billboard,
  // PointGraphics,
  // BoxGraphics,
  // EllipseGraphics,
} from "resium";
import Cesium, { Cartesian3, ClockViewModel, JulianDate, ClockRange, ClockStep, Transforms, Color } from "cesium";
import Airplane from "./Airplane";

import "./Map.css";

type Pos2D = {
  lat: number;
  lng: number;
};
// const origPos: Pos2D = {lat:33.974, lng:-118.322}; // LA
const origPos: Pos2D = { lat: 45.5895, lng: -122.595172 }; // PDX.
// const position = Cartesian3.fromDegrees(origPos.lng, origPos.lat, 100);
const cameraDest = Cartesian3.fromDegrees(origPos.lng, origPos.lat, 210000);

const timeDivFactor = 20;

function HistoryPage() {
  const urlBase: string = "http://localhost:5000/api?file=2016-07-01-_TIME_Z.json&lng=_LNG_&lat=_LAT_&range=1000000";

  const [airplaneData, setAirplaneData] = React.useState<any>([]);
  const [posTime, setPosTime] = React.useState<Pos2D>({
    lng: origPos.lng,
    lat: origPos.lat,
  });
  const [curTime, setCurTime] = React.useState<number>(0);
  const ref = useRef<CesiumComponentRef<Cesium.Viewer>>(null);

  function onTick() {
    setCurTime(curTime + 1);
    console.log(`QQQ ${curTime}`);
    if (ref.current?.cesiumElement) {
      const clockViewModel = ref.current.cesiumElement.clockViewModel;
      const tm = clockViewModel.currentTime;
      console.log(tm);
      console.log(JulianDate.toDate(tm));
    }
  }

  useEffect(() => {
    if (curTime % timeDivFactor === 0) {
      // Replace longitude & latitude in URL query string.
      const tm = (curTime / timeDivFactor) % 2400;
      const min = Math.floor(tm % 60);
      const hour = Math.floor(tm / 60);
      const timeStr = hour.toString().padStart(2, "0") + min.toString().padStart(2, "0");
      const url = urlBase
        .replace("_LNG_", posTime.lng.toString())
        .replace("_LAT_", posTime.lat.toString())
        .replace("_TIME_", timeStr);
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
    }
  }, [posTime, curTime]);

  const pos: Pos2D = origPos;
  console.log(`curTime is ${curTime}`);

  useEffect(() => {
    if (ref.current?.cesiumElement) {
      // ref.current.cesiumElement is Cesium.Viewer
      // DO SOMETHING
      // const clockViewModel = new ClockViewModel(ref.current.cesiumElement.clock);
      const clockViewModel = ref.current.cesiumElement.clockViewModel;
      const tm = clockViewModel.currentTime;
      console.log(tm);
      console.log(JulianDate.toDate(tm));
    }
  }, []);

  return (
    <div className='cesiumContainer'>
      <button onClick={() => setPosTime(pos)}>Click me</button>
      <Viewer ref={ref}>
        <Clock
          startTime={JulianDate.fromIso8601("2016-07-01")}
          currentTime={JulianDate.fromIso8601("2016-07-01")}
          stopTime={JulianDate.fromIso8601("2016-07-02")}
          clockRange={ClockRange.LOOP_STOP} // loop when we hit the end time
          clockStep={ClockStep.SYSTEM_CLOCK_MULTIPLIER}
          // onTick={onTick}
          multiplier={30} // how much time to advance each tick
          // shouldAnimate // Animation on by default
        />
        {
          curTime === 0 && (
            <CameraFlyTo destination={cameraDest} duration={6} />
          ) /* Move camera only right after page switch*/
        }
        {/* <Scene debugShowFramesPerSecond={true} /> */
        /* Show FPS number */}
        <Entity>
          <div>
            <Clock onTick={onTick} />
            {airplaneData.map((x: any) => {
              return <Airplane key={x.Id} id={x.Id} lng={x.Cos[1]} lat={x.Cos[0]} high={x.Cos[3]} />;
            })}
          </div>
          {/* <Airplane lng={-122.595172} lat={45.5895} high={100} color={Color.CYAN} /> */}
        </Entity>
        <Globe enableLighting />
      </Viewer>
    </div>
  );
}

export default HistoryPage;
