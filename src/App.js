// import React from 'react';
// // import { hot } from 'react-hot-loader/root';
// import { Viewer, Entity, PointGraphics  } from 'resium';
// import { Cartesian3 } from 'cesium';

// const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
// const pointGraphics = { pixelSize: 10 };

// function App() {
//   return (
//     <Viewer full>
//         <Entity
//     description="test"
//     name="tokyo"
//     point={{ pixelSize: 10 }}
//     position={Cartesian3.fromDegrees(139.767052, 35.681167, 100)}
//   />
//       {/* <Entity position={position} point={pointGraphics} name="Tokyo" description="Hello, world.">
//         <PointGraphics pixelSize={10} />
//       </Entity> */}
//     </Viewer>
//   );
// }


import React from "react";
import { Viewer, Entity, PointGraphics, EntityDescription, ImageryLayer, /*Camera,*/ CameraFlyTo  } from "resium";
import { Cartesian3, createWorldTerrain, ArcGisMapServerImageryProvider, Math  } from "cesium";
const terrainProvider = createWorldTerrain();
const position = Cartesian3.fromDegrees(139.767052, 35.681167, 100);
// const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
const App = () => (
  <Viewer full terrainProvider={terrainProvider}>
    <ImageryLayer
      imageryProvider={new ArcGisMapServerImageryProvider({
        url: "//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
      })} />
    <CameraFlyTo
      destination={Cartesian3.fromDegrees(139.767052, 35.681167, 10000)}
      orientation={{ pitch: Math.toRadians(-60) }}
      duration={3}
    />
    <Entity position={position} name="Tokyo">
      <PointGraphics pixelSize={10} />
      <EntityDescription>
        <h1>Hello, world.</h1>
        <p>JSX is available here!</p>
      </EntityDescription>
    </Entity>
  </Viewer>
);

export default App;
// export default hot(App);
