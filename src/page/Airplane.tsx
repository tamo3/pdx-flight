import React, { FC } from "react";
import {
  Entity,
  PointGraphics,
  // BoxGraphics,
  // EllipseGraphics,
} from "resium";
import { Cartesian3, Transforms, Color } from "cesium";

type AirplaneProps = {
  lng: number;
  lat: number;
  high: number;
  color?: Color;
};

function randomColor(): Color {
  const r = Math.random();
  const g = Math.random();
  const b = Math.random();
  return new Color(r, g, b);
}

export const Airplane: FC<AirplaneProps> = ({ lng, lat, high, color }) => {
  // const position = Cartesian3.fromDegrees(-122.595172, 45.5895, 100);
  const position = Cartesian3.fromDegrees(lng, lat, high);
  return (
    <div>
      <Entity position={position}>
        {/* <EllipseGraphics semiMajorAxis={100} semiMinorAxis={100} height={500} material={Color.CYAN} /> */}
        <PointGraphics color={color || randomColor()} pixelSize={10} />
      </Entity>
    </div>
  );
};

export default Airplane;
