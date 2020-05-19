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

import exampleImg from "../SampleData/home.png";

import "./Map.css";

//const glb = "../SampleData/models/CesiumAir/Cesium_Air.glb";
const glb = "./Cesium_Air.glb";
// const glb = '../SampleData/models/GroundVehicle/GroundVehicle.glb'
const origin = Cartesian3.fromDegrees(-95.0, 40.0, 200000.0);
const cameraDest = Cartesian3.fromDegrees(-95.0, 40.0, 210000);
const modelMatrix = Transforms.eastNorthUpToFixedFrame(origin);

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
  if (counter++ % 64 === 0) {
    // UPdate about every 1 second.
    // const t = Math.floor(counter / 64);
    console.log(`QQQ`);
  }
}

const SetResult: FC<{ s: string }> = ({ s }) => {
  return (
    <div>
      <p>props.str</p>
    </div>
  );
};
const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
const center = Cartesian3.fromDegrees(-75.59777, 40.03883);

function HistoryPage() {
  url = urlBase;
  return (
    <div className='cesiumContainer'>
      <button onClick={fetchData}>Click me</button>
      <Viewer>
        <Entity position={position}>
          <Billboard position={new Cartesian3(1000000.0, 0.0, 0.0)} image={exampleImg} />
          <PointGraphics pixelSize={10} />
          <EllipseGraphics semiMajorAxis={300000} semiMinorAxis={300000} />
        </Entity>

        {/* <CameraFlyTo destination={cameraDest} duration={0} /> */}
        {/* <Entity
          description='Portland International Airport'
          name='PDX Airport'
          // point={{ pixelSize: 10 }}
          // position={Cartesian3.fromDegrees(-122.595172, 45.5895, 10)}
        ></Entity> */}
        {/* <Model
          // color={Color.BLACK}
          show
          scale={10}
          url={glb}
          modelMatrix={modelMatrix}
          minimumPixelSize={128}
          maximumScale={20000}
          // onReady={action("onReady")}
          // onClick={action("onClick")}
        /> */}
        <Globe enableLighting />
        <Clock onTick={onTick} />
      </Viewer>
      <SetResult s='test' />
    </div>
  );
}

export default HistoryPage;
