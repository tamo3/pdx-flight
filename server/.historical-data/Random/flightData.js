// Todo:
const OriginalPos = { lat: 45.5895, lng: -122.595172 }; // PDX Airpot.

const earthRadius = 6378137; // Meters.

// Calculate distance between 2 points in meters -- assuming the Earth is a perfect sphere.
function distance(lat1, lng1, lat2, lng2) {
  lat1 *= Math.PI / 180;
  lng1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  lng2 *= Math.PI / 180;
  return earthRadius * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
}
// Convert dist in meters to degrees on the earth surface.
function distToDegree(dis) {
  return dis * 180 / Math.PI / earthRadius;
}


/*
const props: AirplaneProps[] = src.map((x: any) => {
  const dst: AirplaneProps = {
    Call: x.Call, // "WJA531"
    Cos: x.Cos, // At least 4 elements, lat,lng (degrees), time (UTC), alt feet(?).
    Cou: x.Cou, // "Canada"
    From: x.From, // "CYYC Calgary, Canada"
    Icao: x.Icao, // "C03472"
    Mdl: x.Mdl, // "Boeing 737NG 7CT/W"
    Op: x.Op, // "WestJet"
    To: x.To, // "CYYJ Victoria, Canada"
    PosTime: x.PosTime,
    MyCnt: 0, // Not used by History page.
  };
  return dst;
});
*/

class AirCraft {
  constructor(lat, lng, alt, r, v, angle, id) {
    this.lat = lat;
    this.lng = lng;
    this.alt = alt;         // altitude in meters.
    this.r = r;             // km
    this.v = v;             // km / hour
    this.w = this.angleVelocity(v, r); // Angular velocity, in degrees / min.
    this.angle = angle;
    this.min = 0;           // 

    this.Call = "TT" + String(id).padStart(3, '0');
    this.Cou = "USA";
    this.To = "Portland";
    this.From = "Portland";
    this.Mdl = "Virtual Plane";
    this.Op = "Virtual Tours"
    this.Icao = "TT" + String(id);
  }

  // v: km/h => w: degrees/min
  angleVelocity(v, r) { // v: km/h, r:km
    const w = Math.asin((v / 60) / r);
    return w;
  }

  // Get position at the specified time (min).
  position(min) {
    const deg = (this.angle + (this.w * min)) % 360;
    const x = this.r * Math.cos(Math.PI * deg / 180);
    const y = this.r * Math.sin(Math.PI * deg / 180);
    const lng = this.lng + distToDegree(x * 1000);
    const lat = this.lat + distToDegree(y * 1000);
    const cos = [lat, lng, 0, this.alt];
    const pos = {
      Call: this.Call,
      Cos: cos,
      Cou: this.Cou,
      From: this.From,
      Icao: this.Icao,
      Mdl: this.Mdl,
      Op: this.Op,
      To: this.To,
      TT: "a",
      PosTime: 0,
    }
    return pos;
  }
}

const numAircraft = 500;
let aircraft = [];

function CreateTrackingAll() {
  if (aircraft.length == 0) {
    for (let i = 0; i < numAircraft; i++) {
      const lat = OriginalPos.lat + distToDegree(Math.random() * 1000 * 8000);
      const lng = OriginalPos.lng + distToDegree(Math.random() * 1000 * 8000);
      const alt = Math.random() * 10000 + 100;
      const r = Math.random() * 1000;
      const v = Math.random() * 3200 + 500;  // km / hour. Normal passenger airplane flies < 1000km/h.
      const angle = Math.random() * 360;
      aircraft[i] = new AirCraft(lat, lng, alt, r, v, angle, i);
    }
  }
}
CreateTrackingAll();

exports.track = function (file) {
  const minStr = file.match(/-[0-9][0-9][0-9][0-9]Z/)[0]; // May throw if the file doesn't exist.
  const h = minStr.substr(1, 2);
  const m = minStr.substr(3, 2);
  const min = 60 * Number(minStr.substr(1, 2)) + Number(minStr.substr(3, 2));

  let data = [];
  aircraft.forEach(x => {
    const a = x.position(min);
    data.push(a);
  })
  // console.log(data);
  return data;
}


