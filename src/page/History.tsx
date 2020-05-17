import React, { FC } from "react";
// import ReactDOM from 'react-dom';
import { Viewer, Entity /*PointGraphics*/, Clock, Globe, Model, CameraFlyTo } from 'resium';
import Cesium, { Cartesian3 } from 'cesium';
import './Map.css';


const glb: string = '../SampleData/models/CesiumAir/Cesium_Air.glb';
const origin = Cartesian3.fromDegrees(-95.0, 40.0, 200000.0);
const cameraDest = Cartesian3.fromDegrees(-95.0, 40.0, 210000);
// const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);


// (-122.595172, 45.5895, 10)}  (long, lat) 

// const urlBase: string = "http://localhost:5000/api?2016-07-01-0000Z.json";
const urlBase: string = "http://localhost:5000/api?file=2016-07-01-1400Z.json";
let url: string;

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

let counter: number = 0;

function onTick() {
  if (counter++ % 64 === 0) { // UPdate about every 1 second.
    // const t = Math.floor(counter / 64);
    console.log(`QQQ`)  
  }
}


const SetResult: FC<{s:string}> = ({s}) => {
  return (
    <div>
      <p>props.str</p>
    </div>
  )
}

function HistoryPage() {
  url = urlBase;
  return (
    <div className='cesiumContainer'>
      <button onClick={fetchData}>Click me</button>
      <Viewer>
        {/* <CameraFlyTo destination={cameraDest} duration={0} />
        <Model
          url={glb}
          modelMatrix={modelMatrix}
          minimumPixelSize={128}
          maximumScale={20000}
          // onReady={action("onReady")}
          // onClick={action("onClick")}
        />{" "} */}
        <Globe enableLighting />
        <Clock
          onTick={onTick}
          // startTime={Cesium.JulianDate.fromIso8601("2013-12-25")}
          // currentTime={Cesium.JulianDate.fromIso8601("2013-12-25")}
          // stopTime={Cesium.JulianDate.fromIso8601("2013-12-26")}
          // clockRange={Cesium.ClockRange.LOOP_STOP} // loop when we hit the end time
          // clockStep={Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER}
          // multiplier={4000} // how much time to advance each tick
          // shouldAnimate // Animation on by default
        />
        <Entity
          description='Portland International Airport'
          name='PDX Airport'
          point={{ pixelSize: 10 }}
          position={Cartesian3.fromDegrees(-122.595172, 45.5895, 10)} /* l(long, lat) */
        ></Entity>
      </Viewer>
      <SetResult s='test' />
    </div>
  );
}

// Clock.onTick.addEventListener(function(clock) {
//   var currentTime = clock.currentTime;
// });

export default HistoryPage;