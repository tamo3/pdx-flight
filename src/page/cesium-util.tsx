// import React, { useEffect, useState, useRef } from "react";
// import ReactDOM from 'react-dom';
// import {
//   Viewer,
//   Entity /*PointGraphics*/,
//   Camera,
//   CameraFlyTo,
//   Globe,
//   CesiumComponentRef,
//   // Model,
//   // ModelGraphics,
//   // Billboard,
//   // PointGraphics,
//   // BoxGraphics,
//   // EllipseGraphics,
// } from "resium";
import Cesium, {
  Camera as CCamera,
  Cartesian2,
  Cartesian3,
  // ClockViewModel,
  // JulianDate,
  // ClockRange,
  // ClockStep,
  Rectangle,
  // Timeline,
  // Transforms,
  // Color,
} from "cesium";

export type Pos2D = {
  lat: number;
  lng: number;
};

export const OriginalPos: Pos2D = { lat: 45.5895, lng: -122.595172 }; // PDX Airpot.
// const origPos: Pos2D = {lat:33.974, lng:-118.322}; // LA

const delta = 1.2;
export const CameraHome = Rectangle.fromDegrees(
  OriginalPos.lng - delta,
  OriginalPos.lat - delta,
  OriginalPos.lng + delta,
  OriginalPos.lat + delta
);

// Get current center position in Cesium Map.
// refC: points to Cesium.Viewer.
// percentage: how much percentage the map moved.
// https://stackoverflow.com/questions/33348761/get-center-in-cesium-map
export function GetCenterPosition(refC: any, percentage: number): Pos2D | null {
  try {
    if (refC.current?.cesiumElement) {
      const viewer = refC.current?.cesiumElement;
      if (viewer.scene) {
        let lat: number = OriginalPos.lat;
        let lng: number = OriginalPos.lng;
        if (viewer.scene.mode === 3) {
          const windowPosition = new Cartesian2(viewer.container.clientWidth / 2, viewer.container.clientHeight / 2);
          const pickRay = viewer.scene.camera.getPickRay(windowPosition);
          const pickPosition = viewer.scene.globe.pick(pickRay, viewer.scene); // pickPosition can be undefined.
          const pickPositionCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(pickPosition);
          lng = pickPositionCartographic.longitude * (180 / Math.PI);
          lat = pickPositionCartographic.latitude * (180 / Math.PI);
        } else if (viewer.scene.mode === 2) {
          const camPos = viewer.camera.positionCartographic;
          lng = camPos.longitude * (180 / Math.PI);
          lat = camPos.latitude * (180 / Math.PI);
        }
        console.log({ lng, lat });
        // setPos2D({ lng, lat });
        return { lng, lat };
      }
    }
  } catch (error) {
    console.log(error);
  }
  return null;
}
