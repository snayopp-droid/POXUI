import * as THREE from "three";

type Bones = Record<string, THREE.Object3D>;
const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
const qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), qp = new THREE.Quaternion();

/** повернуть кость вокруг её начала так, чтобы вектор from→(pivot) совпал с to */
const aim = (bone: THREE.Object3D, pivot: THREE.Vector3, from: THREE.Vector3, to: THREE.Vector3) => {
  const a = from.clone().sub(pivot).normalize();
  const b = to.clone().sub(pivot).normalize();
  qa.setFromUnitVectors(a, b);
  bone.getWorldQuaternion(qb);
  qb.premultiply(qa);
  bone.parent!.getWorldQuaternion(qp);
  bone.quaternion.copy(qp.invert().multiply(qb));
  bone.updateWorldMatrix(false, true);
};

/** двухкостный IK руки: кисть тянется к target (мировые координаты), локоть — в сторону pole */
export const reachArm = (b: Bones, side: "l" | "r", target: THREE.Vector3, pole: THREE.Vector3, w = 1) => {
  const up = b[`upperarm_${side}`], lo = b[`lowerarm_${side}`], hd = b[`hand_${side}`];
  if (!up || !lo || !hd || w <= 0) return;
  up.updateWorldMatrix(true, true);
  up.getWorldPosition(A);
  lo.getWorldPosition(B);
  hd.getWorldPosition(C);
  const l1 = A.distanceTo(B), l2 = B.distanceTo(C);
  const T = C.clone().lerp(target, Math.min(1, w));
  const dir = T.clone().sub(A);
  let d = dir.length();
  d = Math.min(l1 + l2 - 1e-3, Math.max(Math.abs(l1 - l2) + 1e-3, d));
  dir.normalize();
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const pv = pole.clone().sub(A);
  pv.addScaledVector(dir, -pv.dot(dir)).normalize();
  const elbow = A.clone().addScaledVector(dir, a).addScaledVector(pv, h);
  const tip = A.clone().addScaledVector(dir, d);
  aim(up, A.clone(), B.clone(), elbow);
  lo.getWorldPosition(B);
  hd.getWorldPosition(C);
  aim(lo, B.clone(), C.clone(), tip);
};

/** положение точки в мировых координатах для персонажа в pos, повёрнутого на rotY */
export const rel = (pos: [number, number, number], rotY: number, l: [number, number, number]) => {
  const c = Math.cos(rotY), s = Math.sin(rotY);
  return new THREE.Vector3(pos[0] + l[0] * c + l[2] * s, pos[1] + l[1], pos[2] - l[0] * s + l[2] * c);
};
