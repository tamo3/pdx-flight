import React, { FC, useEffect, useState, useRef } from "react";
// import ReactDOM from 'react-dom';
import {
  Viewer,
  Entity /*PointGraphics*/,
  Camera,
  CameraFlyTo,
  Clock,
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
  Camera as CCamera,
  Cartesian2,
  Cartesian3,
  // ClockViewModel,
  JulianDate,
  ClockRange,
  ClockStep,
  Rectangle,
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
const cameraDest = Cartesian3.fromDegrees(origPos.lng, origPos.lat, 250000);
// const origPos: Pos2D = {lat:33.974, lng:-118.322}; // LA
// const position = Cartesian3.fromDegrees(origPos.lng, origPos.lat, 100);
const delta = 1.2;
const camHome = Rectangle.fromDegrees(
  origPos.lng - delta,
  origPos.lat - delta,
  origPos.lng + delta,
  origPos.lat + delta
);
// const camHome = Rectangle.fromDegrees(117.940573, -29.808406, 118.313421, -29.468825);
CCamera.DEFAULT_VIEW_RECTANGLE = camHome;
CCamera.DEFAULT_VIEW_FACTOR = 0;

// Custom Hook to generate clock tick event.
// From: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// Cesium has its own clock tick but it is too fast (every 1/60 sec) for this page.
const useInterval = (callback: any, delay: number) => {
  const savedCallback: any = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

function MapPage() {
  // React Hooks:
  const [airplaneData, setAirplaneData] = useState<any>([]); // Array of airplane data from the Server.
  const [curTime, setCurTime] = useState<number>(0); // Time as seconds from 00:00, i.e "00:03:00" => 180, "01:00" => 3600.
  const ref = useRef<CesiumComponentRef<Cesium.Viewer>>(null); // Points to Cesium.Viewer.
  const [pos2D, setPos2D] = useState<Pos2D>({
    lng: origPos.lng,
    lat: origPos.lat,
  });

  // One time initialization.
  useEffect(() => {
    if (ref.current?.cesiumElement) {
      // ref.current.cesiumElement is Cesium.Viewer
      // DO SOMETHING
      const clockViewModel = ref.current.cesiumElement.clockViewModel;
      const tm = clockViewModel.currentTime;
      console.log(tm);
      console.log(JulianDate.toDate(tm));
    }
  }, []);

  // Parse JSON from
  const UpdateAirplanePositions = (x: any) => {};

  const [apiUpdateTick, setApiUpdateTick] = useState(0);
  const [count, setCount] = useState(0);
  useInterval(() => {
    if (count % 10 == 0) {
      // OpenSky API with anonymous access updates data every 10 seconds.
      setApiUpdateTick((c) => c + 1); // Update apiUpdateTick.
    }
    setCount(count + 1);
  }, 1000); // Clock tick event every 1 second.

  // Fetch data from API via node server.
  useEffect(() => {
    const urlBase = "/api/opensky?lng=_LNG_&lat=_LAT_&range=1000000";
    const url = urlBase.replace("_LNG_", pos2D.lng.toString()).replace("_LAT_", pos2D.lat.toString());
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setAirplaneData(data); // Set the received data array.
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pos2D, apiUpdateTick]);

  return (
    <div className='cesiumContainer'>
      <h3>Count : {count}</h3>
      <Viewer ref={ref}>
        <Clock
          clockRange={ClockRange.LOOP_STOP} // loop when we hit the end time
          clockStep={ClockStep.SYSTEM_CLOCK_MULTIPLIER}
          // onTick={onTick}
          multiplier={30} // how much time to advance each tick
          // shouldAnimate // Animation on by default
        />
        <Entity
          description='Portland International Airport'
          name='PDX Airport'
          point={{ pixelSize: 10 }}
          position={Cartesian3.fromDegrees(origPos.lng, origPos.lat)} /* l(long, lat) */
        ></Entity>
      </Viewer>
    </div>
  );
}

export default MapPage;
