import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export function Player() {
  const { camera } = useThree();
  const playerRef = useRef();
  const keys = useRef({});
  const [rotation, setRotation] = useState(0);
  const [verticalAngle, setVerticalAngle] = useState(0);
  const isMouseDown = useRef(false);
  
  const playerHeight = 2;
  const playerRadius = 0.2;

  useEffect(() => {
    // Set the default camera position
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

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
        setVerticalAngle((prev) => {
          const newAngle = prev - e.movementY * 0.01;
          return Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newAngle));
        });
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
  }, [camera]);

  useFrame(() => {
    if (!playerRef.current) return;

    const speed = 0.1;
    let moveX = 0;
    let moveZ = 0;

    if (keys.current['w']) {
      moveX -= Math.sin(rotation) * speed;
      moveZ += Math.cos(rotation) * speed;
    }
    if (keys.current['s']) {
      moveX += Math.sin(rotation) * speed;
      moveZ -= Math.cos(rotation) * speed;
    }
    if (keys.current['a']) {
      moveX += Math.cos(rotation) * speed;
      moveZ += Math.sin(rotation) * speed;
    }
    if (keys.current['d']) {
      moveX -= Math.cos(rotation) * speed;
      moveZ -= Math.sin(rotation) * speed;
    }

    playerRef.current.position.x += moveX;
    playerRef.current.position.z += moveZ;
    playerRef.current.rotation.y = rotation;

    const cameraDistance = 3;
    const cameraHeight = 2;
    
    const horizontalDistance = Math.cos(verticalAngle) * cameraDistance;
    const verticalDistance = Math.sin(verticalAngle) * cameraDistance;
    
    const cameraX = playerRef.current.position.x + Math.sin(rotation) * horizontalDistance;
    const cameraY = playerRef.current.position.y + cameraHeight + verticalDistance;
    const cameraZ = playerRef.current.position.z - Math.cos(rotation) * horizontalDistance;
    
    camera.position.set(cameraX, cameraY, cameraZ);
    
    const lookAtX = playerRef.current.position.x;
    const lookAtY = playerRef.current.position.y + 1 + verticalDistance;
    const lookAtZ = playerRef.current.position.z;
    
    camera.lookAt(lookAtX, lookAtY, lookAtZ);
  });

  return (
    <mesh ref={playerRef} position={[1, 2.3, -10]}>
      <capsuleGeometry args={[playerRadius, playerHeight - playerRadius * 2, 8]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
} 