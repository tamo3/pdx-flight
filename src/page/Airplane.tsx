import React, { FC } from "react";
import {
  Entity,
  PointGraphics,
  RectangleGraphics,
  EntityStaticDescription,
  // BoxGraphics,
  // EllipseGraphics,
} from "resium";
import { Cartesian3, Transforms, Color } from "cesium";

type AirplaneProps = {
  dat: any; // JSON data from node server.
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

export const Airplane: FC<AirplaneProps> = ({ dat, color }) => {
  const lng = dat.Cos[1];
  const lat = dat.Cos[0];
  const high = dat.Cos[3];
  const position = Cartesian3.fromDegrees(lng, lat, high);
  const nm: string = dat.Call || "unknown";
  const desc = `<p>From: ${dat.From}<br>To: ${dat.To}<br>Model: ${dat.Mdl}</p>`;
  const colr = color || randomColor(dat.Id);
  const obj: any =
    dat.Call && dat.To ? (
      <PointGraphics color={colr} pixelSize={11} />
    ) : (
      // Without call sign and destination, this is probably a small non passenger airplane, make it look a bit dim.
      <PointGraphics color={colr} pixelSize={6} outlineColor={Color.GRAY} outlineWidth={4} />
      // <RectangleGraphics material={colr} height={8} outlineWidth={8} fill={true} /> -- need coordinates transform!
    );

  return (
    <div>
      <Entity name={nm} description={desc} position={position}>
        {/* <EllipseGraphics semiMajorAxis={100} semiMinorAxis={100} height={500} material={Color.CYAN} /> */}
        {obj}
      </Entity>
    </div>
  );
};

export default Airplane;
