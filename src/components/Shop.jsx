import React, { Suspense, useEffect, useRef, useState } from 'react';
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
  const [rotation, setRotation] = useState(0);
  const isMouseDown = useRef(false);
  
  const playerHeight = 1.8;
  const playerRadius = 0.3;

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    const handleMouseDown = (e) => {
      if (e.button === 0) { // Left click
        isMouseDown.current = true;
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 0) { // Left click
        isMouseDown.current = false;
      }
    };

    const handleMouseMove = (e) => {
      if (isMouseDown.current) {
        // Adjust rotation speed by changing the division factor
        setRotation((prev) => prev + e.movementX * 0.01);
      }
    };

    // Add all event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      // Remove all event listeners
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame(() => {
    if (!playerRef.current) return;

    const speed = 0.1;
    let moveX = 0;
    let moveZ = 0;

    // Calculate movement based on rotation
    if (keys.current['w']) {
      moveX += Math.sin(rotation) * speed;
      moveZ -= Math.cos(rotation) * speed;
    }
    if (keys.current['s']) {
      moveX -= Math.sin(rotation) * speed;
      moveZ += Math.cos(rotation) * speed;
    }
    if (keys.current['a']) {
      moveX -= Math.cos(rotation) * speed;
      moveZ -= Math.sin(rotation) * speed;
    }
    if (keys.current['d']) {
      moveX += Math.cos(rotation) * speed;
      moveZ += Math.sin(rotation) * speed;
    }

    // Update player position and rotation
    playerRef.current.position.x += moveX;
    playerRef.current.position.z += moveZ;
    playerRef.current.rotation.y = rotation;

    // Update camera position (third-person view)
    const cameraDistance = 4;
    const cameraHeight = 2;
    const cameraX = playerRef.current.position.x - Math.sin(rotation) * cameraDistance;
    const cameraZ = playerRef.current.position.z + Math.cos(rotation) * cameraDistance;
    
    camera.position.set(
      cameraX,
      playerRef.current.position.y + cameraHeight,
      cameraZ
    );
    
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
