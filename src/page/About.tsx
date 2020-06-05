import React, { useEffect, useState, useRef, FC } from "react";
// import ReactDOM from 'react-dom';
import {
  CesiumWidget,
  CameraFlyTo,
  Viewer,
  Entity /*PointGraphics*/,
  Camera,
  CesiumComponentRef,
  Label,
  LabelCollection,
} from "resium";
import Cesium, {
  Camera as CCamera,
  Cartesian3,
  Color,
  PinBuilder,
  Rectangle,
  VerticalOrigin,
  Transforms,
} from "cesium";
import { Pos2D, OriginalPos, CameraHome, GetCenterPosition, useInterval } from "./cesium-util";

const cameraDest = Cartesian3.fromDegrees(OriginalPos.lng, OriginalPos.lat, 250000);

const delta = 1.2;
const CameraStart = Rectangle.fromDegrees(
  OriginalPos.lng - delta,
  OriginalPos.lat - delta,
  OriginalPos.lng + delta,
  OriginalPos.lat + delta
);
CCamera.DEFAULT_VIEW_RECTANGLE = CameraStart;
CCamera.DEFAULT_VIEW_FACTOR = 0;

// About me page component.
function AboutMe() {
  const [count, setCount] = useState(0);

  type destSet = {
    loc: Cartesian3;
    name: string;
    duration: number;
  };

  const start = { loc: Cartesian3.fromDegrees(36, -5.0, 30000000), name: "start", duration: 0 };
  const pdx = { loc: Cartesian3.fromDegrees(OriginalPos.lng, OriginalPos.lat, 600000), name: "pdx", duration: 7 };
  const back = { loc: Cartesian3.fromDegrees(-120.0, 45.0, 10000000), name: "back", duration: 3 };
  let dest = start;

  useInterval(() => {
    setCount(count + 1);
  }, 1000); // Clock tick event every 1 second.
  if (count < 5) dest = start;
  else if (count < 10) dest = pdx;
  else dest = back;
  console.log(`${count} ${dest.name}`);

  return (
    <div className='cesiumContainer'>
      <CesiumWidget>
        {count < 20 && count % 5 === 0 ? <CameraFlyTo destination={dest.loc} duration={dest.duration} /> : null}
        <LabelCollection modelMatrix={Transforms.eastNorthUpToFixedFrame(pdx.loc)}>
          <Label fillColor={Color.CYAN} position={new Cartesian3(-1000000.0, -250000.0, 0.0)} text='React' />
          <Label fillColor={Color.LIME} position={new Cartesian3(0.0, 0.0, 0.0)} text='Cesium' />
          <Label fillColor={Color.YELLOW} position={new Cartesian3(1000000.0, 250000.0, 0.0)} text='Resium' />
        </LabelCollection>
      </CesiumWidget>
      <p>
        Dbg Count : {count} {dest.name} duration:{dest.duration}
      </p>
    </div>
  );
}

function AboutPage() {
  return <AboutMe />;
}

export default AboutPage;
