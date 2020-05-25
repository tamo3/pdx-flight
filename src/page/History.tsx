// Plot airplanes based on historical data.
//
// - It is assumed the data is from  https://history.adsbexchange.com/downloads/samples/  2016-07-01.zip
//   2016-07-01.zip has all the data for the day, the format seems to be the same as:
//   https://www.virtualradarserver.co.uk/Documentation/Formats/AircraftList.aspx

import React, { useEffect, useState, useRef } from "react";
// import ReactDOM from 'react-dom';
import {
  Viewer,
  Entity /*PointGraphics*/,
  CameraFlyTo,
  // Clock,
  // Scene,
  Globe,
  CesiumComponentRef,
  // Model,
  // ModelGraphics,
  // Billboard,
  // PointGraphics,
  // BoxGraphics,
  // EllipseGraphics,
} from "resium";
import Cesium, {
  Cartesian3,
  // ClockViewModel,
  JulianDate,
  ClockRange,
  ClockStep,
  // Timeline,
  // Transforms,
  // Color,
} from "cesium";
import Airplane from "./Airplane";

import "./Map.css";

type Pos2D = {
  lat: number;
  lng: number;
};

export const historyOfDate = "2016-07-01"; // This must match with the data file names served by node server (i.e 2016-07-01-nnnnZ.json, etc)

const origPos: Pos2D = { lat: 45.5895, lng: -122.595172 }; // PDX.
const cameraDest = Cartesian3.fromDegrees(origPos.lng, origPos.lat, 210000);
// const origPos: Pos2D = {lat:33.974, lng:-118.322}; // LA
// const position = Cartesian3.fromDegrees(origPos.lng, origPos.lat, 100);

function HistoryPage() {
  // Server Access URL template: Files are from  https://history.adsbexchange.com/downloads/samples/
  // Extracted 2016-07-01.zip -- has the data for the day, every minutes.

  // React Hooks:
  const [airplaneData, setAirplaneData] = useState<any>([]); // Array of airplane data from the Server.
  const [curTime, setCurTime] = useState<number>(0); // Time as seconds from 00:00, i.e "00:03:00" => 180, "01:00" => 3600.
  const ref = useRef<CesiumComponentRef<Cesium.Viewer>>(null); // Points to Cesium.Viewer.
  const [pos2D, setPos2D] = useState<Pos2D>({
    lng: origPos.lng,
    lat: origPos.lat,
  });

  // Called ~60 times / second. Updates currentTime, which triggers redraw.
  function onTick() {
    let currentTime = curTime;
    if (ref.current?.cesiumElement) {
      // Make sure Viewer is mounted.
      const clockViewModel = ref.current.cesiumElement.clockViewModel;
      const tm = clockViewModel.currentTime;
      // console.log(tm); console.log(JulianDate.toIso8601(tm, 0)); // => "2016-07-01T00:00:00Z"
      const t = JulianDate.toIso8601(tm, 0).match(/[0-9][0-9]:/g);
      if (t?.length && t?.length >= 2) {
        // Calculated seconds from 00:00:00.
        currentTime = (Number(t[0].substr(0, 2)) * 60 + Number(t[1].substr(0, 2))) * 60;
      }
    }
    setCurTime(currentTime);
  }

  // Fetch data from node server based on the position and time.
  useEffect(() => {
    if (1) {
      const minutes = curTime / 60; // minutes from 00:00.
      const min = Math.floor(minutes % 60);
      const hour = Math.floor(minutes / 60);
      const timeStr = hour.toString().padStart(2, "0") + min.toString().padStart(2, "0");
      const urlBase = `http://localhost:5000/api?file=${historyOfDate}-_TIME_Z.json&lng=_LNG_&lat=_LAT_&range=1000000`;
      const url = urlBase
        .replace("_LNG_", pos2D.lng.toString())
        .replace("_LAT_", pos2D.lat.toString())
        .replace("_TIME_", timeStr);
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // console.log(data);
          setAirplaneData(data); // Set the received data array.
        })
        .catch((err) => {
          console.log("Error!");
          console.log(err);
        });
    }
  }, [pos2D, curTime]);

  // Init Clock component.
  useEffect(() => {
    if (ref.current?.cesiumElement) {
      // Make sure Viewer is mounted.
      // ref.current.cesiumElement is Cesium.Viewer

      // Initialize the Clock/Animation Widget.
      const clock = ref.current.cesiumElement.clockViewModel;
      // const tm = clock.currentTime; console.log(tm); console.log(JulianDate.toDate(tm));
      clock.currentTime = JulianDate.fromIso8601(historyOfDate);
      clock.startTime = JulianDate.fromIso8601(historyOfDate);
      clock.stopTime = JulianDate.addDays(clock.startTime, 1, clock.stopTime);
      clock.clockRange = ClockRange.LOOP_STOP; // loop when we hit the end time
      clock.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;
      clock.clock.onTick.addEventListener(onTick);
      clock.multiplier = 30; // 30sec/tick => 1-data-set/min, so airplanes make 1 minutes worth of movement every 2 sec.
      // shouldAnimate // Animation is turned off at page load.

      // Initialize timeLine Widget at the bottom.
      const timeLine = ref.current.cesiumElement.timeline;
      timeLine.zoomTo(clock.startTime, clock.stopTime);
    }
  }, []); // ESlint complains about this (add onTick, etc), but if you do so, then things don't work well.
  // I think it is OK because this is a one time initiazation.

  return (
    <div className='cesiumContainer'>
      <Viewer ref={ref}>
        {
          curTime === 0 && (
            <CameraFlyTo destination={cameraDest} duration={6} />
          ) /* Move camera only right after page switch*/
        }
        {/* <Scene debugShowFramesPerSecond={true} /> */
        /* Show FPS number */}
        <Entity>
          <div>
            {airplaneData.map((x: any) => {
              return <Airplane key={x.Id} dat={x} />;
            })}
          </div>
        </Entity>
        <Globe enableLighting />
      </Viewer>
    </div>
  );
}

export default HistoryPage;
