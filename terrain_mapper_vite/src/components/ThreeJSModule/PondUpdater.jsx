import * as THREE from 'three';
import {createFace} from './ThreeJsModelMaker';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

const getIntersectionPoint = (startPoint, direction, mesh) =>
{
    const rayCaster = new THREE.Raycaster();

    rayCaster.set(startPoint, direction);

    const intersects = rayCaster.intersectObject(mesh);

    if (intersects.length === 0) 
    {
        console.log("No intersection found");
        return null;
    }
    else
        return intersects[0].point;
}

const getDirectionFromPoints = (startPoint, endPoint) => 
{
    return new THREE.Vector3(
        endPoint.x - startPoint.x,
        endPoint.y - startPoint.y,
        endPoint.z - startPoint.z
    ).normalize();
};
    

const getToeMidPt = (startVertex, endVertex, daylightSlope, terrainMesh) =>
{
    // Midpoint of the edge
    const edgeMidPt = new THREE.Vector3(
        (startVertex.x + endVertex.x) / 2,
        (startVertex.y + endVertex.y) / 2,
        (startVertex.z + endVertex.z) / 2
    );

    // Edge direction (from startVertex to endVertex)
    const edgeDir = getDirectionFromPoints(startVertex, endVertex);

    // World up vector (0,0,1)
    const upVector = new THREE.Vector3(0, 0, 1);

    // Slope direction: Cross product of edge direction and up vector
    const slopeDir = new THREE.Vector3().crossVectors(edgeDir, upVector).normalize();

    // Final slope vector with daylightSlope applied
    const slopeVector = new THREE.Vector3(
        slopeDir.x * daylightSlope,
        slopeDir.y * daylightSlope,
        -1  // Ensuring it moves downward
    ).normalize();

    // Find the intersection with the terrain
    const toeMidPt = getIntersectionPoint(edgeMidPt, slopeVector, terrainMesh);

    return toeMidPt;
};
    

export const updatePondMesh = (pondInputs, pondMesh, terrainMesh) =>
{
    const {
        safetyLedge,
        nwl2hwl,
        sl2nwl,
        hwl2fb,
        daylightSlope,
        outerWidth,
        outerLength,
        pondPositionZOffset
    } = pondInputs;

    // Calculate pond structure
    const totalHeight = safetyLedge + nwl2hwl + sl2nwl + hwl2fb - pondPositionZOffset;
    const bermVertices = [
        new THREE.Vector3(-outerLength / 2, -outerWidth / 2, totalHeight),
        new THREE.Vector3(outerLength / 2, -outerWidth / 2, totalHeight),
        new THREE.Vector3(outerLength / 2, outerWidth / 2, totalHeight),
        new THREE.Vector3(-outerLength / 2, outerWidth / 2, totalHeight)
    ];

    const frontEdgeToeMidPt = getToeMidPt(bermVertices[0], bermVertices[1], daylightSlope, terrainMesh);
    const rightEdgeToeMidPt = getToeMidPt(bermVertices[1], bermVertices[2], daylightSlope, terrainMesh);
    const leftEdgeToeMidPt = getToeMidPt(bermVertices[3], bermVertices[0], daylightSlope, terrainMesh);
    const backEdgeToeMidPt = getToeMidPt(bermVertices[2], bermVertices[3], daylightSlope, terrainMesh);

    if (!frontEdgeToeMidPt || !rightEdgeToeMidPt || !leftEdgeToeMidPt || !backEdgeToeMidPt)
    {
        console.error("No valid toe midpoint found.");
        return pondMesh; // Return the original pondMesh if intersection fails
    }

    // All Face Planes in object form
    const frontFacePlane = 
    {
        p1:bermVertices[0], 
        p2:bermVertices[1],
        p3:frontEdgeToeMidPt
    };
    const rightFacePlane =
    {
        p1: bermVertices[1],
        p2: bermVertices[2],
        p3: rightEdgeToeMidPt
    };
    const backFacePlane =
    {
        p1: bermVertices[2],
        p2: bermVertices[3],
        p3: backEdgeToeMidPt
    };
    const leftFacePlane =
    {
        p1: bermVertices[3],
        p2: bermVertices[0],
        p3: leftEdgeToeMidPt
    };

    // extreme terrain points at pond toe
    const frontRightCornerToe = getExtremeToePoint(frontFacePlane, rightFacePlane, terrainMesh, bermVertices[1]);
    const frontLeftCornerToe = getExtremeToePoint(leftFacePlane, frontFacePlane, terrainMesh, bermVertices[0]);
    const backRightCornerToe = getExtremeToePoint(rightFacePlane, backFacePlane, terrainMesh, bermVertices[2]);
    const backLeftCornerToe = getExtremeToePoint(backFacePlane, leftFacePlane, terrainMesh, bermVertices[3]);
    
    const pondGeometry = pondMesh.geometry;
    const material = pondMesh.material;
    const frontFaceGeometry = createFace(bermVertices[0], bermVertices[1], frontRightCornerToe, frontLeftCornerToe, 0x0000ff).geometry;
    const rightFaceGeometry = createFace(bermVertices[1], bermVertices[2], backRightCornerToe, frontRightCornerToe, 0x00ff00).geometry;
    const backFaceGeometry = createFace(bermVertices[2], bermVertices[3], backLeftCornerToe, backRightCornerToe, 0xff0000).geometry;
    const leftFaceGeometry = createFace(bermVertices[3], bermVertices[0], frontLeftCornerToe, backLeftCornerToe, 0x00ffff).geometry;

    const mergedGeometry = BufferGeometryUtils.mergeGeometries([pondGeometry, frontFaceGeometry, rightFaceGeometry, backFaceGeometry, leftFaceGeometry]);

    const newPondMesh = new THREE.Mesh(mergedGeometry, material);

    return newPondMesh;
}

// Helper function to find point on terrain mesh where two daylight slopes intersect
const getExtremeToePoint = (plane1, plane2, terrainMesh, startPoint) =>
{
    const cornerEdgeDir = getIntersectionLineDir(plane1 ,plane2);
    const extremeToePoint = getIntersectionPoint(startPoint, cornerEdgeDir, terrainMesh);
    return extremeToePoint;
}

// Calculating plane normals
const getPlaneNormal = (p1, p2, p3) => 
{
    const v1 = new THREE.Vector3().subVectors(p2, p1);
    const v2 = new THREE.Vector3().subVectors(p3, p1);

    // Ensure counterclockwise winding order
    const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

    return normal;
};
    

const getIntersectionLineDir = (plane1, plane2) =>
{
    const normal1 = getPlaneNormal(plane1.p1, plane1.p2, plane1.p3);
    const normal2 = getPlaneNormal(plane2.p1, plane2.p2, plane2.p3);
    const intersectionDir = new THREE.Vector3().crossVectors(normal1, normal2).normalize();
    intersectionDir.negate();
    return intersectionDir;
}