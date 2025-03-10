import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useSelector } from "react-redux";
import { createTerrain } from "./Terrain";
import { createPondMesh } from "./PondModel";
import { updatePondMesh } from "./PondUpdater";
import { setPondPositionZOffset } from '../../store/slices/PondInputsSlice';
import {useDispatch} from 'react-redux';

const ModelViewer = () => 
{
    const mountRef = useRef(null);
    const elevation = useSelector((state) => state.elevationDataSetter);
    const planeSize = useSelector((state) => state.planeSizeSetter);
    const pondInputs = useSelector((state) => state.PondInputsSetter);
    const dispatch = useDispatch();

    useEffect(() => 
    {
        if (!mountRef.current || !elevation.elevationData) return;

        // Scene and Renderer Setup
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(500, 500);
        mountRef.current.appendChild(renderer.domElement);

        // Create Terrain Mesh
        let { top, base, front, back, left, right } = createTerrain(elevation, planeSize);
        const terrainFacesGroup = new THREE.Group(); // Grouping meshes
        terrainFacesGroup.add(top, base, front, back, left, right);
        terrainFacesGroup.rotation.x = -Math.PI/2;
        const terrainMesh = terrainFacesGroup;

        // Create Pond Mesh
        let pondMesh = null;
        if (pondInputs.outerLength) 
        {
            pondMesh = createPondMesh(pondInputs);
            if (pondInputs.outerLength)
            {
                pondMesh = updatePondMesh(pondInputs, pondMesh, terrainMesh);
                pondMesh.rotation.x = -Math.PI / 2;
                dispatch(setPondPositionZOffset(10));
            }
        }

        if (terrainMesh && pondMesh) 
        {
            scene.add(terrainMesh);
            scene.add(pondMesh);
        }
        else if (terrainMesh)
        {
            // Add terrain if pond doesn't exist
            scene.add(terrainMesh);
        }

        // Camera Setup
        const camera = new THREE.PerspectiveCamera(60, 1, 1, 5000);
        camera.position.set(0, 0, 450);
        camera.lookAt(0, 0, 0);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight.position.set(0, 500, 500);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        //axes
        const axesHelper = new THREE.AxesHelper( 5 );
        scene.add( axesHelper );

        // OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.rotateSpeed = 0.5;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.enableZoom = true;
        controls.minDistance = 10;
        controls.enablePan = true;
        controls.target.set(0, 0, 0);
        controls.update();

        // Animation Loop
        const animate = () => 
        {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup Function
        return () => 
        {
            mountRef.current.removeChild(renderer.domElement);
            scene.clear();
            renderer.dispose();
        };
    }, [elevation, planeSize, pondInputs]);

    return <div ref={mountRef}></div>;
};

export default ModelViewer;
