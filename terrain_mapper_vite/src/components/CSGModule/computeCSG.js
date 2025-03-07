import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';
import * as THREE from 'three';

const applyUV = (mesh) =>
{
    const geometry = mesh.geometry;
    geometry.computeBoundingBox(); // Compute bounding box for normalization

    const positions = geometry.attributes.position.array;
    const uvs = new Float32Array(positions.length / 3 * 2); // Allocate UV array

    const bbox = geometry.boundingBox;
    const min = bbox.min, max = bbox.max;

    // Normalize UVs between 0 and 1
    for (let i = 0; i < positions.length; i += 3) 
    {
        uvs[i / 3 * 2] = (positions[i] - min.x) / (max.x - min.x);
        uvs[i / 3 * 2 + 1] = (positions[i + 1] - min.y) / (max.y - min.y);
    }

    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2)); // Set UVs
    return geometry;
}

export const computeCSG = (mesh1, mesh2) =>
{
    const uvAppliedGeom1 = applyUV(mesh1)
    const brush1 = new Brush( uvAppliedGeom1 );
    const uvAppliedGeom2 = applyUV(mesh2)
    const brush2 = new Brush( uvAppliedGeom2 );
    const evaluator = new Evaluator();

    console.log("mesh1:", brush1.geometry);
    console.log("mesh2: ", brush2.geometry);

    const result = evaluator.evaluate( brush1, brush2, SUBTRACTION);
    result.rotation.x = -Math.PI / 2;
    return result;
}