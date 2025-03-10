import * as THREE from 'three';

class BSPNode {
    constructor(triangles) {
        this.triangles = [];
        this.front = null;
        this.back = null;
        if (triangles.length > 0) {
            this.build(triangles);
        }
    }

    build(triangles) {
        if (triangles.length === 0) return;
        
        let plane = triangles[0]; // First triangle defines the splitting plane
        this.triangles.push(plane);
        let front = [];
        let back = [];

        for (let i = 1; i < triangles.length; i++) {
            const tri = triangles[i];
            const classification = this.classifyTriangle(tri, plane);

            if (classification === 'front') front.push(tri);
            else if (classification === 'back') back.push(tri);
            else if (classification === 'spanning') {
                const [frontSplit, backSplit] = this.splitTriangle(tri, plane);
                front.push(...frontSplit);
                back.push(...backSplit);
            }
        }

        if (front.length > 0) this.front = new BSPNode(front);
        if (back.length > 0) this.back = new BSPNode(back);
    }

    classifyTriangle(triangle, plane) {
        let front = 0, back = 0;
        for (let v of triangle) {
            let side = this.classifyPoint(v, plane);
            if (side > 0) front++;
            else if (side < 0) back++;
        }
        if (front > 0 && back > 0) return 'spanning';
        return front > 0 ? 'front' : 'back';
    }

    classifyPoint(point, plane) {
        let normal = this.getPlaneNormal(plane);
        let d = normal.dot(plane[0]);
        let distance = normal.dot(point) - d;
        return Math.sign(distance);
    }

    getPlaneNormal(plane) {
        const v1 = new THREE.Vector3().subVectors(plane[1], plane[0]);
        const v2 = new THREE.Vector3().subVectors(plane[2], plane[0]);
        return new THREE.Vector3().crossVectors(v1, v2).normalize();
    }

    splitTriangle(triangle, plane) {
        // Splitting logic to ensure all output remains in triangles
        // Placeholder: Implement proper intersection-based splitting
        return [[triangle], []];
    }

    subtract(other) {
        let a = new BSPNode(this.clipTo(other));
        let b = new BSPNode(other.clipTo(this));
        a.invert();
        b.invert();
        b.clipTo(a);
        b.invert();
        a.build(b.allTriangles());
        return a;
    }

    clipTo(node) {
        if (!node) return this.triangles;
        let front = [], back = [];
        for (let tri of this.triangles) {
            const classification = node.classifyTriangle(tri, node.triangles[0]);
            if (classification === 'front') front.push(tri);
            else if (classification === 'back') back.push(tri);
            else {
                const [frontSplit, backSplit] = node.splitTriangle(tri, node.triangles[0]);
                front.push(...frontSplit);
                back.push(...backSplit);
            }
        }
        return front;
    }

    allTriangles() {
        let triangles = [...this.triangles];
        if (this.front) triangles.push(...this.front.allTriangles());
        if (this.back) triangles.push(...this.back.allTriangles());
        return triangles;
    }

    invert() {
        for (let tri of this.triangles) tri.reverse();
        if (this.front) this.front.invert();
        if (this.back) this.back.invert();
        [this.front, this.back] = [this.back, this.front];
    }
}
