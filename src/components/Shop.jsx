import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import './Shop.css';

import { Room } from './room/Room';
import { Player } from './player/Player';
import { Lights } from './lights/Lights';
import { InteractiveBox } from './interactive/InteractiveBox';

function Shop() {
  const navigate = useNavigate();

  return (
    <div className="shop-container">
      <button onClick={() => navigate('/dashboard')} className="back-btn">
        Back to Dashboard
      </button>

      <div className="canvas-container">
        <Canvas 
          camera={{ position: [0, 2, 4], fov: 75 }}
          shadows
        >
          <Lights />
          <Suspense fallback={null}>
            <Room />
            <Player />
            <InteractiveBox 
              position={[3, 1, 3]} 
              color="#666666" 
              hoverColor="#ff9900"
              message="Welcome to the Shop! This is object 1."
            />
            <InteractiveBox 
              position={[-3, 1, 3]} 
              color="#4a4a4a" 
              hoverColor="#00ff99"
              message="You've found object 2!"
            />
            <InteractiveBox 
              position={[0, 1, -3]} 
              color="#555555" 
              hoverColor="#9900ff"
              message="This is object 3. Great exploration!"
            />
          </Suspense>
          <OrbitControls 
            enablePan={false} 
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
            enabled={false}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default Shop;
