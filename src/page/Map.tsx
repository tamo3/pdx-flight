import React, { FC, useEffect, useState, useRef } from "react";
// import ReactDOM from 'react-dom';
import {
  Viewer,
  Entity /*PointGraphics*/,
  Camera,
  // CameraFlyTo,
  Clock,
  // Scene,
  // Globe,
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
  // Cartesian2,
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
import Airplane, { AirplaneProps } from "./Airplane";
import { Pos2D, OriginalPos, CameraHome, GetCenterPosition } from "./cesium-util";
import "./Map.css";

CCamera.DEFAULT_VIEW_RECTANGLE = CameraHome;
CCamera.DEFAULT_VIEW_FACTOR = 0;

// Custom Hook to generate clock tick event.
// From: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// Cesium has its own clock tick but it is too fast (every 1/60 sec) for this page.
function useInterval(callback: any, delay: number) {
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
}

// Convert JSON data from OpenSky to our format. src is a 2D array.
function openSkyToAirplaneProps(srcJson: any, count: number): AirplaneProps[] {
  const src = srcJson.states;
  const props: AirplaneProps[] = src.map((x: any) => {
    const alt: number = (x[13] ?? x[7] ?? 0) * 3.28; // meter => feet.
    const cos: number[] = [x[6], x[5], x[3], alt]; // lat, lng, time, alt.
    const dst: AirplaneProps = {
      Call: x[1], // "WJA531"
      Cos: cos, // At least 4 elements, lat, lng (degrees), time (UTC), alt feet(?).
      Cou: x[2],
      From: "unknown", // "CYYC Calgary, Canada"
      Icao: x[0], // "C03472"
      Mdl: "unknown", // "Boeing 737NG 7CT/W"
      Op: "unknown", // "WestJet"
      OpIcao: x.OpIcao, // "WJA"
      To: "unknown", // "CYYJ Victoria, Canada"
      MyCnt: count,
    };
    return dst;
  });
  return props;
}

// Calculate the position of the airplane at current time (for each second) by linear interpolation.
// NOTE: airplane data is update every 10 seconds.
function interpolatePosition(x: AirplaneProps, prevData: AirplaneProps[], count: number): AirplaneProps {
  const prev: AirplaneProps[] = prevData.filter((a) => (a.Call === x.Call ? a : null)); // Find the previous data of the same airplane.
  if (!prev || prev.length === 0) return x; // If no previous data found, then just return the current one.
  const n = x.MyCnt - prev[0].MyCnt; // Count value difference.
  let i = count - x.MyCnt; // Where are we in 'n' counts.
  if (i > n) i = n; // Limit to [0...n]/
  if (i < 0) i = 0;
  // Interpolate lat, lng, time (ignored) and alt.
  const cos = x.Cos.map((a, idx) => ((a - prev[0].Cos[idx]) * i) / n + prev[0].Cos[idx]);
  let props = { ...x }; // Clone x to new props.
  props.Cos = cos;
  // if (x.Call === "CMD3    ") console.log(`${count} prev ${prev[0].Cos[0]}  x${x.Cos[0]} ${i}/${n} ${props.Cos[0]}`);
  return props;
}

// Map page component.
function MapPage() {
  // React Hooks:
  const [airplaneData, setAirplaneData] = useState<AirplaneProps[]>([]); // Array of airplane data from the Server.
  const [airplaneData0, setAirplaneData0] = useState<AirplaneProps[]>([]); // Previous data.
  const prevData = useRef(airplaneData0); // Points to the previous airPlaneData, used for interpolation.
  const [needFetch, setNeedFetch] = useState(false);

  const refC = useRef<CesiumComponentRef<Cesium.Viewer>>(null); // Points to Cesium.Viewer.
  const [pos2D, setPos2D] = useState<Pos2D>({
    lng: OriginalPos.lng,
    lat: OriginalPos.lat,
  });

  // Update count every 1 second.
  const [count, setCount] = useState(0);
  useInterval(() => {
    if (needFetch || count % 10 === 0) {
      setNeedFetch(false);
      // Since OpenSky updates data every 10 seconds, fetch only every ~10 seconds.
      const urlBase = "/api/opensky?lng=_LNG_&lat=_LAT_&range=1000000";
      const url = urlBase.replace("_LNG_", pos2D.lng.toString()).replace("_LAT_", pos2D.lat.toString());
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          prevData.current = airplaneData; // Save the current data.
          setAirplaneData(openSkyToAirplaneProps(data, count)); // Set the received data array.
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setCount(count + 1);
  }, 1000); // Clock tick event every 1 second.

  // Camera moved, update position.
  function updatePosition(percentage: number): void {
    const newPos = GetCenterPosition(refC, percentage);
    if (newPos) {
      setPos2D(newPos);
      setNeedFetch(true);
    }
  }

  // Render.
  return (
    <div className='cesiumContainer'>
      <Viewer ref={refC} timeline={false} animation={false}>
        <Camera percentageChanged={0.1} onChange={updatePosition} />
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
          position={Cartesian3.fromDegrees(OriginalPos.lng, OriginalPos.lat)} /* l(long, lat) */
        ></Entity>
        <Entity>
          <div>
            {airplaneData.map((x: any, index: number) => {
              const a = interpolatePosition(x, prevData.current, count);
              return <Airplane key={a.Call + index.toString()} dat={a} />;
            })}
          </div>
        </Entity>
      </Viewer>
      <p>Count : {count}</p>
    </div>
  );
}

export default MapPage;
