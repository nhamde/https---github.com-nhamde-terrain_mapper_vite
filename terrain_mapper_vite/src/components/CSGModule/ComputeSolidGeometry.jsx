import { CSG } from '../../../CSGMesh';
import * as THREE from 'three';

export const computeSolidGeometry = (terrainMesh, pondMesh) =>
{
    const terrainCSG = CSG.fromMesh(terrainMesh, 0)
    const pondCSG = CSG.fromMesh(pondMesh, 1)

    const intersection = terrainCSG.subtract(pondCSG)

    const intersectionMesh = CSG.toMesh(
        intersection,
        new THREE.Matrix4(),
        [terrainMesh.material, pondMesh.material]
    )

    intersectionMesh.rotation.x = -Math.PI / 2;

    return intersectionMesh;
}