import * as THREE from 'three';

export const pond2 = () =>
{
    // Create a buffer geometry to handle 3D coordinates
    const vertices = [
        -10, -10, 12,
        -5, -10, 15,
        0, -10, 13,
        10, -10, 18,
        15, -10, 20,
        18, -10, 17,
        22, -10, 14,
        -10, -10, 12 // Closing point to ensure a closed shape
    ];

    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3);
    geometry.setAttribute('position', positionAttribute);

    // Triangulate the geometry
    geometry.setIndex([0, 1, 2, 0, 2, 3, 3, 4, 5, 3, 5, 6]);
    geometry.computeVertexNormals(); // Ensures smooth shading

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: false });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = -Math.PI / 2; // Align with ground plane

    return mesh;
};