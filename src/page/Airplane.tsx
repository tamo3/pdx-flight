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

// Common Airplane Data Type.
export type AirplaneData = {
  Call: string; // "WJA531"
  Cos: number[]; // At least 4 elements, lat, lng (degrees), time (UTC), alt feet(?).
  Cou: string; // "Canada"
  From: string; // "CYYC Calgary, Canada"
  Icao: string; // "C03472"
  Mdl: string; // "Boeing 737NG 7CT/W"
  Op: string; // "WestJet"
  OpIcao: string; // "WJA"
  To: string; // "CYYJ Victoria, Canada"
};

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

// Generate random color based on the 'Call' -- will have the same color for the same Call number.
function randomColor(dat: any): Color {
  function randomColor(id: number): Color {
    const r = xorshift32(id * 3 + 23) / 2 + 0.499; // Makes the dots slightly brighter, reddish.
    const g = xorshift32(id * 7 + 13);
    const b = xorshift32(id) * 13 * 17;
    return new Color(r, g, b); // Color R,G,B = [0..1].
  }
  const hashCode = (s: string) => s.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const h = hashCode(dat.Call || dat.Icao || "unknown");
  return randomColor(h);
}

export const Airplane: FC<AirplaneProps> = ({ dat, color }) => {
  const lat = dat.Cos[0];
  const lng = dat.Cos[1];
  const high = dat.Cos[3];
  const position = Cartesian3.fromDegrees(lng, lat, high);
  const nm: string = dat.Call || "unknown";
  const desc = `<p>From: ${dat.From}<br>To: ${dat.To}<br>Model: ${dat.Mdl}</p>`;
  const colr = color || randomColor(dat);
  const obj: any =
    dat.Call && dat.To ? (
      <PointGraphics color={colr} pixelSize={12} />
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

/*
Example data from AbsbExchange.com: editied by TT:
See here for meanings: https://www.virtualradarserver.co.uk/Documentation/Formats/AircraftList.aspx
Alt: 5225
Call: "WJA531"
Cos: Array(16) [51.089172, -114.023982, 1467331207194, …]
From: "CYYC Calgary, Canada"
Icao: "C03472"
Id: 12596338
Mdl: "Boeing 737NG 7CT/W"
Op: "WestJet"
OpIcao: "WJA"
PosTime: 1467331217210
Spd: 201
Sqk: "1730"
To: "CYYJ Victoria, Canada"
Trak: 180.3
TT: "a"
Type: "B737"

*/
