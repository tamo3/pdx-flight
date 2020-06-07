///////////////////////////////////////////////////////////////////////////////
// Plot airplanes based on historical data.
//
// - It is assumed the data is from  https://history.adsbexchange.com/downloads/samples/  2016-07-01.zip
//   2016-07-01.zip has all the data for the day, the format seems to be the same as:
//   https://www.virtualradarserver.co.uk/Documentation/Formats/AircraftList.aspx
///////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState, useRef, FC } from "react";
import { Viewer, Entity /*PointGraphics*/, Camera, CameraFlyTo, Globe, CesiumComponentRef } from "resium";
import Cesium, {
  Camera as CCamera,
  Cartesian3,
  JulianDate,
  ClockRange,
  ClockStep,
  PinBuilder,
  Color,
  VerticalOrigin,
} from "cesium";
import Airplane, { AirplaneProps } from "./Airplane";
import { Pos2D, OriginalPos, CameraHome, GetCenterPosition } from "./cesium-util";
import yellowDot from "./yellow.png";
import grayDot from "./gray.png";

// This must match with the data file names served by node server (i.e 2016-07-01-nnnnZ.json, etc)
export const historyOfDate = "2016-07-01";

const cameraDest = Cartesian3.fromDegrees(OriginalPos.lng, OriginalPos.lat, 250000);
CCamera.DEFAULT_VIEW_RECTANGLE = CameraHome;
CCamera.DEFAULT_VIEW_FACTOR = 0;

// Legends at upper-left corner.
const UpperLeftInfo: FC<{ types: string[] }> = ({ types }) => {
  const size = { height: 20, width: 20 };
  return (
    <div>
      <label>
        <select name='history selection' id='history-dropdown'>
          {types.map((x) => (
            <option value={x}>{x}</option>
          ))}
        </select>
      </label>
      <br />
      <img className='my-image' src={yellowDot} alt={"Dot with yellow circle"} style={size} />
      <b> Airplane with call-sign</b>
      <br />
      <img className='my-image' src={grayDot} alt={"Dot with gray circle"} style={size} />{" "}
      <b>Airplane without call-sign</b>
    </div>
  );
};

// History Page component.
const HistoryPage: FC<{ types: string[] }> = ({ types }) => {
  // Server Access URL template: Files are from  https://history.adsbexchange.com/downloads/samples/
  // Extracted 2016-07-01.zip -- has the data for the day, every minutes.

  // React Hooks:
  const [airplaneData, setAirplaneData] = useState<AirplaneProps[]>([]); // Array of airplane data from the Server.
  const [curTime, setCurTime] = useState<number>(0); // Time as seconds from 00:00, i.e "00:03:00" => 180, "01:00" => 3600.
  const refC = useRef<CesiumComponentRef<Cesium.Viewer>>(null); // Points to Cesium.Viewer.
  const [pos2D, setPos2D] = useState<Pos2D>({
    lng: OriginalPos.lng,
    lat: OriginalPos.lat,
  });
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Convert JSON data from ADS-B Exchange to our format. src is an array.
  function adsbToAirplaneProps(src: any): AirplaneProps[] {
    const props: AirplaneProps[] = src.map((x: any) => {
      const dst: AirplaneProps = {
        Call: x.Call, // "WJA531"
        Cos: x.Cos, // At least 4 elements, lng, lat (degrees), time (UTC), alt feet(?).
        Cou: x.Cou, // "Canada"
        From: x.From, // "CYYC Calgary, Canada"
        Icao: x.Icao, // "C03472"
        Mdl: x.Mdl, // "Boeing 737NG 7CT/W"
        Op: x.Op, // "WestJet"
        To: x.To, // "CYYJ Victoria, Canada"
        PosTime: x.PosTime,
        MyCnt: 0, // Not used by History page.
      };
      return dst;
    });
    // Remove duplicated Call-sign entries: https://medium.com/dailyjs/how-to-remove-array-duplicates-in-es6-5daa8789641c
    const callArray = props.map((x) => x.Call);
    const uniqueProps = props.filter((x, index) => callArray.indexOf(x.Call) === index);
    return uniqueProps;
  }

  // Called ~60 times / second. Updates currentTime, which triggers redraw.
  function onTick() {
    let currentTime = curTime;
    if (refC.current?.cesiumElement) {
      // Make sure Viewer is mounted.
      const clockViewModel = refC.current.cesiumElement.clockViewModel;
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
      const urlBase = `/api/history?file=${historyOfDate}-_TIME_Z.json&lng=_LNG_&lat=_LAT_&range=1000000`;
      const url = urlBase
        .replace("_LNG_", pos2D.lng.toString())
        .replace("_LAT_", pos2D.lat.toString())
        .replace("_TIME_", timeStr);
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          //console.log(data);
          setAirplaneData(adsbToAirplaneProps(data)); // Set the received data array.
        })
        .catch((err) => {
          console.log("Error!");
          console.log(err);
        });
    }
  }, [pos2D, curTime]);

  // Camera moved, update position.
  function updatePosition(percentage: number): void {
    const newPos = GetCenterPosition(refC, percentage);
    if (newPos) setPos2D(newPos);
  }

  // Init Clock component.
  useEffect(() => {
    if (refC.current?.cesiumElement) {
      // Make sure Viewer is mounted. ref.current.cesiumElement is Cesium.Viewer

      // Initialize the Clock/Animation Widget.
      const clock = refC.current.cesiumElement.clockViewModel;
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
      const timeLine = refC.current.cesiumElement.timeline;
      timeLine.zoomTo(clock.startTime, clock.stopTime);
    }
  }, []); // ESlint complains about this (add onTick, etc), but if you do so, then things don't work well.
  // I think it is OK because this is a one time initialization.

  const pinBuilder = new PinBuilder();
  const bb: any = {
    image: pinBuilder.fromText("PDX", Color.BLACK, 48).toDataURL(),
    verticalOrigin: VerticalOrigin.BOTTOM,
  };

  // Render
  return (
    <div className='cesiumContainer'>
      <Viewer ref={refC}>
        <Entity
          description='Portland International Airport'
          name='PDX Airport'
          billboard={bb}
          position={Cartesian3.fromDegrees(OriginalPos.lng, OriginalPos.lat)}></Entity>
        <Camera percentageChanged={0.1} onChange={updatePosition} />
        {/* once = Move camera only once */}
        <CameraFlyTo destination={cameraDest} duration={0} once={true} />
        {/* <Scene debugShowFramesPerSecond={true} /> */
        /* Show FPS number */}
        <Entity>
          <div>
            {airplaneData.map((x: any, index: number) => {
              return <Airplane key={x.Call ?? index.toString()} dat={x} />;
            })}
          </div>
        </Entity>
        <Globe enableLighting />
        <div className='toolbar-left history-legend'>
          <UpperLeftInfo types={types} />
        </div>
      </Viewer>
    </div>
  );
};

export default HistoryPage;
