// import React, { Suspense, useEffect, useRef } from 'react';
// import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { useNavigate } from 'react-router-dom';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import './Shop.css';
// import * as THREE from 'three';

// function Room() {
//   const gltf = useLoader(GLTFLoader, './empty_room.glb'); // Update the path as necessary
//   return <primitive object={gltf.scene} />;
// }

// function CameraController() {
//   const { camera } = useThree();
//   const keys = useRef({});

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       keys.current[e.key.toLowerCase()] = true;
//     };

//     const handleKeyUp = (e) => {
//       keys.current[e.key.toLowerCase()] = false;
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   useFrame(() => {
//     const speed = 0.1;
//     let newX = camera.position.x;
//     let newY = camera.position.y;

//     if (keys.current['w']) newY += speed; // Move up
//     if (keys.current['s']) newY -= speed; // Move down
//     if (keys.current['a']) newX -= speed; // Move left
//     if (keys.current['d']) newX += speed; // Move right

//     camera.position.set(newX, newY, camera.position.z); // Keep Z locked
//   });

//   return null;
// }

// function Shop() {
//   const navigate = useNavigate();

//   return (
//     <div className="shop-container">
//       <button onClick={() => navigate('/dashboard')} className="back-btn">
//         Back to Dashboard
//       </button>

//       <div className="canvas-container">
//         <Canvas camera={{ position: [0, 1.6, 5], fov: 75 }}>
//           <ambientLight intensity={0.5} />
//           <pointLight position={[10, 10, 10]} />
//           <Suspense fallback={null}>
//             <Room />
//             <CameraController />
//           </Suspense>
//           <OrbitControls enablePan={false} enableZoom={false} /> {/* Lock rotation but allow looking around */}
//         </Canvas>
//       </div>
//     </div>
//   );
// }

// export default Shop;

import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, useSphere } from '@react-three/cannon';
import { useNavigate } from 'react-router-dom';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import './Shop.css';

function Room() {
  const gltf = useLoader(GLTFLoader, './empty_room.glb');
  return <primitive object={gltf.scene} />;
}

function Player() {
  const { camera } = useThree();
  const keys = useRef({});
  
  // Create a physics sphere for the player
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 1.6, 5], // Starting position
    args: [0.5], // Sphere radius
    material: { friction: 0.1 },
    type: 'Dynamic',
  }));

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const speed = 4;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    // Calculate movement direction
    if (keys.current['w']) frontVector.set(0, 0, -1);
    if (keys.current['s']) frontVector.set(0, 0, 1);
    if (keys.current['a']) sideVector.set(-1, 0, 0);
    if (keys.current['d']) sideVector.set(1, 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed);

    // Apply velocity to physics body
    api.velocity.set(direction.x, 0, direction.z);

    // Update camera position to follow physics body
    ref.current.getWorldPosition(camera.position);
  });

  return <mesh ref={ref} />;
}

function Shop() {
  const navigate = useNavigate();

  return (
    <div className="shop-container">
      <button onClick={() => navigate('/dashboard')} className="back-btn">
        Back to Dashboard
      </button>

      <div className="canvas-container">
        <Canvas camera={{ position: [0, 1.6, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Physics gravity={[0, -9.81, 0]}>
              <Room />
              <Player />
              {/* Add ground plane to prevent falling */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial visible={false} />
              </mesh>
            </Physics>
          </Suspense>
          <OrbitControls 
            enablePan={false} 
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default Shop;
