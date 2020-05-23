import React, { FC, useEffect, useState, useRef } from "react";
// import ReactDOM from 'react-dom';
import { Viewer, Entity, /*PointGraphics*/ CesiumComponentRef } from "resium";
import Cesium, { Cartesian3, ClockViewModel } from "cesium";
import "./Map.css";

function MapPage() {
  const ref = useRef<CesiumComponentRef<Cesium.Viewer>>(null);
  const refClock = useRef<CesiumComponentRef<Cesium.Viewer.clock>>(null);
  useEffect(() => {
    if (ref.current?.cesiumElement) {
      // ref.current.cesiumElement is Cesium.Viewer
      // DO SOMETHING
      let clockViewModel = new ClockViewModel(ref.current.cesiumElement.clock);
      const tm = clockViewModel.currentTime;
      // console.log(tm);
    }
  }, []);

  return (
    <div className='cesiumContainer'>
      {/* <h1>Map</h1> */}
      <Viewer ref={ref}>
        <Entity
          description='Portland International Airport'
          name='PDX Airport'
          point={{ pixelSize: 10 }}
          position={Cartesian3.fromDegrees(-122.595172, 45.5895, 10)} /* l(long, lat) */
        ></Entity>
      </Viewer>
    </div>
  );
}

export default MapPage;
