import React from 'react';

function LightHelper({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="yellow" />
    </mesh>
  );
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />

      <pointLight position={[-4, 4, -4]} intensity={1.5} color="#ff0000" />
      <LightHelper position={[-4, 4, -4]} />

      <pointLight position={[4, 4, -4]} intensity={1.5} color="#00ff00" />
      <LightHelper position={[4, 4, -4]} />

      <pointLight position={[0, 4, 4]} intensity={1.5} color="#0000ff" />
      <LightHelper position={[0, 4, 4]} />

      <pointLight position={[0, 4, 0]} intensity={1} color="#ffffff" />
      <LightHelper position={[0, 4, 0]} />

      <hemisphereLight
        skyColor="#ffffff"
        groundColor="#444444"
        intensity={0.4}
      />
    </>
  );
} 