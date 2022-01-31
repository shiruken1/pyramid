import './App.css';

// npm
import React, {
  useRef,
  useState,
  Suspense
} from 'react';

import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
// import { EffectComposer, Outline } from '@react-three/postprocessing'

export function Pyramid(props) {
  const ref = useRef();
  const [ hovered, setHover ] = useState(null);
  const [ clickedLayer, setClickedLayer ] = useState(null);

  const {
    scene,
    // nodes, materials
  } = useGLTF('data/pyramid.gltf');

  // grab only the objects
  const layers = scene.children.filter(n => n.type === "Group");

  // in case we wanna control animation by hand
  // useFrame(() => ref.current.rotation.y = ref.current.rotation.y -= 0.002);
  useFrame(() => {});

  return (
    <group
      ref={ref}
      scale={0.01}
      dispose={null}>

      {layers.map(l => (
        <group
          key={l.uuid}
          onPointerOut={e => setHover(null)}
          onPointerOver={e => setHover(l.uuid)}
          onClick={e => {
            e.stopPropagation();
            setClickedLayer(l.uuid);
            const suffix = l.uuid.slice(-4);
            window.open(`https://above-market.com/#${suffix}`, '_blank');
          }}>
            {l.children.map(mesh => (
              <React.Fragment>
                <mesh
                  key={mesh.uuid}
                  rotation-x={Math.PI/2} /* Blender likes Z as up, I guess */
                  geometry={mesh.geometry}
                  material={mesh.material}
                />

                {/* Highlight the layer means double up the layer */}
                { hovered === l.uuid && (
// could this work? it's cleaner to look at...
                  // <EffectComposer multisampling={8} autoClear={false}>
                  //   <Outline blur selection={hovered} visibleEdgeColor="white" edgeStrength={100} />
                  // </EffectComposer>

                  <mesh
                    scale={1.01}
                    rotation-x={Math.PI/2} /* Blender likes Z as up, I guess */
                    geometry={mesh.geometry}
                    material={
// if I get a bump map for each layer
                      // new THREE.ParticleBasicMaterial({
                      //   color: 0xFFFFFF,
                      //   size: 3800,
                      //   map: THREE.ImageUtils.loadTexture(
                      //       'http://threegraphs.com/static/img/world_glow.png'
                      //   ),
                      //   blending: THREE.AdditiveBlending,
                      new THREE.MeshBasicMaterial({
                        color : 0xffffff,
                        side: THREE.DoubleSide,
                      })
                  } />
                )}
              </React.Fragment>
            ))}
        </group>
      ))}
    </group>
  )
};

export default function App() {
  return (
    <Canvas className="world">
      <color attach="background" args={['#000']} />
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <spotLight position={[0, 5, 0]} angle={0.22} penumbra={1.8} />
        <Pyramid />
      </Suspense>

      <OrbitControls
        autoRotate
        enablePan={false}
        enableZoom={false}
        autoRotateSpeed={-1.5}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 2.8} />
    </Canvas>
  );
};
