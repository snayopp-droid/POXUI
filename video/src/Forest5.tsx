import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import type * as PIXI from "pixi.js";
import { Camera, Color, Container3D, Light, LightType, LightingEnvironment, Mesh3D, StandardMaterial } from "pixi3d/pixi7";
import { Pixi3DLayer } from "./Pixi3DLayer";
import { DURATION_SEC, FPS, LINES, lineAt, sceneAt, startOf } from "./timeline10";

const FONT = "'Inter', 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const RED = "#ff5a48";
const GREEN = "#66f0a8";
const BLUE = "#7cd4ff";

/* =====================  3D: сцена на pixi3d  ===================== */
type V3 = [number, number, number];
const lerp3 = (a: V3, b: V3, p: number): V3 => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];

const mat = (r: number, g: number, b: number, rough = 0.85) => {
  const m = new StandardMaterial();
  m.baseColor = new Color(r, g, b);
  m.roughness = rough;
  m.metallic = 0;
  return m;
};
const put = <T extends Container3D>(o: T, x: number, y: number, z: number, parent?: PIXI.Container) => {
  o.position.set(x, y, z);
  parent?.addChild(o);
  return o;
};
// куб в pixi3d единственный с тангентами и ломает общий шейдер, поэтому коробка — это 4-гранный цилиндр
const box = (m: StandardMaterial, sx: number, sy: number, sz: number) => {
  const c = Mesh3D.createCylinder(m, { radiusTop: 0.7071, radiusBottom: 0.7071, height: 1, radialSegments: 4 });
  rot(c, 0, 45, 0);
  const w = new Container3D();
  w.addChild(c);
  w.scale.set(sx, sy, sz);
  return w;
};
const cyl = (m: StandardMaterial, rt: number, rb: number, h: number, seg = 10) => Mesh3D.createCylinder(m, { radiusTop: rt, radiusBottom: rb, height: h, radialSegments: seg });
const ball = (m: StandardMaterial, r: number) => {
  const s = Mesh3D.createSphere(m, { radius: r, segments: 14, rings: 12 } as never);
  return s;
};
const rot = (o: Container3D, x: number, y: number, z: number) => o.rotationQuaternion.setEulerAngles(x, y, z);

type Hero = { root: Container3D; legL: Container3D; legR: Container3D; armL: Container3D; armR: Container3D; head: Container3D; torso: Container3D };
const makeHero = (): Hero => {
  const root = new Container3D();
  const jacket = mat(0.91, 0.38, 0.17);
  const pants = mat(0.12, 0.12, 0.17);
  const skin = mat(0.89, 0.69, 0.54);
  const hat = mat(0.18, 0.36, 0.23);
  const boot = mat(0.07, 0.07, 0.08);
  const mkLeg = (x: number) => {
    const g = put(new Container3D(), x, 0.92, 0, root);
    put(cyl(pants, 0.09, 0.08, 0.86), 0, -0.43, 0, g);
    put(box(boot, 0.17, 0.12, 0.28), 0, -0.9, -0.05, g);
    return g;
  };
  const legL = mkLeg(-0.13);
  const legR = mkLeg(0.13);
  const torso = put(new Container3D(), 0, 0, 0, root);
  put(box(jacket, 0.5, 0.64, 0.3), 0, 1.24, 0, torso);
  put(box(mat(1, 0.83, 0.3), 0.51, 0.06, 0.31), 0, 1.1, 0, torso);
  const mkArm = (x: number) => {
    const g = put(new Container3D(), x, 1.5, 0, root);
    put(cyl(jacket, 0.075, 0.07, 0.56), 0, -0.28, 0, g);
    put(ball(skin, 0.085), 0, -0.6, 0, g);
    return g;
  };
  const armL = mkArm(-0.34);
  const armR = mkArm(0.34);
  const head = put(new Container3D(), 0, 1.78, 0, root);
  put(ball(skin, 0.2), 0, 0, 0, head);
  put(cyl(hat, 0.17, 0.21, 0.14, 12), 0, 0.15, 0, head);
  put(box(hat, 0.34, 0.03, 0.18), 0, 0.09, -0.16, head);
  put(ball(mat(0.05, 0.05, 0.05), 0.026), -0.07, 0.02, -0.18, head);
  put(ball(mat(0.05, 0.05, 0.05), 0.026), 0.07, 0.02, -0.18, head);
  return { root, legL, legR, armL, armR, head, torso };
};

const makePine = (x: number, z: number, s: number, dark: number) => {
  const g = new Container3D();
  put(cyl(mat(0.2, 0.13, 0.08), 0.13, 0.17, 1.2, 6), 0, 0.6, 0, g);
  const gr = 0.1 + dark * 0.12;
  for (let i = 0; i < 4; i++) put(cyl(mat(0.05 + i * 0.01, gr + i * 0.02, 0.1), 0.02, 1.5 - i * 0.28, 1.5, 8), 0, 1.5 + i * 0.9, 0, g);
  g.position.set(x, 0, z);
  g.scale.set(s, s, s);
  return g;
};

type Fire = { g: Container3D; flames: Container3D[]; smoke: Container3D[] };
const makeFire = (): Fire => {
  const g = new Container3D();
  const log = mat(0.28, 0.16, 0.08);
  put(rotated(cyl(log, 0.07, 0.07, 0.9), 0, 0, 80), 0, 0.08, 0, g);
  put(rotated(cyl(log, 0.07, 0.07, 0.9), 0, 70, 80), 0, 0.08, 0, g);
  const flames: Container3D[] = [];
  [[0xd9, 0x46, 0x1f, 0.34, 1.0], [0xff, 0x8a, 0x1f, 0.26, 0.8], [0xff, 0xd2, 0x5a, 0.16, 0.55]].forEach(([r, gg, b, rad, h], i) => {
    const m = mat(r / 255, gg / 255, b / 255, 0.3);
    const f = put(cyl(m, 0.0, rad as number, h as number, 8), 0, (h as number) / 2 + 0.1, 0, g);
    flames.push(f);
    void i;
  });
  const smoke: Container3D[] = [];
  for (let i = 0; i < 6; i++) smoke.push(put(ball(mat(0.55, 0.57, 0.6, 1), 0.2), 0, 1.6, 0, g));
  return { g, flames, smoke };
};
function rotated<T extends Container3D>(o: T, x: number, y: number, z: number) {
  rot(o, x, y, z);
  return o;
}

export const FOREST_BUILD = (app: PIXI.Application) => {
  const stage = app.stage;
  const env = LightingEnvironment.main;
  const moon = Object.assign(new Light(), { type: LightType.directional, intensity: 2.2, color: new Color(0.62, 0.72, 1) });
  rot(moon, 48, 25, 0);
  const fill = Object.assign(new Light(), { type: LightType.directional, intensity: 1.1, color: new Color(0.55, 0.6, 0.8) });
  rot(fill, 20, 200, 0);
  const fireLightA = Object.assign(new Light(), { type: LightType.point, intensity: 0, range: 7, color: new Color(1, 0.55, 0.2) });
  const fireLightB = Object.assign(new Light(), { type: LightType.point, intensity: 0, range: 7, color: new Color(1, 0.55, 0.2) });
  env.lights.push(moon, fill, fireLightA, fireLightB);
  stage.addChild(fireLightA, fireLightB);

  Camera.main.fieldOfView = 55;
  Camera.main.far = 200;

  // земля
  const ground = Mesh3D.createPlane(mat(0.07, 0.15, 0.1, 1));
  ground.scale.set(120, 1, 120);
  stage.addChild(ground);

  // лес кольцом + редкие деревья в кадре
  for (let i = 0; i < 70; i++) {
    const a = hash(i) * Math.PI * 2;
    const r = 5.5 + hash(i + 40) * 24;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    if (x > 6 && Math.abs(z - 4) < 4.2) continue; // просека к деревне
    stage.addChild(makePine(x, z, 0.8 + hash(i + 7) * 0.9, hash(i + 11)));
  }

  const hero = makeHero();
  stage.addChild(hero.root);

  // красные глаза в чаще
  const eyeMat = mat(1, 0.1, 0.08, 0.3);
  const eyes = [0, 1, 2, 3].map((i) => {
    const g = new Container3D();
    put(ball(eyeMat, 0.05), -0.12, 0, 0, g);
    put(ball(eyeMat, 0.05), 0.12, 0, 0, g);
    g.position.set([-4, 4.5, -2.5, 3][i], 0.9, [3, 2.5, 6, 7][i]);
    stage.addChild(g);
    return g;
  });

  // бревно
  const logMesh = put(rotated(cyl(mat(0.3, 0.2, 0.1), 0.24, 0.24, 1.8), 0, 0, 90), 0, 0.24, 0.5, stage);
  // знак стоп
  const sign = new Container3D();
  put(cyl(mat(0.6, 0.6, 0.65), 0.04, 0.04, 2.2, 8), 0, 1.1, 0, sign);
  const plate = put(rotated(cyl(mat(0.85, 0.12, 0.1, 0.5), 0.5, 0.5, 0.06, 8), 90, 22.5, 0), 0, 2.3, 0, sign);
  put(rotated(cyl(mat(0.95, 0.95, 0.95, 0.5), 0.56, 0.56, 0.05, 8), 90, 22.5, 0), 0, 2.3, 0.02, sign);
  stage.addChild(sign);
  void plate;
  // следы по кругу
  const prints = Array.from({ length: 16 }).map((_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const p = box(mat(0.04, 0.07, 0.05), 0.18, 0.03, 0.34);
    p.position.set(Math.cos(a) * 2.8, 0.02, Math.sin(a) * 2.8);
    rot(p, 0, -(a * 180) / Math.PI + 90, 0);
    stage.addChild(p);
    return p;
  });

  // костры
  const fires = [makeFire(), makeFire(), makeFire()];
  fires.forEach((f) => stage.addChild(f.g));

  // шалаш
  const shelter = new Container3D();
  const stickM = mat(0.4, 0.27, 0.15);
  const poles: Container3D[] = [];
  for (let i = 0; i < 9; i++) {
    const s = put(rotated(cyl(stickM, 0.04, 0.05, 2.0, 6), 0, 0, 38), 0, 0.8, 0, shelter);
    s.position.set(-0.8 + i * 0.2, 0.8, 0.5 - i * 0.0);
    poles.push(s);
  }
  put(rotated(cyl(stickM, 0.05, 0.05, 2.0, 6), 0, 0, 90), -0.1, 1.55, 0.05, shelter);
  stage.addChild(shelter);

  // ручей и деревня
  const stream = Mesh3D.createPlane(mat(0.12, 0.42, 0.75, 0.2));
  stream.scale.set(24, 1, 1.4);
  stream.position.set(4, 0.03, 1.4);
  rot(stream, 0, -12, 0);
  stage.addChild(stream);
  const leaf = put(box(mat(0.95, 0.9, 0.4), 0.2, 0.02, 0.12), 0, 0.07, 1.4, stage);
  const village = new Container3D();
  [0, 1, 2].forEach((i) => {
    const h = new Container3D();
    put(box(mat(0.42, 0.28, 0.18), 1.6, 1.2, 1.4), 0, 0.6, 0, h);
    put(rotated(cyl(mat(0.55, 0.16, 0.12), 0.0, 1.35, 0.9, 4), 0, 45, 0), 0, 1.65, 0, h);
    put(box(mat(1, 0.82, 0.35, 0.3), 0.35, 0.35, 0.05), 0, 0.7, -0.72, h);
    h.position.set(11 + i * 2.6, 0, 5.5 + (i % 2) * 2);
    village.addChild(h);
  });
  stage.addChild(village);

  // ягоды
  const bush = new Container3D();
  put(ball(mat(0.08, 0.3, 0.12), 0.5), 0, 0.5, 0, bush);
  put(ball(mat(0.08, 0.32, 0.12), 0.38), 0.4, 0.4, 0.1, bush);
  const berryM = mat(0.85, 0.1, 0.2, 0.3);
  for (let i = 0; i < 16; i++) put(ball(berryM, 0.06), Math.cos(i * 2.4) * 0.5, 0.45 + Math.sin(i * 1.7) * 0.3, -0.38 + Math.sin(i) * 0.1, bush);
  stage.addChild(bush);

  // вертолёт
  const heli = new Container3D();
  put(ball(mat(0.12, 0.14, 0.18, 0.4), 0.6), 0, 0, 0, heli);
  put(box(mat(0.12, 0.14, 0.18), 1.8, 0.14, 0.14), -1.2, 0.05, 0, heli);
  const rotor = put(box(mat(0.05, 0.05, 0.05), 3.2, 0.03, 0.12), 0, 0.6, 0, heli);
  put(ball(mat(1, 0.95, 0.6, 0.2), 0.12), 0.5, -0.1, 0, heli);
  stage.addChild(heli);

  const hide = (...o: Container3D[]) => o.forEach((x) => (x.visible = false));

  return (frame: number, fps: number) => {
    const t = frame / fps;
    const { idx, sceneStart, sceneEnd } = sceneAt(t);
    const k = t - sceneStart;
    const d = sceneEnd - sceneStart;
    const p = Math.min(1, k / d);
    const flick = 0.85 + 0.15 * Math.sin(t * 13) + 0.05 * Math.sin(t * 31);

    // видимость
    hide(logMesh, sign, shelter, stream, leaf, village, bush, heli);
    prints.forEach((x) => (x.visible = false));
    fires.forEach((f) => (f.g.visible = false));
    fireLightA.intensity = 0;
    fireLightB.intensity = 0;
    eyes.forEach((e, i) => (e.visible = idx <= 1 && Math.sin(t * 2 + i * 2) > -0.3));

    const H0 = hero;
    H0.root.visible = true;
    let cam: V3 = [0, 1.5, -4];
    let tgt: V3 = [0, 1.2, 0];
    let hp: V3 = [0, 0, 0];
    let hy = 0;
    let legs = 0;
    let armLa = 0;
    let armRa = 0;
    let sit = false;
    let headY = 0;
    let bob = 0;

    switch (idx) {
      case 0: {
        cam = lerp3([0.9, 1.3, -6.2], [0.3, 1.5, -3.6], ease(p));
        tgt = [0, 1.3, 0];
        headY = Math.sin(t * 2.2) * 40;
        armLa = Math.sin(t * 4) * 8;
        armRa = 8;
        break;
      }
      case 1: {
        const a = interpolate(p, [0, 1], [-0.45, 0.45]);
        cam = [Math.sin(a) * 4.6, 1.6, -Math.cos(a) * 4.6];
        tgt = [0, 1.3, 0];
        headY = 0;
        break;
      }
      case 2: {
        sit = true;
        logMesh.visible = true;
        logMesh.position.set(0, 0.24, 0.45);
        hp = [0, 0.02, 0];
        sign.visible = true;
        sign.position.set(-2.1, 0, -0.6);
        rot(sign, 0, Math.sin(t * 0.8) * 12 + 18, 0);
        prints.forEach((x, i) => (x.visible = k > 4.0 + i * 0.1));
        const pc = ease(interpolate(k, [3.8, 6.2], [0, 1], clamp));
        cam = lerp3([2.4, 1.3, -4.2], [0.6, 8.2, -5.6], pc);
        tgt = lerp3([0, 1.0, 0], [0, 0, 0.4], pc);
        legs = 90;
        armLa = 40 + Math.sin(t * 2.5) * 6;
        armRa = 40;
        bob = Math.sin(t * 2.5) * 0.015;
        headY = k > 3.5 ? 0 : Math.sin(t * 5) * 14;
        break;
      }
      case 3: {
        fires[0].g.visible = true;
        fires[0].g.position.set(1.5, 0, 0.5);
        fireLightA.position.set(1.5, 1.0, 0.1);
        fireLightA.intensity = (k > 3.2 ? 5 : 0.2) * flick;
        const grow = ease((k - 3.2) / 0.8);
        fires[0].flames.forEach((f, i) => f.scale.set(grow, grow * (1 + Math.sin(t * (9 + i * 3)) * 0.14), grow));
        fires[0].smoke.forEach((s, i) => {
          const q = (t * 0.4 + i / 6) % 1;
          s.position.set(Math.sin(t + i) * 0.2, 1.0 + q * 3, 0);
          const sc = k > 3.4 ? 0.4 + q * 1.4 : 0.001;
          s.scale.set(sc, sc, sc);
        });
        shelter.visible = true;
        shelter.position.set(-2.4, 0, 1.6);
        poles.forEach((s, i) => (s.visible = k > 3.0 + i * 0.35));
        const going = k < 3.2;
        hp = going ? lerp3([-1.6, 0, -0.6], [-0.4, 0, -0.1], ease(k / 3.2)) : [-0.2, 0, -0.1];
        hy = going ? 20 : -25;
        legs = going ? Math.sin(t * 8) * 28 : 0;
        armLa = going ? 55 : 20;
        armRa = going ? 55 : 70;
        bob = going ? Math.abs(Math.sin(t * 8)) * 0.05 : 0;
        cam = lerp3([-3.2, 1.7, -4.2], [3.0, 2.0, -3.6], p);
        tgt = [0.2, 1.0, 0.4];
        break;
      }
      case 4: {
        stream.visible = true;
        leaf.visible = true;
        leaf.position.set(-6 + ((t * 2.4) % 22), 0.07, 1.4 + (-6 + ((t * 2.4) % 22)) * -0.2125 * -1 * 0);
        village.visible = true;
        fires[0].g.visible = k > 5.0;
        fires[0].g.position.set(-2.0, 0, -0.8);
        fireLightA.position.set(-2.0, 1.0, -1.2);
        fireLightA.intensity = k > 5.0 ? 4 * flick : 0;
        fires[0].flames.forEach((f, i) => f.scale.set(1, 1 + Math.sin(t * (9 + i * 3)) * 0.14, 1));
        fires[0].smoke.forEach((s) => s.scale.set(0.001, 0.001, 0.001));
        sit = true;
        hp = [0.4, -0.1, 0.0];
        hy = 70;
        legs = 90;
        armLa = 95 + Math.sin(t * 3) * 8;
        armRa = 30;
        headY = 20;
        cam = lerp3([-3.2, 1.8, -3.2], [6.2, 2.4, -2.4], ease(p));
        tgt = lerp3([0.4, 0.6, 0.6], [11, 1, 5], ease(p));
        break;
      }
      case 5: {
        [-2.4, 0, 2.4].forEach((x, i) => {
          const f = fires[i];
          f.g.visible = k > 0.4 + i * 0.35;
          f.g.position.set(x, 0, 1.4 + (i === 1 ? 1.5 : 0));
          f.flames.forEach((fl, j) => fl.scale.set(1, 1 + Math.sin(t * (9 + j * 3) + i) * 0.14, 1));
          f.smoke.forEach((s, j) => {
            const q = (t * 0.35 + j / 6 + i * 0.2) % 1;
            s.position.set(Math.sin(t + j) * 0.25, 1.0 + q * 4, 0);
            const sc = 0.4 + q * 1.5;
            s.scale.set(sc, sc, sc);
          });
        });
        fireLightA.position.set(-2.4, 1, 1.0);
        fireLightA.intensity = 4 * flick;
        fireLightB.position.set(2.4, 1, 1.0);
        fireLightB.intensity = 4 * flick;
        heli.visible = k > 3.0;
        heli.position.set(interpolate(k, [3.0, 6.6], [-12, 12], clamp), 7.5, 6);
        rot(heli, 0, 0, 0);
        rot(rotor, 0, t * 2200, 0);
        hp = [0, 0, -0.6];
        hy = 0;
        armLa = 165 + Math.sin(t * 9) * 22;
        armRa = 165 - Math.sin(t * 9) * 22;
        headY = 0;
        bob = Math.abs(Math.sin(t * 9)) * 0.04;
        cam = lerp3([0, 1.2, -5.2], [0, 1.0, -4.6], p);
        tgt = k < 3.0 ? [0, 1.4, 0.4] : lerp3([0, 1.4, 0.4], [0, 5.8, 4], ease((k - 3.0) / 1.4));
        break;
      }
      case 6: {
        bush.visible = true;
        bush.position.set(1.0, 0, 0.5);
        rot(bush, 0, t * 20, 0);
        hp = [-0.7, 0, -0.1];
        hy = -35;
        armLa = 10;
        armRa = 88 + Math.sin(t * 5) * 16;
        headY = -25;
        cam = lerp3([-1.2, 1.4, -3.4], [0.9, 1.3, -2.4], p);
        tgt = [0.35, 1.0, 0.3];
        break;
      }
      default: {
        hp = [0, 0, 0];
        hy = 0;
        armLa = 8;
        armRa = 170;
        bob = Math.abs(Math.sin(t * 4)) * 0.05;
        headY = 0;
        cam = lerp3([0, 1.4, -3.6], [0, 3.4, -9], ease(p));
        tgt = lerp3([0, 1.4, 0], [0, 1.2, 0], p);
        fires[0].g.visible = true;
        fires[0].g.position.set(1.8, 0, 0.6);
        fires[0].flames.forEach((f, i) => f.scale.set(1, 1 + Math.sin(t * (9 + i * 3)) * 0.14, 1));
        fires[0].smoke.forEach((s) => s.scale.set(0.001, 0.001, 0.001));
        fireLightA.position.set(1.8, 1, 0.2);
        fireLightA.intensity = 3 * flick;
      }
    }

    H0.root.position.set(hp[0], hp[1] - (sit ? 0.45 : 0) + bob, hp[2]);
    rot(H0.root, 0, hy, 0);
    rot(H0.legL, sit ? legs : legs, 0, 0);
    rot(H0.legR, sit ? legs * 0.92 : -legs, 0, 0);
    rot(H0.armL, armLa, 0, 0);
    rot(H0.armR, armRa, 0, 0);
    rot(H0.head, 0, headY, 0);

    Camera.main.position.set(cam[0], cam[1], cam[2]);
    {
      const dx = tgt[0] - cam[0];
      const dy = tgt[1] - cam[1];
      const dz = tgt[2] - cam[2];
      Camera.main.rotationQuaternion.setEulerAngles((Math.atan2(-dy, Math.hypot(dx, dz)) * 180) / Math.PI, (Math.atan2(dx, dz) * 180) / Math.PI, 0);
    }
    void d;
  };
};

/* =====================  премиальные плашки и оверлеи  ===================== */
const glass = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: "linear-gradient(155deg, rgba(255,255,255,.17), rgba(255,255,255,.05) 55%, rgba(255,230,170,.07))",
  border: "1.5px solid rgba(255,226,160,.38)",
  backdropFilter: "blur(16px) saturate(1.3)",
  WebkitBackdropFilter: "blur(16px) saturate(1.3)",
  boxShadow: "0 24px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.28), inset 0 0 40px rgba(255,200,100,.05)",
  borderRadius: 36,
  fontFamily: FONT,
  color: "#fff",
  ...extra,
});
const goldText: React.CSSProperties = {
  background: "linear-gradient(180deg, #fff3cf 0%, #ffd98a 45%, #d9962b 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
  filter: "drop-shadow(0 4px 10px rgba(0,0,0,.5))",
};
const caps: React.CSSProperties = { fontSize: 22, fontWeight: 800, letterSpacing: 7, color: "rgba(255,236,190,.75)", textTransform: "uppercase" };

const Icon: React.FC<{ name: "stop" | "flame" | "drop" | "whistle" | "leaf"; size?: number; color?: string }> = ({ name, size = 56, color = "#2a1a05" }) => {
  const p = { fill: color, stroke: "none" } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {name === "stop" && <><polygon points="22,6 42,6 58,22 58,42 42,58 22,58 6,42 6,22" {...p} /><rect x="20" y="28" width="24" height="8" rx="3" fill="#ffd98a" /></>}
      {name === "flame" && <path d="M32 4 C40 18 52 24 48 42 C46 54 38 60 32 60 C24 60 16 54 16 44 C16 34 24 30 26 20 C30 24 30 28 32 30 C34 22 32 12 32 4Z" {...p} />}
      {name === "drop" && <path d="M32 4 C42 20 52 30 52 40 C52 52 43 60 32 60 C21 60 12 52 12 40 C12 30 22 20 32 4Z" {...p} />}
      {name === "whistle" && <><rect x="6" y="24" width="38" height="18" rx="9" {...p} /><circle cx="46" cy="34" r="12" {...p} /><circle cx="46" cy="34" r="4" fill="#ffd98a" /></>}
      {name === "leaf" && <path d="M10 54 C10 24 30 8 58 8 C58 36 42 56 14 56Z" {...p} />}
    </svg>
  );
};

const Header: React.FC<{ t: number; idx: number }> = ({ t, idx }) => (
  <>
    <div style={{ ...glass({ borderRadius: 999 }), position: "absolute", left: 40, top: 138, padding: "14px 28px 14px 22px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 16, height: 16, borderRadius: 8, background: RED, boxShadow: `0 0 18px ${RED}`, opacity: Math.sin(t * 6) > 0 ? 1 : 0.3 }} />
      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 3 }}>ДЕНЬ 1</div>
      <div style={{ width: 2, height: 26, background: "rgba(255,226,160,.4)" }} />
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 6, ...goldText }}>ЛЕС</div>
    </div>
    <div style={{ ...glass({ borderRadius: 999 }), position: "absolute", right: 40, top: 150, padding: "16px 22px", display: "flex", gap: 9 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ width: 34, height: 8, borderRadius: 4, background: idx - 2 >= i ? "linear-gradient(90deg,#ffe9b0,#e0a53a)" : "rgba(255,255,255,.22)", boxShadow: idx - 2 >= i ? "0 0 12px rgba(255,200,90,.7)" : "none" }} />
      ))}
    </div>
  </>
);

const TILE = [
  { t: "СТОП", i: "stop" as const },
  { t: "ТЕПЛО", i: "flame" as const },
  { t: "ВОДА", i: "drop" as const },
  { t: "СИГНАЛ", i: "whistle" as const },
  { t: "ЕДА", i: "leaf" as const },
];
const Tile: React.FC<{ idx: number; k: number }> = ({ idx, k }) => {
  if (idx < 2 || idx > 6) return null;
  const n = idx - 1;
  const info = TILE[n - 1];
  const p = ease(k / 0.45);
  return (
    <div style={{ ...glass({ borderRadius: 44 }), position: "absolute", left: 50, right: 50, top: 232 + (1 - p) * -90, height: 168, display: "flex", alignItems: "center", gap: 28, padding: "0 38px 0 30px", opacity: p, transform: `scale(${0.92 + 0.08 * p})` }}>
      <div style={{ width: 108, height: 108, borderRadius: 54, background: "radial-gradient(circle at 30% 25%, #fff4d0, #ffd98a 45%, #c98a1e)", display: "grid", placeItems: "center", boxShadow: "0 10px 30px rgba(224,165,58,.55), inset 0 2px 0 rgba(255,255,255,.7)" }}>
        <Icon name={info.i} size={58} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={caps}>Правило · {n} из 5</div>
        <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 0.95, ...goldText }}>0{n}</div>
      </div>
      <div style={{ marginLeft: "auto", fontSize: 78, fontWeight: 900, letterSpacing: 2, color: "#fff", textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>{info.t}</div>
      <div style={{ position: "absolute", left: 38, right: 38, bottom: 16, height: 5, borderRadius: 3, background: "rgba(255,255,255,.14)", overflow: "hidden" }}>
        <div style={{ width: `${(n / 5) * 100}%`, height: "100%", background: "linear-gradient(90deg,#ffe9b0,#e0a53a)", boxShadow: "0 0 12px rgba(255,200,90,.9)" }} />
      </div>
    </div>
  );
};

const Chip: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ ...glass({ borderRadius: 28 }), position: "absolute", padding: "18px 28px", ...style }}>{children}</div>
);

const Overlay: React.FC<{ idx: number; k: number; t: number }> = ({ idx, k, t }) => {
  const pop = (s: number, dur = 0.4) => ease((k - s) / dur);
  switch (idx) {
    case 0:
      return (
        <>
          <Chip style={{ left: 50, top: 440, opacity: pop(0.2), transform: `translateY(${(1 - pop(0.2)) * -30}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <svg width="54" height="46" viewBox="0 0 54 46">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 14} y={34 - i * 10} width="9" height={10 + i * 10} rx="2" fill={i === 0 ? RED : "rgba(255,255,255,.25)"} />)}</svg>
              <div><div style={{ ...caps, color: "rgba(255,150,140,.9)" }}>Связь</div><div style={{ fontSize: 40, fontWeight: 900 }}>Нет сети</div></div>
            </div>
          </Chip>
          <Chip style={{ right: 50, top: 440, opacity: pop(0.6), transform: `translateY(${(1 - pop(0.6)) * -30}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" /><g transform={`rotate(${Math.sin(t * 3) * 120 + t * 160} 28 28)`}><path d="M28 6 L34 28 L22 28Z" fill={RED} /><path d="M28 50 L34 28 L22 28Z" fill="#fff" /></g></svg>
              <div><div style={caps}>Компас</div><div style={{ fontSize: 40, fontWeight: 900 }}>Не знаю</div></div>
            </div>
          </Chip>
        </>
      );
    case 1: {
      const slam = ease(k / 0.35);
      return (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: FONT, transform: `scale(${0.6 + 0.4 * slam}) rotate(${(1 - slam) * -6}deg)`, opacity: slam }}>
            <div style={{ fontSize: 300, fontWeight: 900, lineHeight: 0.9, ...goldText }}>5</div>
            <div style={{ fontSize: 76, fontWeight: 900, letterSpacing: 18, color: "#fff", textShadow: "0 8px 30px rgba(0,0,0,.7)", marginTop: -6 }}>ПРАВИЛ</div>
          </div>
          <div style={{ position: "absolute", left: 30, right: 30, top: 900, display: "flex", justifyContent: "center", gap: 14 }}>
            {TILE.map((x, i) => {
              const q = ease((k - 0.5 - i * 0.28) / 0.3);
              return (
                <div key={i} style={{ ...glass({ borderRadius: 30 }), width: 184, padding: "20px 0 18px", textAlign: "center", opacity: q, transform: `translateY(${(1 - q) * 60}px) scale(${0.85 + 0.15 * q})` }}>
                  <div style={{ width: 70, height: 70, borderRadius: 35, margin: "0 auto 10px", background: "radial-gradient(circle at 30% 25%, #fff4d0, #ffd98a 45%, #c98a1e)", display: "grid", placeItems: "center" }}><Icon name={x.i} size={38} /></div>
                  <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2 }}>{x.t}</div>
                </div>
              );
            })}
          </div>
        </>
      );
    }
    case 2: {
      const br = Math.sin(((k - 1.6) / 2.4) * Math.PI * 2);
      const on = k > 1.6 && k < 6.2;
      const rr = 56 + br * 22;
      return (
        <>
          <Chip style={{ left: 50, top: 450, opacity: k < 1.6 ? 0.5 + 0.5 * Math.abs(Math.sin(t * 16)) : 0.25, borderColor: "rgba(255,110,90,.6)" }}>
            <div style={{ ...caps, color: "rgba(255,150,140,.95)" }}>Паника</div>
            <div style={{ fontSize: 46, fontWeight: 900 }}>убивает</div>
          </Chip>
          <Chip style={{ right: 50, top: 440, width: 230, textAlign: "center", opacity: on ? 1 : 0.35 }}>
            <svg width="190" height="190" viewBox="-95 -95 190 190"><circle r={rr + 18} fill="rgba(124,212,255,.12)" /><circle r={rr} fill="none" stroke={BLUE} strokeWidth="6" style={{ filter: "drop-shadow(0 0 10px rgba(124,212,255,.8))" }} /><text y="10" textAnchor="middle" fontSize="28" fontWeight="900" fill="#fff" fontFamily={FONT}>{br > 0 ? "ВДОХ" : "ВЫДОХ"}</text></svg>
          </Chip>
          {k > 4.4 && (
            <Chip style={{ left: 120, right: 120, top: 760, textAlign: "center", opacity: pop(4.4), borderColor: "rgba(255,110,90,.6)" }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: RED }}>✕ Не броди кругами</div>
            </Chip>
          )}
        </>
      );
    }
    case 3: {
      const temp = interpolate(k, [0, 2.6], [36, 12], clamp);
      const hrs = Math.floor(interpolate(k, [0, 2.6], [0, 3], clamp));
      return (
        <>
          <Chip style={{ left: 50, top: 450, width: 300 }}>
            <div style={caps}>Температура тела</div>
            <div style={{ fontSize: 78, fontWeight: 900, color: temp > 24 ? "#fff" : BLUE, lineHeight: 1.1 }}>{Math.round(temp)}°</div>
            <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,.18)", marginTop: 10, overflow: "hidden" }}><div style={{ width: `${((temp - 8) / 30) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${BLUE}, #ffd98a)` }} /></div>
          </Chip>
          <Chip style={{ right: 50, top: 450, textAlign: "center" }}>
            <div style={caps}>Без огня</div>
            <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 1.1, ...goldText }}>{hrs} ЧАСА</div>
          </Chip>
          {k > 3.0 && <Chip style={{ left: 120, right: 120, top: 760, textAlign: "center", opacity: pop(3.0) }}><div style={{ fontSize: 44, fontWeight: 900 }}>Шалаш <span style={goldText}>+</span> огонь</div></Chip>}
        </>
      );
    }
    case 4:
      return (
        <>
          <Chip style={{ left: 50, top: 450, display: "flex", alignItems: "center", gap: 18, opacity: pop(0.1) }}>
            <div style={{ display: "flex", gap: 4 }}>{[0, 1, 2].map((i) => <svg key={i} width="38" height="52" viewBox="0 0 38 52"><path d="M6 6 L26 26 L6 46" fill="none" stroke="#ffd98a" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={0.25 + 0.75 * Math.max(0, Math.sin(t * 6 - i * 1.2))} /></svg>)}</div>
            <div><div style={caps}>Иди</div><div style={{ fontSize: 40, fontWeight: 900 }}>Вниз по течению</div></div>
          </Chip>
          {k > 5.0 && <Chip style={{ right: 50, top: 450, opacity: pop(5.0), textAlign: "center" }}><div style={caps}>Пей только</div><div style={{ fontSize: 56, fontWeight: 900, color: RED }}>КИПЯЧЁНУЮ</div></Chip>}
        </>
      );
    case 5:
      return (
        <Chip style={{ left: 120, right: 120, top: 450, textAlign: "center", opacity: pop(0.4) }}>
          <div style={caps}>Правило троек</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 36, marginTop: 6 }}>
            {["ОГНЯ", "СВИСТКА", "СИГНАЛА"].map((x, i) => (
              <div key={x} style={{ opacity: 0.4 + 0.6 * Math.max(0, Math.sin(t * 5 - i)), transform: `scale(${1 + 0.08 * Math.max(0, Math.sin(t * 5 - i))})` }}>
                <div style={{ fontSize: 110, fontWeight: 900, lineHeight: 1, ...goldText }}>3</div>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, color: "rgba(255,236,190,.8)" }}>{x}</div>
              </div>
            ))}
          </div>
        </Chip>
      );
    case 6: {
      const g = ease((k - 2.6) / 1.0);
      const r = ease((k - 4.6) / 0.35);
      return (
        <Chip style={{ left: 60, right: 60, top: 450, padding: "28px 34px", opacity: pop(0.2) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><div style={caps}>Без еды</div><div style={{ fontSize: 40, fontWeight: 900, color: GREEN }}>21 день</div></div>
          <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,.14)", margin: "10px 0 26px", overflow: "hidden" }}><div style={{ width: `${g * 100}%`, height: "100%", background: `linear-gradient(90deg, #2fbf7a, ${GREEN})`, boxShadow: `0 0 16px ${GREEN}` }} /></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: r }}><div style={{ ...caps, color: "rgba(255,150,140,.95)" }}>Одна ягода</div><div style={{ fontSize: 40, fontWeight: 900, color: RED }}>1 час</div></div>
          <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,.14)", margin: "10px 0 0", overflow: "hidden", opacity: r }}><div style={{ width: `${Math.max(0.5, 4.8 * r)}%`, height: "100%", background: `linear-gradient(90deg, #d93a2a, ${RED})`, boxShadow: `0 0 16px ${RED}` }} /></div>
        </Chip>
      );
    }
    default:
      return (
        <>
          <Chip style={{ left: 50, top: 410, width: 560, padding: "24px 30px" }}>
            {TILE.map((x, i) => {
              const q = ease((k - i * 0.35) / 0.3);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 0", opacity: q, transform: `translateX(${(1 - q) * -40}px)`, borderBottom: i < 4 ? "1px solid rgba(255,226,160,.16)" : "none" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 24, background: "radial-gradient(circle at 30% 25%, #fff4d0, #ffd98a 45%, #c98a1e)", display: "grid", placeItems: "center" }}><Icon name={x.i} size={26} /></div>
                  <div style={{ fontSize: 40, fontWeight: 900, flex: 1 }}>{x.t}</div>
                  <svg width="40" height="40" viewBox="0 0 40 40"><path d="M6 21 L16 31 L34 9" fill="none" stroke={GREEN} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${GREEN})` }} /></svg>
                </div>
              );
            })}
          </Chip>
          <div style={{ ...glass({ borderRadius: 999 }), position: "absolute", right: 50, top: 760, padding: "18px 34px", display: "flex", alignItems: "center", gap: 16, opacity: pop(1.6), transform: `scale(${1 + 0.05 * Math.sin(t * 6)})`, borderColor: "rgba(255,226,160,.7)" }}>
            <svg width="34" height="44" viewBox="0 0 34 44"><path d="M4 4 H30 V40 L17 30 L4 40Z" fill="url(#bk)" /><defs><linearGradient id="bk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3cf" /><stop offset="1" stopColor="#d9962b" /></linearGradient></defs></svg>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 3, ...goldText }}>СОХРАНИ</div>
          </div>
        </>
      );
  }
};

const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const line = lineAt(t);
  if (!line) return null;
  const words = line.text.split(" ");
  const prog = Math.min(1, Math.max(0, (t - line.start) / line.dur));
  const idx = Math.floor(prog * words.length * 1.04);
  const o = interpolate(t, [line.start, line.start + 0.1], [0, 1], clamp);
  const pop = interpolate(t, [line.start, line.start + 0.14], [1.08, 1], clamp);
  const KW = /остановись|паника|огня|холод|вода|ручей|кипячёную|сигнал|дым|свет|незнакомое|убить|один|жизнь/i;
  return (
    <div style={{ ...glass({ borderRadius: 40, background: "linear-gradient(180deg, rgba(8,14,12,.72), rgba(8,14,12,.55))" }), position: "absolute", left: 40, right: 40, top: 1100, padding: "26px 36px 28px", textAlign: "center", opacity: o, transform: `scale(${pop})` }}>
      <div style={{ position: "absolute", left: 36, right: 36, top: 0, height: 3, background: "linear-gradient(90deg, transparent, #ffd98a, transparent)", opacity: 0.8 }} />
      <div style={{ fontSize: 54, fontWeight: 900, lineHeight: 1.12, textShadow: "0 4px 18px rgba(0,0,0,.9)" }}>
        {words.map((w, i) => (
          <span key={i} style={KW.test(w) ? { color: RED } : { color: i === idx ? "#ffe29a" : i < idx ? "#fff" : "rgba(255,255,255,.45)" }}>{w}{" "}</span>
        ))}
      </div>
    </div>
  );
};

/* ---------- звук ---------- */
const Audios: React.FC = () => {
  const S = (s: number) => Math.max(0, Math.round(s * FPS));
  const F = (f: string) => staticFile(`forest5/${f}`);
  const sfx = (key: string, from: number, dur: number, f: string, vol: number, loop = false) => (
    <Sequence key={key} from={S(from)} durationInFrames={S(dur)}>
      <Audio src={F(f)} volume={vol} loop={loop} />
    </Sequence>
  );
  const items: React.ReactNode[] = [
    sfx("wind", 0, 50, "sfx-wind.mp3", 0.3, true),
    sfx("owl", 0.2, 3, "sfx-owl.mp3", 0.6),
    sfx("heart0", 0, 6, "sfx-heart.mp3", 0.7, true),
    sfx("riser1", startOf("h2") - 0.4, 3, "sfx-riser.mp3", 0.7),
    sfx("hit1", startOf("h2") + 0.1, 1.5, "sfx-hit.mp3", 0.9),
    sfx("steps2", startOf("r1") + 4.6, 2.5, "sfx-steps.mp3", 0.5),
    sfx("fire3", startOf("r2") + 3.4, 4, "sfx-fire.mp3", 0.7, true),
    sfx("stream4", startOf("r3"), 8, "sfx-stream.mp3", 0.6, true),
    sfx("fire4", startOf("r3") + 5.0, 3, "sfx-fire.mp3", 0.4, true),
    sfx("fire5", startOf("r4") + 0.4, 6, "sfx-fire.mp3", 0.5, true),
    sfx("whistle", startOf("r4") + 1.6, 1.5, "x-whistle.mp3", 1.0),
    sfx("heli", startOf("r4") + 3.2, 3.5, "x-heli.mp3", 0.8),
    sfx("growl6", startOf("r5") + 5.2, 2, "sfx-growl.mp3", 0.5),
    sfx("hit6", startOf("r5") + 5.2, 1.5, "sfx-hit.mp3", 0.8),
  ];
  LINES.slice(2, 7).forEach((l, i) => items.push(sfx(`wh${i}`, l.start - 0.3, 1.3, "sfx-whoosh.mp3", 0.55)));
  return (
    <>
      {items}
      {LINES.map((l) => (
        <Sequence key={l.id} from={S(l.start)} durationInFrames={Math.ceil((l.dur + 0.4) * FPS)}>
          <Audio src={F(l.file)} volume={1} />
        </Sequence>
      ))}
    </>
  );
};


export const Forest5: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { idx, sceneStart } = sceneAt(t);
  const k = t - sceneStart;
  const KICKS = [startOf("h2") + 0.1, startOf("r1"), startOf("r2"), startOf("r3"), startOf("r4"), startOf("r5"), startOf("r4") + 1.6, startOf("r5") + 5.2];
  const kick = Math.max(0, ...KICKS.map((q) => (t >= q && t < q + 0.4 ? 1 - (t - q) / 0.4 : 0)));
  const flash = k < 0.12 ? 1 - k / 0.12 : 0;
  const fadeIn = interpolate(t, [0, 0.3], [0, 1], clamp);
  const fadeOut = interpolate(t, [DURATION_SEC - 0.7, DURATION_SEC], [1, 0], clamp);
  const dusk = idx >= 5 ? 1 : idx >= 2 ? 0.5 : 0;
  const amp = kick * 14;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${dusk > 0.7 ? "#2b2040" : "#0d1b2a"} 0%, ${dusk > 0.7 ? "#6b3a4a" : "#1b3a3a"} 38%, #0a1410 70%)` }}>
      <div style={{ position: "absolute", inset: 0, opacity: Math.min(fadeIn, fadeOut), transform: `translate(${Math.sin(frame * 1.7) * amp}px, ${Math.cos(frame * 1.3) * amp}px) scale(${1 + kick * 0.04})` }}>
        <Pixi3DLayer build={FOREST_BUILD} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.6) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,20,16,.55) 0%, rgba(10,20,16,0) 22%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash * 0.2 }} />
      </div>
      <Header t={t} idx={idx} />
      <Tile idx={idx} k={k} />
      <Overlay idx={idx} k={k} t={t} />
      <Subtitle t={t} />
      <Audios />
    </AbsoluteFill>
  );
};
