import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export function Player() {
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
      if (e.button === 0) {
        isMouseDown.current = true;
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 0) {
        isMouseDown.current = false;
      }
    };

    const handleMouseMove = (e) => {
      if (isMouseDown.current) {
        setRotation((prev) => prev + e.movementX * 0.01);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
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

    playerRef.current.position.x += moveX;
    playerRef.current.position.z += moveZ;
    playerRef.current.rotation.y = rotation;

    const cameraDistance = 4;
    const cameraHeight = 2;
    const cameraX = playerRef.current.position.x - Math.sin(rotation) * cameraDistance;
    const cameraZ = playerRef.current.position.z + Math.cos(rotation) * cameraDistance;
    
    camera.position.set(
      cameraX,
      playerRef.current.position.y + cameraHeight,
      cameraZ
    );
    
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