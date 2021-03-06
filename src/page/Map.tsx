///////////////////////////////////////////////////////////////////////////////
// Display Realtime Airplane Positions
///////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState, useRef, FC } from "react";
// import ReactDOM from 'react-dom';
import { Viewer, Entity /*PointGraphics*/, Camera, CesiumComponentRef } from "resium";
import Cesium, { Camera as CCamera, Cartesian3, Color, PinBuilder, VerticalOrigin } from "cesium";
import Airplane, { AirplaneProps } from "./Airplane";
import { Pos2D, OriginalPos, CameraHome, GetCenterPosition, useInterval } from "./cesium-util";

CCamera.DEFAULT_VIEW_RECTANGLE = CameraHome;
CCamera.DEFAULT_VIEW_FACTOR = 0;

// Shallow comparison.
function shallowEqual(obj1: any, obj2: any): boolean {
  return (
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key])
  );
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
      To: "unknown", // "CYYJ Victoria, Canada"
      PosTime: x[4],
      MyCnt: count,
    };
    return dst;
  });
  // Remove duplicated Call-sign entries: https://medium.com/dailyjs/how-to-remove-array-duplicates-in-es6-5daa8789641c
  const callArray = props.map((x) => x.Call);
  const uniqueProps = props.filter((x, index) => callArray.indexOf(x.Call) === index);
  return uniqueProps;
}

// Calculate the position of the airplane at current time (for each second) by linear interpolation.
// NOTE: airplane data is update every 10 seconds.
function interpolatePosition(x: AirplaneProps, prevData: AirplaneProps[], count: number): AirplaneProps {
  const prev: AirplaneProps[] = prevData.filter((a) => (a.Call === x.Call ? a : null)); // Find the previous data of the same airplane.
  if (!prev || prev.length === 0) {
    // console.log(`prev is ${prev}`);
    return x; // If no previous data found, then just return the current one.
  }
  const n = x.MyCnt - prev[0].MyCnt; // Count value difference.
  let i = count - x.MyCnt; // Where are we in 'n' counts.
  if (i > n) i = n; // Limit to [0...n]/
  if (i < 0) i = 0;
  // Interpolate lat, lng, time (ignored) and alt.
  const cos = x.Cos.map((a, idx) => ((a - prev[0].Cos[idx]) * i) / n + prev[0].Cos[idx]);
  let props = { ...x }; // Clone x to new props.
  props.Cos = cos;
  if (x.Call === "CGVJK   ") console.log(`${count} prev ${prev[0].Cos[0]}  x${x.Cos[0]} ${i}/${n} ${props.Cos[0]}`);
  return props;
}

// Info at upper-left corner: display error message when Cesium Key could not be set.
function UpperLeftInfo() {
  return (
    <div>
      <b>
        Could not get Cesium key.
        <br />
        Forgot to set my_cesium_key?
      </b>
    </div>
  );
}

type MapProps = {
  keyFetch: number;
};

// Map page component.
const MapPage: FC<MapProps> = ({ keyFetch }) => {
  // React Hooks:
  const [airplaneData, setAirplaneData] = useState<AirplaneProps[]>([]); // Array of airplane data from the Server.
  const [airplaneData0, setAirplaneData0] = useState<AirplaneProps[]>([]); // Previous data, used as a storage for prefData.
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
          if (!shallowEqual(prevData.current, airplaneData)) prevData.current = airplaneData; // Save the current data.
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
      // setCount(((count + 9) / 10) * 10);
    }
  }

  // Initialize once.
  useEffect(() => {
    if (refC.current?.cesiumElement) {
      // Make sure Viewer is mounted. ref.current.cesiumElement is Cesium.Viewer
      // Change map surface to Bing street map.
      const baseLayerPickerViewModel = refC.current.cesiumElement.baseLayerPicker.viewModel;
      baseLayerPickerViewModel.selectedImagery = baseLayerPickerViewModel.imageryProviderViewModels[2];
    }
  }, []);

  // This worked!
  // from: https://sandcastle.cesium.com/?src=Map%20Pins.html
  const pinBuilder = new PinBuilder();
  const bb: any = {
    image: pinBuilder.fromText("PDX", Color.BLACK, 48).toDataURL(),
    verticalOrigin: VerticalOrigin.BOTTOM,
  };

  // Render.
  // console.log("keyFetch = " + keyFetch);
  return (
    <div className='cesiumContainer'>
      <Viewer ref={refC} timeline={false} animation={false}>
        <Camera percentageChanged={0.1} onChange={updatePosition} />
        <Entity
          description='Portland International Airport'
          name='PDX Airport'
          billboard={bb}
          // billboard={{ image: "Untitled.png" }}
          // point={{ pixelSize: 10 }}
          position={Cartesian3.fromDegrees(OriginalPos.lng, OriginalPos.lat)}></Entity>
        <Entity>
          <div>
            {airplaneData.map((x: any, index: number) => {
              const a = interpolatePosition(x, prevData.current, count);
              return <Airplane key={a.Call ?? index.toString()} dat={a} />;
            })}
          </div>
        </Entity>
        {keyFetch < 0 ? <div className='toolbar-left'>{keyFetch < 0 ? <UpperLeftInfo /> : null}</div> : null}
      </Viewer>
      <p>Dbg Count : {count}</p>
    </div>
  );
};

export default MapPage;
