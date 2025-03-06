import * as THREE from "three";
import { createTerrainVerticesIndices } from "./TerrainVerticesIndicesCreator";

// Create Terrain Mesh
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

    // Create PlaneGeometry
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
            vertices[vertexIndex + 2] = elevationValue; // Set elevation (Z)

            sumX += vertices[vertexIndex];     // X
            sumY += vertices[vertexIndex + 1]; // Y
            sumZ += vertices[vertexIndex + 2]; // Z
            numVertices++;
        }
    } 

    const avgX = sumX / numVertices;
    const avgY = sumY / numVertices;
    const avgZ = sumZ / numVertices;

    const minZ = 300;
    const { finalVertices, finalIndices } = createTerrainVerticesIndices(vertices, minZ, gridX, gridY);

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setIndex(finalIndices);
    bufferGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(finalVertices), 3));
    bufferGeometry.translate(-avgX, -avgY, -avgZ);
    bufferGeometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({ color: 0x88cc88, roughness: 0.5, side: THREE.DoubleSide });

    const terrainMesh = new THREE.Mesh(bufferGeometry, material);
    terrainMesh.rotation.x = -Math.PI / 2;

    return terrainMesh;
};
