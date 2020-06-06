import React, { useState } from "react";
import { CameraFlyTo, Viewer, Entity, Label, LabelCollection } from "resium";
import { Cartesian3, Color, Transforms } from "cesium";
import { OriginalPos, useInterval } from "./cesium-util";

// Info at upper-left corner: about me.
function UpperLeftInfo() {
  return (
    <div>
      <b>
        Created by: <a href='https://tamo3.github.io/3-music.html'>Tamotsu Tanabe</a>
        <br />
        <a href='https://www.pdx.edu/'>pdx.edu</a> 2020 Spring Web Class Project
      </b>
    </div>
  );
}

// About me page component.
function AboutMe() {
  const [count, setCount] = useState(0);

  type destSet = {
    loc: Cartesian3;
    name: string;
    duration: number;
  };

  const start = { loc: Cartesian3.fromDegrees(36, -5.0, 30000000), name: "start", duration: 0 };
  const pdx = { loc: Cartesian3.fromDegrees(OriginalPos.lng, OriginalPos.lat, 10000), name: "pdx", duration: 5 };
  const back = { loc: Cartesian3.fromDegrees(-120.0, 45.0, 10000000), name: "back", duration: 3 };
  let dest = start;

  useInterval(() => {
    setCount(count + 1);
  }, 1000); // Clock tick event every 1 second.
  if (count < 3) dest = start;
  else if (count < 8) dest = pdx;
  else dest = back;
  // console.log(`${count} ${dest.name}`);

  const desc = "Web: React, Cesium, Resium, Material-ui<br>Server: node.js, express, axios";

  return (
    <div className='cesiumContainer'>
      <Viewer timeline={false} animation={false}>
        {count === 0 || count === 3 || count === 8 ? (
          <CameraFlyTo destination={dest.loc} duration={dest.duration} />
        ) : null}
        <Entity name='Libraries' description={desc} selected={count > 10 ? true : false}>
          <LabelCollection modelMatrix={Transforms.eastNorthUpToFixedFrame(pdx.loc)}>
            <Label fillColor={Color.CYAN} position={new Cartesian3(-1000000.0, -250000.0, 0.0)} text='React' />
            <Label fillColor={Color.LIME} position={new Cartesian3(0.0, 0.0, 0.0)} text='Cesium' />
            <Label fillColor={Color.YELLOW} position={new Cartesian3(1000000.0, 250000.0, 0.0)} text='Resium' />
          </LabelCollection>
        </Entity>
        {count > 11 ? (
          <div className='toolbar-left'>
            <UpperLeftInfo />{" "}
          </div>
        ) : null}
      </Viewer>
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
