import * as THREE from 'three';
import {createBlock, createFace} from './ThreeJsModelMaker';
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

const mergeGroupIntoSingleGeometry = (group, geometriesArray = []) => 
{
    group.traverse((child) => 
    {
        if (child.isMesh && child.geometry) 
        {
            const clonedGeometry = child.geometry.clone();
            clonedGeometry.applyMatrix4(child.matrixWorld); // Apply world transformations
            geometriesArray.push(clonedGeometry);
        }
    });

    if (geometriesArray.length === 0) return null; // No valid geometries found

    return mergeGeometries(geometriesArray); // Merge into a single geometry
};


// Create a pond Mesh based on the inputs
export const createPondMesh = (pondInputs) => 
{
    const {
        safetyLedge,
        nwl2hwl,
        sl2nwl,
        hwl2fb,
        bermWidth,
        interiorSlope,
        ledgeWidth,
        outerWidth,
        outerLength
    } = pondInputs;

    // Calculate pond structure
    const totalHeight = safetyLedge + nwl2hwl + sl2nwl + hwl2fb - 10;
    const fbLength = outerLength - 2 * bermWidth;
    const fbWidth = outerWidth - 2 * bermWidth;
    
    const fbVertices = [
        new THREE.Vector3(-fbLength / 2, -fbWidth / 2, totalHeight),
        new THREE.Vector3(fbLength / 2, -fbWidth / 2, totalHeight),
        new THREE.Vector3(fbLength / 2, fbWidth / 2, totalHeight),
        new THREE.Vector3(-fbLength / 2, fbWidth / 2, totalHeight)
    ];

    const hwlLength = fbLength - (2 * hwl2fb / interiorSlope);
    const hwlWidth = fbWidth - (2 * hwl2fb / interiorSlope);
    
    const hwlVertices = [
        new THREE.Vector3(-hwlLength / 2, -hwlWidth / 2, totalHeight - hwl2fb),
        new THREE.Vector3(hwlLength / 2, -hwlWidth / 2, totalHeight - hwl2fb),
        new THREE.Vector3(hwlLength / 2, hwlWidth / 2, totalHeight - hwl2fb),
        new THREE.Vector3(-hwlLength / 2, hwlWidth / 2, totalHeight - hwl2fb)
    ];

    const nwlLength = hwlLength - (2 * nwl2hwl / interiorSlope);
    const nwlWidth = hwlWidth - (2 * nwl2hwl / interiorSlope);

    const nwlVertices = [
        new THREE.Vector3(-nwlLength / 2, -nwlWidth / 2, totalHeight - hwl2fb - nwl2hwl),
        new THREE.Vector3(nwlLength / 2, -nwlWidth / 2, totalHeight - hwl2fb - nwl2hwl),
        new THREE.Vector3(nwlLength / 2, nwlWidth / 2, totalHeight - hwl2fb - nwl2hwl),
        new THREE.Vector3(-nwlLength / 2, nwlWidth / 2, totalHeight - hwl2fb - nwl2hwl)
    ]

    const slLength = nwlLength - (2 * sl2nwl / interiorSlope);
    const slWidth = nwlWidth - (2 * sl2nwl / interiorSlope);

    const slVertices = [
        new THREE.Vector3(-slLength / 2, -slWidth / 2, totalHeight - hwl2fb - nwl2hwl - sl2nwl),
        new THREE.Vector3(slLength / 2, -slWidth / 2, totalHeight - hwl2fb - nwl2hwl - sl2nwl),
        new THREE.Vector3(slLength / 2, slWidth / 2, totalHeight - hwl2fb - nwl2hwl - sl2nwl),
        new THREE.Vector3(-slLength / 2, slWidth / 2, totalHeight - hwl2fb - nwl2hwl - sl2nwl)
    ];

    const ledgeVertices = [
        new THREE.Vector3(-slLength / 2 + ledgeWidth, -slWidth / 2 + ledgeWidth, totalHeight - hwl2fb - nwl2hwl - sl2nwl),
        new THREE.Vector3(slLength / 2 - ledgeWidth, -slWidth / 2 + ledgeWidth, totalHeight - hwl2fb - nwl2hwl - sl2nwl),
        new THREE.Vector3(slLength / 2 - ledgeWidth, slWidth / 2 - ledgeWidth, totalHeight - hwl2fb - nwl2hwl - sl2nwl),
        new THREE.Vector3(-slLength / 2 + ledgeWidth, slWidth / 2 - ledgeWidth, totalHeight - hwl2fb - nwl2hwl - sl2nwl)
    ]

    const bottomLength = slLength - 2 * ledgeWidth - 2* safetyLedge / interiorSlope;
    const bottomWidth = slWidth - 2 * ledgeWidth - 2* safetyLedge / interiorSlope;

    const bottomVertices = [
        new THREE.Vector3(-bottomLength / 2, -bottomWidth / 2, -10),
        new THREE.Vector3(bottomLength / 2, -bottomWidth / 2, -10),
        new THREE.Vector3(bottomLength / 2, bottomWidth / 2, -10),
        new THREE.Vector3(-bottomLength / 2, bottomWidth / 2, -10)
    ];

    const bermVertices = [
        new THREE.Vector3(-outerLength / 2, -outerWidth / 2, totalHeight),
        new THREE.Vector3(outerLength / 2, -outerWidth / 2, totalHeight),
        new THREE.Vector3(outerLength / 2, outerWidth / 2, totalHeight),
        new THREE.Vector3(-outerLength / 2, outerWidth / 2, totalHeight)
    ];

    const frontEdgeMidPt = new THREE.Vector3((bermVertices[0].x + bermVertices[1].x)/2, (bermVertices[0].y + bermVertices[1].y)/2, totalHeight);
    const rightEdgeMidPt = new THREE.Vector3((bermVertices[1].x + bermVertices[2].x)/2, (bermVertices[1].y + bermVertices[2].y)/2, totalHeight);
    const backEdgeMidPt = new THREE.Vector3((bermVertices[2].x + bermVertices[3].x)/2, (bermVertices[2].y + bermVertices[3].y)/2, totalHeight);
    const leftEdgeMidPt = new THREE.Vector3((bermVertices[3].x + bermVertices[0].x)/2, (bermVertices[3].y + bermVertices[0].y)/2, totalHeight);

    // A block consists of four side faces of the trapezoidal pond structure
    const hwlBlock = createBlock(fbVertices[0], fbVertices[1], hwlVertices[1], hwlVertices[0], fbVertices[3], fbVertices[2], hwlVertices[2], hwlVertices[3], 0xe4a5d0);
    const nwlBlock = createBlock(hwlVertices[0], hwlVertices[1], nwlVertices[1], nwlVertices[0], hwlVertices[3], hwlVertices[2], nwlVertices[2], nwlVertices[3], 0xf3f778);
    const slBlock = createBlock(nwlVertices[0], nwlVertices[1], slVertices[1], slVertices[0], nwlVertices[3], nwlVertices[2], slVertices[2], slVertices[3], 0x7fffd4);
    const ledgeBlock = createBlock(slVertices[0], slVertices[1], ledgeVertices[1], ledgeVertices[0], slVertices[3], slVertices[2], ledgeVertices[2], ledgeVertices[3], 0xf61117 );
    const bottomBlock = createBlock(ledgeVertices[0], ledgeVertices[1], bottomVertices[1], bottomVertices[0], ledgeVertices[3], ledgeVertices[2], bottomVertices[2], bottomVertices[3], 0x7fffd4);
    const bottomFace = createFace(bottomVertices[0], bottomVertices[1], bottomVertices[2], bottomVertices[3], 0xe4a5d0);
    const bermBlock = createBlock(fbVertices[0], fbVertices[1], bermVertices[1], bermVertices[0], fbVertices[3], fbVertices[2], bermVertices[2], bermVertices[3], 0x7fffd4);

    const pond = new THREE.Group();

    pond.add(hwlBlock);
    pond.add(nwlBlock);
    pond.add(slBlock);
    pond.add(ledgeBlock);
    pond.add(bottomBlock);
    pond.add(bottomFace);
    pond.add(bermBlock);

    const mergedGeometry = mergeGroupIntoSingleGeometry(pond);
    const material = new THREE.MeshStandardMaterial({ color:0xe4a5d0, roughness: 0.5, side: THREE.DoubleSide, flatShading: true });
    const mergedMesh = new THREE.Mesh(mergedGeometry, material);
    mergedMesh.rotation.x = -Math.PI / 2;

    return mergedMesh;
};