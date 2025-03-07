import * as THREE from 'three';

class BSPNode
{
    constructor(polygons) 
    {
        this.polygons = [];
        this.front = null;
        this.back = null;
        if (polygons.length > 0)
        {
            this.build(polygons);
        }
    }

    build = (polygons) =>
    {
        if (polygons.length === 0) 
            return null;

        let plane = polygons[0];
        let front = [];
        let back = [];

        for (let polygon of polygons)
        {
            this.splitPolygon(polygon, plane, front, back);
        }

        if (front.length > 0)
        {
            this.front = new BSPNode(front);
        }
        if (back.length > 0)
        {
            this.back = new BSPNode(back);
        }
    }

    splitPolygon = (polygon, plane, front, back) =>
    {
        let frontPolygons = [];
        let backPolygons = [];

        for ( let v of polygon )
        {
            let side = this.classifyPoint(v, plane);
        }
    }

    classifyPoint = (point, plane) =>
    {
        const v1 = plane[0];
        const v2 = plane[1];
        const v3 = plane[2];
        const vec1 = new THREE.Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
        const vec2 = new THREE.Vector3(v1.x - v3.x, v1.y - v3.y, v1.z - v3.z);

        const normal = new THREE.Vector3().crossVectors(vec1, vec2).normalize();

        const d = normal.dot(v1);
        const distance = normal.dot(point) - d;
    }
}