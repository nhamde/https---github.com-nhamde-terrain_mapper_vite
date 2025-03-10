import * as THREE from 'three';
import { createTerrainVerticesIndices } from './TerrainVerticesIndicesCreator.js';

export const createTerrain = (elevation, planeSize) => 
{
    if (!elevation.elevationData) return null;

    const { elevationData, gridX, gridY } = elevation;
    const width = planeSize.width;
    const height = planeSize.height;

    if (elevationData.length !== gridX * gridY) 
    {
        console.error(`Elevation data length mismatch: Expected ${gridX * gridY}, got ${elevationData.length}`);
        return null;
    }

    const geometry = new THREE.PlaneGeometry(width, height, gridX - 1, gridY - 1);
    const vertices = geometry.attributes.position.array;

    let sumX = 0, sumY = 0, sumZ = 0;
    let numVertices = 0;

    for (let y = 0; y < gridY; y++) 
    {
        for (let x = 0; x < gridX; x++) 
        {
            const elevationIndex = y * gridX + x; 
            const elevationValue = elevationData[elevationIndex] || 0; 

            const vertexIndex = (y * gridX + x) * 3;
            vertices[vertexIndex + 2] = elevationValue;

            sumX += vertices[vertexIndex];
            sumY += vertices[vertexIndex + 1];
            sumZ += vertices[vertexIndex + 2];
            numVertices++;
        }
    } 

    const avgX = sumX / numVertices;
    const avgY = sumY / numVertices;
    const avgZ = sumZ / numVertices;

    const minZ = 380;
    const terrainData = createTerrainVerticesIndices(vertices, minZ, gridX, gridY);

    const createMesh = (vertices, indices, color) => {
        const bufferGeometry = new THREE.BufferGeometry();
        bufferGeometry.setIndex(indices);
        bufferGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
        bufferGeometry.translate(-avgX, -avgY, -avgZ);
        bufferGeometry.computeVertexNormals();
        
        const material = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide, wireframe: false });
        return new THREE.Mesh(bufferGeometry, material);
    };

    return {
        top: createMesh(terrainData.top.vertices, terrainData.top.indices, 0xaaaaaa),
        base: createMesh(terrainData.base.vertices, terrainData.base.indices, 0x888888),
        front: createMesh(terrainData.front.vertices, terrainData.front.indices, 0x777777),
        back: createMesh(terrainData.back.vertices, terrainData.back.indices, 0x666666),
        left: createMesh(terrainData.left.vertices, terrainData.left.indices, 0x555555),
        right: createMesh(terrainData.right.vertices, terrainData.right.indices, 0x444444)
    };
};
