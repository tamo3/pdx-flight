import React, { FC } from "react";
import {
  Entity,
  Model,
  ModelGraphics,
  Billboard,
  CameraFlyTo,
  PointGraphics,
  BillboardGraphics,
  BoxGraphics,
  EllipseGraphics,
} from "resium";
import { Cartesian3, Transforms, Color } from "cesium";

type AirplaneProps = {
  lng: number;
  lat: number;
  high: number;
  color: Color;
};

export const Airplane: FC<AirplaneProps> = ({ lng, lat, high, color }) => {
  // const position = Cartesian3.fromDegrees(-122.595172, 45.5895, 100);
  const position = Cartesian3.fromDegrees(lng, lat, high);
  return (
    <div>
      <Entity position={position}>
        {/* <EllipseGraphics semiMajorAxis={100} semiMinorAxis={100} height={500} material={Color.CYAN} /> */}
        <PointGraphics color={color} pixelSize={10} />
      </Entity>
    </div>
  );
};

export default Airplane;
