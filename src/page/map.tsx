import React from 'react';
import ReactDOM from 'react-dom';
import { Viewer, Entity /*PointGraphics*/  } from 'resium';
import { Cartesian3 } from 'cesium';

function MapPage() {

  return (
    <div>
      {/* <h1>Map</h1> */}
      <Viewer>
        <Entity
          description='Portland International Airport'
          name='PDX Airport'
          point={{ pixelSize: 10 }}
          position={Cartesian3.fromDegrees(-122.595172, 45.5895, 10)}
        ></Entity>
      </Viewer>
    </div>
  );
}


export default MapPage;