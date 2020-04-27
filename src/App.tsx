import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

import { Viewer, Entity /*PointGraphics*/  } from 'resium';
import { Cartesian3 } from 'cesium';
// const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
// const pointGraphics = { pixelSize: 10 };

function App() {
  return (
    <Viewer full>
        <Entity
    description="test"
    name="tokyo"
    point={{ pixelSize: 10 }}
    position={Cartesian3.fromDegrees(139.767052, 35.681167, 100)}
  />
      {/* <Entity position={position} point={pointGraphics} name="Tokyo" description="Hello, world.">
        <PointGraphics pixelSize={10} />
      </Entity> */}
    </Viewer>
  );
}

export default App;
