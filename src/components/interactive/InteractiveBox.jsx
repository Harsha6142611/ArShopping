import React, { useState } from 'react';

export function InteractiveBox({ position, color, hoverColor, message }) {
  const [hovered, setHovered] = useState(false);
  
  const handleClick = () => {
    alert(message);
  };

  return (
    <mesh
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? hoverColor : color} />
    </mesh>
  );
} 