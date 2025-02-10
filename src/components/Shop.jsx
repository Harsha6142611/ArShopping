import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import './Shop.css';

function Room() {
  const gltf = useLoader(GLTFLoader, './empty_room.glb');
  return <primitive object={gltf.scene} position={[0, 0, 0]} />;
}

function Player() {
  const { camera } = useThree();
  const playerRef = useRef();
  const keys = useRef({});
  
  const playerHeight = 2;
  const playerRadius = 0.3;

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
    if (!playerRef.current) return;

    const speed = 0.1;
    let moveX = 0;
    let moveZ = 0;

    if (keys.current['w']) moveZ -= speed;
    if (keys.current['s']) moveZ += speed;
    if (keys.current['a']) moveX -= speed;
    if (keys.current['d']) moveX += speed;

    // Update player position
    playerRef.current.position.x += moveX;
    playerRef.current.position.z += moveZ;

    // Update camera position (third-person view)
    const cameraOffset = new THREE.Vector3(0, 2, 4);
    camera.position.x = playerRef.current.position.x + cameraOffset.x;
    camera.position.y = playerRef.current.position.y + cameraOffset.y;
    camera.position.z = playerRef.current.position.z + cameraOffset.z;
    
    // Make camera look at player
    camera.lookAt(
      playerRef.current.position.x,
      playerRef.current.position.y + 1,
      playerRef.current.position.z
    );
  });

  return (
    <mesh ref={playerRef} position={[0, playerHeight / 2, 0]}>
      <capsuleGeometry args={[playerRadius, playerHeight - playerRadius * 2, 8]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

function Shop() {
  const navigate = useNavigate();

  return (
    <div className="shop-container">
      <button onClick={() => navigate('/dashboard')} className="back-btn">
        Back to Dashboard
      </button>

      <div className="canvas-container">
        <Canvas camera={{ position: [0, 2, 4], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Room />
            <Player />
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
