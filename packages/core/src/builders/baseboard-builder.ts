// Core
import * as THREE from 'three';
// IOC
import { inject, injectable } from 'tsyringe';
// Interfaces
import type { IBuilder } from '@/interfaces/builder';
import type { IMeshApi } from '@/interfaces/api';
// Types
import type { RoomParams } from '@/types/room';

type BaseboardProfilePoint = {
  depth: number;
  y: number;
};

@injectable()
export class BaseboardBuilder implements IBuilder {
  private readonly group = new THREE.Group();

  private material: THREE.MeshStandardMaterial | null = null;

  private readonly geometries = new Set<THREE.BufferGeometry>();

  public constructor(@inject('IMeshApi') private readonly api: IMeshApi) {
    this.group.name = 'BaseboardBuilder';
  }

  public build(params: RoomParams): void {
    this.clear();

    this.paint(params);

    const width = params.width;
    const length = params.length;

    const height = params.baseboardHeight ?? 0.08;

    /**
     * Высота готового пола:
     * 0.025 — толщина доски
     * 0.002 — небольшой offset над базовой плоскостью.
     */
    const floorTop = 0.027;

    /**
     * Тепловой зазор пола у стен.
     *
     * Плинтус должен быть глубже этого зазора,
     * чтобы закрывать край покрытия.
     */
    const floorWallGap = params.floorWallGap ?? 0.02;

    /**
     * Насколько плинтус дополнительно заходит на пол
     * после перекрытия теплового зазора.
     */
    const coverOverlap = params.baseboardCoverOverlap ?? 0.012;

    /**
     * Небольшой заход вниз, чтобы не было видимой щели
     * между плинтусом и покрытием пола.
     */
    const verticalOverlap = params.baseboardVerticalOverlap ?? 0.003;

    const thickness = params.baseboardThickness ?? floorWallGap + coverOverlap;
    const baseY = floorTop - verticalOverlap;

    /**
     * Чуть сдвигаем плинтус внутрь комнаты,
     * чтобы избежать z-fighting со стеной.
     */
    const wallInset = params.baseboardWallInset ?? 0.002;

    const backBaseboard = this.createBaseboard({
      name: 'BackBaseboard',
      length: width,
      height,
      thickness,
      position: new THREE.Vector3(0, baseY, -length / 2 + wallInset),
      rotation: new THREE.Euler(0, 0, 0),
    });

    const frontBaseboard = this.createBaseboard({
      name: 'FrontBaseboard',
      length: width,
      height,
      thickness,
      position: new THREE.Vector3(0, baseY, length / 2 - wallInset),
      rotation: new THREE.Euler(0, Math.PI, 0),
    });

    const leftBaseboard = this.createBaseboard({
      name: 'LeftBaseboard',
      length,
      height,
      thickness,
      position: new THREE.Vector3(-width / 2 + wallInset, baseY, 0),
      rotation: new THREE.Euler(0, Math.PI / 2, 0),
    });

    const rightBaseboard = this.createBaseboard({
      name: 'RightBaseboard',
      length,
      height,
      thickness,
      position: new THREE.Vector3(width / 2 - wallInset, baseY, 0),
      rotation: new THREE.Euler(0, -Math.PI / 2, 0),
    });

    const meshes = [backBaseboard, frontBaseboard, leftBaseboard, rightBaseboard];

    for (const mesh of meshes) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = true;

      this.group.add(mesh);
    }

    this.api.addObject(this.group);
  }

  public estimate(params: RoomParams): number {
    return (params.width + params.length) * 2;
  }

  public clear(): void {
    this.api.removeObject(this.group);

    this.group.clear();

    for (const geometry of this.geometries) {
      geometry.dispose();
    }

    this.geometries.clear();

    this.material?.dispose();
    this.material = null;
  }

  public dispose(): void {
    this.clear();
  }

  public paint(params: RoomParams): void {
    this.material?.dispose();

    this.material = new THREE.MeshStandardMaterial({
      color: params.baseboardColor ?? '#ffffff',
      roughness: 0.72,
      metalness: 0,
      side: THREE.DoubleSide,
    });
  }

  private createBaseboard(options: {
    name: string;
    length: number;
    height: number;
    thickness: number;
    position: THREE.Vector3;
    rotation: THREE.Euler;
  }): THREE.Mesh {
    const geometry = this.createProfiledBaseboardGeometry(
      options.length,
      options.height,
      options.thickness,
    );

    this.geometries.add(geometry);

    const mesh = new THREE.Mesh(geometry, this.getMaterial());

    mesh.name = options.name;
    mesh.position.copy(options.position);
    mesh.rotation.copy(options.rotation);

    return mesh;
  }

  private createProfiledBaseboardGeometry(
    length: number,
    height: number,
    thickness: number,
  ): THREE.BufferGeometry {
    /**
     * Локальная система:
     * X — длина плинтуса
     * Y — высота
     * Z — глубина внутрь комнаты
     *
     * depth = 0 находится ближе к стене.
     * depth = thickness находится ближе к комнате.
     *
     * Нижняя часть профиля сделана самой глубокой,
     * чтобы плинтус закрывал тепловой зазор пола.
     */
    const profile: BaseboardProfilePoint[] = [
      // задний нижний угол у стены
      { depth: 0, y: 0 },

      // передний нижний угол, перекрывает тепловой зазор
      { depth: thickness, y: 0 },

      // нижняя массивная часть
      { depth: thickness, y: height * 0.45 },

      // декоративный скос
      { depth: thickness * 0.78, y: height * 0.72 },

      // верхняя тонкая часть
      { depth: thickness * 0.45, y: height },

      // задний верхний угол у стены
      { depth: 0, y: height },
    ];

    const vertices: number[] = [];
    const indices: number[] = [];

    /**
     * 45-градусный запил:
     * чем дальше точка профиля от стены, тем сильнее она сдвигается
     * от края по длине. Так торец получается скошенным, а углы —
     * аккуратно состыкованными.
     */
    for (const point of profile) {
      const startX = -length / 2 + point.depth;
      const endX = length / 2 - point.depth;

      vertices.push(startX, point.y, point.depth);
      vertices.push(endX, point.y, point.depth);
    }

    /**
     * Боковые поверхности вдоль профиля.
     */
    for (let i = 0; i < profile.length; i++) {
      const nextIndex = (i + 1) % profile.length;

      const startA = i * 2;
      const endA = i * 2 + 1;

      const startB = nextIndex * 2;
      const endB = nextIndex * 2 + 1;

      indices.push(startA, endA, endB);
      indices.push(startA, endB, startB);
    }

    /**
     * Стартовый скошенный торец.
     */
    for (let i = 1; i < profile.length - 1; i++) {
      indices.push(0, i * 2, (i + 1) * 2);
    }

    /**
     * Конечный скошенный торец.
     */
    for (let i = 1; i < profile.length - 1; i++) {
      indices.push(1, (i + 1) * 2 + 1, i * 2 + 1);
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }

  private getMaterial(): THREE.MeshStandardMaterial {
    if (!this.material) {
      throw new Error('Baseboard material is not initialized.');
    }

    return this.material;
  }
}
