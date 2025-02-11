// // import React, { Suspense, useEffect, useState } from "react";
// // import { Canvas, useFrame, useThree } from "@react-three/fiber";
// // import { OrbitControls } from "@react-three/drei";
// // import { useNavigate } from "react-router-dom";
// // import * as THREE from "three";
// // import "./Shop.css";

// // import { Room } from "./room/Room";
// // import { Player } from "./player/Player";
// // import { Lights } from "./lights/Lights";
// // import { InteractiveBox } from "./interactive/InteractiveBox";

// // function FreeMovementControls({ speed = 0.1 }) {
// //   const { camera } = useThree();
// //   const [keys, setKeys] = useState({});
// //   const fixedHeight = 2; // Fixed camera height

// //   useEffect(() => {
// //     // Set initial camera height
// //     camera.position.y = fixedHeight;

// //     const handleKeyDown = (event) =>
// //       setKeys((keys) => ({ ...keys, [event.key.toLowerCase()]: true }));
// //     const handleKeyUp = (event) =>
// //       setKeys((keys) => ({ ...keys, [event.key.toLowerCase()]: false }));

// //     window.addEventListener("keydown", handleKeyDown);
// //     window.addEventListener("keyup", handleKeyUp);

// //     return () => {
// //       window.removeEventListener("keydown", handleKeyDown);
// //       window.removeEventListener("keyup", handleKeyUp);
// //     };
// //   }, [camera]);

// //   useFrame(() => {
// //     const direction = new THREE.Vector3();
// //     const frontVector = new THREE.Vector3();
// //     const sideVector = new THREE.Vector3();

// //     // Get camera's forward direction but ignore vertical component
// //     camera.getWorldDirection(frontVector);
// //     frontVector.y = 0; // Lock vertical movement
// //     frontVector.normalize();

// //     // Calculate side vector perpendicular to forward direction
// //     sideVector.crossVectors(new THREE.Vector3(0, 1, 0), frontVector).normalize();

// //     if (keys["w"]) direction.add(frontVector);
// //     if (keys["s"]) direction.sub(frontVector);
// //     if (keys["a"]) direction.add(sideVector);
// //     if (keys["d"]) direction.sub(sideVector);

// //     // Apply movement while maintaining fixed height
// //     direction.normalize().multiplyScalar(speed);
// //     camera.position.add(direction);
// //     camera.position.y = fixedHeight; // Force camera to maintain fixed height
// //   });

// //   return (
// //     <OrbitControls
// //       enableZoom={true}
// //       enablePan={true}
// //       enableRotate={true}
// //       maxPolarAngle={Math.PI / 2} // Prevent looking below horizontal
// //       minPolarAngle={Math.PI / 4} // Prevent looking too far up
// //       mouseButtons={{
// //         LEFT: THREE.MOUSE.ROTATE,
// //         MIDDLE: THREE.MOUSE.DOLLY,
// //         RIGHT: THREE.MOUSE.PAN
// //       }}
// //     />
// //   );
// // }

// // function Crosshair() {
// //   return (
// //     <div
// //       style={{
// //         position: "absolute",
// //         top: "50%",
// //         left: "50%",
// //         transform: "translate(-50%, -50%)",
// //         width: "10px",
// //         height: "10px",
// //         backgroundColor: "white",
// //         borderRadius: "50%",
// //         zIndex: 10,
// //         pointerEvents: "none",
// //       }}
// //     />
// //   );
// // }

// // function Shop() {
// //   const navigate = useNavigate();

// //   return (
// //     <div className="shop-container">
// //       <button onClick={() => navigate("/dashboard")} className="back-btn">
// //         Back to Dashboard
// //       </button>

// //       <Crosshair /> {/* ✅ Adding Crosshair to UI */}

// //       <div className="canvas-container">
// //         <Canvas 
// //           camera={{ position: [0, 2, 4], fov: 75 }} 
// //           shadows
// //           onCreated={({ gl }) => {
// //             gl.shadowMap.enabled = true;
// //             gl.shadowMap.type = THREE.PCFSoftShadowMap;
// //           }}
// //         >
// //           <Lights />
// //           <Suspense fallback={null}>
// //             <Room />
// //             <Player />
// //             <InteractiveBox
// //               position={[3, 1, 3]}
// //               color="#666666"
// //               hoverColor="#ff9900"
// //               message="Welcome to the Shop! This is object 1."
// //             />
// //             <InteractiveBox
// //               position={[-3, 1, 3]}
// //               color="#4a4a4a"
// //               hoverColor="#00ff99"
// //               message="You've found object 2!"
// //             />
// //             <InteractiveBox
// //               position={[0, 1, -3]}
// //               color="#555555"
// //               hoverColor="#9900ff"
// //               message="This is object 3. Great exploration!"
// //             />
// //           </Suspense>
// //           <FreeMovementControls speed={0.1} />
// //         </Canvas>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Shop;

import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import "./Shop.css";

import { Room } from "./room/Room";
import { Player } from "./player/Player";
import { Lights } from "./lights/Lights";
import { InteractiveBox } from "./interactive/InteractiveBox";

function FPSControls({ speed = 0.15 }) {
  const { camera, gl } = useThree();
  const [keys, setKeys] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef({ x: 0, y: 0 });

  const fixedHeight = 4; // Camera stays at player's height
  const lookSpeed = 0.002; // Sensitivity

  useEffect(() => {
    camera.position.y = fixedHeight;

    const handleKeyDown = (event) =>
      setKeys((prev) => ({ ...prev, [event.key.toLowerCase()]: true }));
    const handleKeyUp = (event) =>
      setKeys((prev) => ({ ...prev, [event.key.toLowerCase()]: false }));

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [camera]);

  useEffect(() => {
    const handleClick = () => {
      if (!isLocked) gl.domElement.requestPointerLock();
    };

    const handlePointerLockChange = () => {
      setIsLocked(document.pointerLockElement === gl.domElement);
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
    };
  }, [gl, isLocked]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isLocked) return;

      rotation.current.y -= event.movementX * lookSpeed;
      rotation.current.x -= event.movementY * lookSpeed;

      // PUBG-style vertical movement restriction
      const maxVerticalAngle = Math.PI / 3; // 60-degree up/down limit
      rotation.current.x = Math.max(-maxVerticalAngle, Math.min(maxVerticalAngle, rotation.current.x));
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isLocked]);

  useFrame(() => {
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    // Smooth camera rotation (no jitter)
    camera.rotation.set(rotation.current.x, rotation.current.y, 0);

    camera.getWorldDirection(frontVector);
    frontVector.y = 0;
    frontVector.normalize();
    sideVector.crossVectors(new THREE.Vector3(0, 1, 0), frontVector).normalize();

    if (keys["w"]) direction.add(frontVector);
    if (keys["s"]) direction.sub(frontVector);
    if (keys["a"]) direction.add(sideVector);
    if (keys["d"]) direction.sub(sideVector);

    direction.normalize().multiplyScalar(speed);
    velocity.current.lerp(direction, 0.1);
    camera.position.add(velocity.current);
    camera.position.y = fixedHeight; // Keep camera height fixed
  });

  return null;
}

function Crosshair() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "6px",
        height: "6px",
        backgroundColor: "white",
        borderRadius: "50%",
        zIndex: 10,
        pointerEvents: "none",
      }}
    />
  );
}

function Shop() {
  const navigate = useNavigate();

  return (
    <div className="shop-container">
      <button onClick={() => navigate("/dashboard")} className="back-btn">
        Back to Dashboard
      </button>

      <Crosshair />

      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 2, 4], fov: 75 }}
          shadows
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <Lights />
          <Suspense fallback={null}>
            <Room />
            {/* <Player /> */}
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
          <FPSControls speed={0.15} />
        </Canvas>
      </div>
    </div>
  );
}

export default Shop;

