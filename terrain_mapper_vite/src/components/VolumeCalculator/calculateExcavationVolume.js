import * as THREE from 'three';

// calculates the volume of earth occupied by pond
export const calculateExcavationVolume = (pondMesh, terrainMesh, totalHeight, maxBoundAtBerm, minBoundAtBerm) =>
{
    const maxBound = maxBoundAtBerm;
    const minBound = new THREE.Vector3(minBoundAtBerm.x, minBoundAtBerm.y, minBoundAtBerm.z - totalHeight);

    const rayCaster = new THREE.Raycaster();
    const upDirection = new THREE.Vector3(0, 0, 1);
    const downDirection = new THREE.Vector3(0, 0, -1);

    let excavationVolume = 0;

    for (let x=minBound.x; x<=maxBound.x; x+=1)
    {
        for (let y=minBound.y; y<=maxBound.y; y+=1)
        {
            for (let z=minBound.z; z<=maxBound.z; z+=1)
            {
                console.log("Its happening")
                const startPoint = new THREE.Vector3(x, y, z);
                rayCaster.set(startPoint, upDirection);
                const upIntersection = rayCaster.intersectObject(terrainMesh);
                rayCaster.set(startPoint, downDirection);
                const downIntersection = rayCaster.intersectObject(pondMesh);

                if (upIntersection && downIntersection)
                {
                    excavationVolume += 1;
                }
            }
        }
    }
    return excavationVolume;
}