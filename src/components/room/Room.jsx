import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function Room() {
  const gltf = useLoader(GLTFLoader, './empty_room.glb');
  return <primitive object={gltf.scene} position={[0, 0, 0]} />;
} 