import * as THREE from 'three';

export const extractTrianglesFromGeometry = (geometry) =>
{
    const positions = geometry.attributes.position.array;
    const indices = geometry.index ? geometry.index.array : null;
    const triangles = [];

    if (indices) 
    {
        // Indexed Geometry: Use the index array to get vertices
        for (let i = 0; i < indices.length; i += 3) 
        {
            const v1 = new THREE.Vector3(
                positions[indices[i] * 3], positions[indices[i] * 3 + 1], positions[indices[i] * 3 + 2]
            );
            const v2 = new THREE.Vector3(
                positions[indices[i + 1] * 3], positions[indices[i + 1] * 3 + 1], positions[indices[i + 1] * 3 + 2]
            );
            const v3 = new THREE.Vector3(
                positions[indices[i + 2] * 3], positions[indices[i + 2] * 3 + 1], positions[indices[i + 2] * 3 + 2]
            );

            triangles.push([v1, v2, v3]); // Each triangle as an array of three vertices
        }
    } 
    else 
    {
        // Non-Indexed Geometry: Directly read vertices in groups of 3
        for (let i = 0; i < positions.length; i += 9) 
        {
            const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
            const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
            const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);

            triangles.push([v1, v2, v3]);
        }
    }

    return triangles;
}
