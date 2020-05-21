import React, { FC } from "react";
import {
  Entity,
  PointGraphics,
  // BoxGraphics,
  // EllipseGraphics,
} from "resium";
import { Cartesian3, Transforms, Color } from "cesium";

type AirplaneProps = {
  id: number; // ID.
  lng: number;
  lat: number;
  high: number;
  color?: Color;
};

// Generate random value base on the input integer.
function xorshift32(v: number) {
  const UINT32_MAX_NEXT = 2 ** 32;
  v = v ^ (v << 13);
  v = v ^ (v >> 17);
  v = v ^ (v << 15);
  return v / UINT32_MAX_NEXT;
}

// Generate random color based on the ID -- will have the same color for the same ID number.
function randomColor(id: number): Color {
  const r = xorshift32(id);
  const g = xorshift32(id * 7 + 13);
  const b = xorshift32(id) * 13 * 17;
  return new Color(r, g, b); // Color R,G,B = [0..1].
}

export const Airplane: FC<AirplaneProps> = ({ id, lng, lat, high, color }) => {
  // const position = Cartesian3.fromDegrees(-122.595172, 45.5895, 100);
  const position = Cartesian3.fromDegrees(lng, lat, high);
  return (
    <div>
      <Entity position={position}>
        {/* <EllipseGraphics semiMajorAxis={100} semiMinorAxis={100} height={500} material={Color.CYAN} /> */}
        <PointGraphics color={color || randomColor(id)} pixelSize={10} />
      </Entity>
    </div>
  );
};

export default Airplane;
