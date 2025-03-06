import * as THREE from "three";

export const createFace = (v1, v2, v3, v4, color) => 
    {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            v1.x, v1.y, v1.z,
            v2.x, v2.y, v2.z,
            v3.x, v3.y, v3.z,
            v4.x, v4.y, v4.z
        ]);
        const indices = [0, 1, 2, 2, 0, 3]; // Corrected for quad rendering
        geometry.setIndex(indices);
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
    
        return new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color, roughness: 0.5, side: THREE.DoubleSide, flatShading: true })
        );
    };

export const createBlock = (v0, v1, v2, v3, v4, v5, v6, v7, color) =>
{
    const block = new THREE.Group();
    block.add(createFace(v0, v1, v2, v3, color)); // Front
    block.add(createFace(v4, v5, v6, v7, color)); // Back
    block.add(createFace(v0, v3, v7, v4, color)); // Left
    block.add(createFace(v1, v2, v6, v5, color)); // Right

    return block;
}