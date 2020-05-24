import React, { FC, useEffect, useState, useRef } from "react";
// import ReactDOM from 'react-dom';
import { Viewer, Entity, /*PointGraphics*/ CesiumComponentRef, Clock } from "resium";
import Cesium, { Cartesian3, ClockViewModel, JulianDate, ClockRange, ClockStep } from "cesium";
import "./Map.css";

function MapPage() {
  const ref = useRef<CesiumComponentRef<Cesium.Viewer>>(null);
  // const refClock = useRef<CesiumComponentRef<Cesium.Viewer.clock>>(null);
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

  return (
    <div className='cesiumContainer'>
      {/* <h1>Map</h1> */}
      <Viewer ref={ref}>
        <Clock
          startTime={JulianDate.fromIso8601("2016-07-01")}
          currentTime={JulianDate.fromIso8601("2016-07-01")}
          stopTime={JulianDate.fromIso8601("2016-07-02")}
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
          position={Cartesian3.fromDegrees(-122.595172, 45.5895, 10)} /* l(long, lat) */
        ></Entity>
      </Viewer>
    </div>
  );
}

export default MapPage;
