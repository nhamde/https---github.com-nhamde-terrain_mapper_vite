import * as THREE from 'three';
import {createFace} from './ThreeJsModelMaker';

export const createPondFootPrint = ( pondLotSide ) =>
{
    const length = pondLotSide;
    const width = pondLotSide;

    const frontLeftCorner = new THREE.Vector3(-length / 2, -width / 2, 0);
    const frontRightCorner = new THREE.Vector3(length / 2, -width / 2, 0);
    const backLeftCorner = new THREE.Vector3(-length / 2, width / 2, 0);
    const backRightCorner = new THREE.Vector3(length / 2, width / 2, 0);

    const pondFootPrint =  createFace(frontLeftCorner, frontRightCorner, backLeftCorner, backRightCorner, 0x0000FF);
    pondFootPrint.rotation.x = -Math.PI / 2;
    return pondFootPrint;
}