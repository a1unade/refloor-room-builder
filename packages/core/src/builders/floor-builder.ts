// Core
import * as THREE from 'three';
// IOC
import { inject, injectable } from 'tsyringe';
// Interfaces
import type { IBuilder } from '@/interfaces/builder';
import type { IMeshApi } from '@/interfaces/api';
// Types
import { FloorLayout, type PlankInstance, type RoomParams } from '@/types/room';
// Constants
import { defaultRoomParams, groupNames, sceneObjectNames } from '@/shared/constants';

/**
 * Билдер для создания пола.
 *
 * @remarks
 * Отвечает за добавление пола на сцену, покраску швов и досок, подсчет количества досок.
 *
 * @public
 * @class
 */
@injectable()
export class FloorBuilder implements IBuilder {
  /**
   * Группа, содержащая весь пол комнаты
   *
   * @private
   * @member
   */
  private readonly group = new THREE.Group();

  /**
   * Материал подложки (цвет зазоров)
   *
   * @private
   * @member
   */
  private floorMaterial: THREE.MeshStandardMaterial | null = null;

  /**
   * Материал доски
   *
   * @private
   * @member
   */
  private plankMaterial: THREE.MeshStandardMaterial | null = null;

  /**
   * Геометрии, созданные билдером
   *
   * @private
   * @member
   */
  private readonly geometries = new Set<THREE.BufferGeometry>();

  public constructor(@inject('IMeshApi') private _api: IMeshApi) {
    this.group.name = groupNames.FLOOR;
  }

  public build(params: RoomParams): void {
    this.clear();

    this.paint(params);
    this.createFloorBase(params);
    this.createPlanks(params);

    this._api.addObject(this.group);
  }

  public estimate(params: RoomParams): number {
    // Параметры комнаты
    const length = params.length;
    const width = params.width;

    // Параметры доски
    const plankLength = params.plankLength ?? defaultRoomParams.plankLength;
    const plankWidth = params.plankWidth ?? defaultRoomParams.plankWidth;

    const floorArea = length * width;
    const plankArea = plankLength * plankWidth;

    const baseCount = Math.ceil(floorArea / plankArea);
    const wasteFactor = params.floorLayout === FloorLayout.Herringbone ? 1.15 : 1.1;

    return Math.ceil(baseCount * wasteFactor);
  }

  public clear(): void {
    this._api.removeObject(this.group);

    this.group.clear();

    for (const geometry of this.geometries) {
      geometry.dispose();
    }

    this.geometries.clear();

    this.floorMaterial?.dispose();
    this.floorMaterial = null;

    this.plankMaterial?.dispose();
    this.plankMaterial = null;
  }

  public dispose(): void {
    this.clear();
  }

  public paint(params: RoomParams): void {
    this.floorMaterial = new THREE.MeshStandardMaterial({
      color: params.floorColor ?? defaultRoomParams.floorColor,
      roughness: 0.9,
      metalness: 0,
      side: THREE.DoubleSide,
    });

    this.plankMaterial = new THREE.MeshStandardMaterial({
      color: params.plankColor ?? defaultRoomParams.plankColor,
      roughness: 0.75,
      metalness: 0,
      clippingPlanes: this.createRoomClippingPlanes(params),
      clipShadows: true,
    });
  }

  /**
   * Создаёт плоскости отсечения для ограничения пола границами комнаты.
   *
   * @private
   * @method
   */
  private createRoomClippingPlanes(params: RoomParams): THREE.Plane[] {
    const wallGap = params.floorWallGap ?? defaultRoomParams.floorWallGap;

    const minX = -params.width / 2 + wallGap;
    const maxX = params.width / 2 - wallGap;

    const minZ = -params.length / 2 + wallGap;
    const maxZ = params.length / 2 - wallGap;

    return [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), -minX),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), maxX),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), -minZ),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), maxZ),
    ];
  }

  /**
   * Создание подложки для пола
   *
   * @private
   * @method
   */
  private createFloorBase(params: RoomParams): void {
    const geometry = new THREE.PlaneGeometry(params.width, params.length);
    this.geometries.add(geometry);

    const mesh = new THREE.Mesh(geometry, this.getFloorMaterial());

    mesh.name = sceneObjectNames.FLOOR_BASE;
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, 0, 0);
    mesh.receiveShadow = true;

    this.group.add(mesh);
  }

  /**
   * Создание досок для пола
   *
   * @private
   * @method
   */
  private createPlanks(params: RoomParams): void {
    const plankLength = params.plankLength ?? defaultRoomParams.plankLength;
    const plankWidth = params.plankWidth ?? defaultRoomParams.plankWidth;
    const plankGap = params.plankGap ?? defaultRoomParams.plankGap;
    const plankThickness = defaultRoomParams.plankThickness;

    const layout = params.floorLayout ?? FloorLayout.Straight;

    const planks =
      layout === FloorLayout.Herringbone
        ? this.generateHerringbonePlanks(params, plankLength, plankWidth, plankGap)
        : this.generateStraightPlanks(params, plankLength, plankWidth, plankGap);

    const geometry = new THREE.BoxGeometry(plankLength, plankThickness, plankWidth);
    this.geometries.add(geometry);

    const mesh = new THREE.InstancedMesh(geometry, this.getPlankMaterial(), planks.length);

    mesh.name = sceneObjectNames.FLOOR_PLANKS;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const dummy = new THREE.Object3D();

    let index = 0;

    for (const plank of planks) {
      dummy.position.set(plank.x, plankThickness / 2 + defaultRoomParams.baseOffset, plank.z);
      dummy.rotation.set(0, plank.rotation, 0);
      dummy.scale.set(plank.scaleX, 1, plank.scaleZ);
      dummy.updateMatrix();

      mesh.setMatrixAt(index, dummy.matrix);
      index++;
    }

    mesh.instanceMatrix.needsUpdate = true;

    this.group.add(mesh);
  }

  /**
   * Генерация прямой раскладки
   *
   * @private
   * @method
   */
  private generateStraightPlanks(
    params: RoomParams,
    plankLength: number,
    plankWidth: number,
    gap: number,
  ): PlankInstance[] {
    const planks: PlankInstance[] = [];
    const bounds = this.getFloorBounds(params);

    const roomMinX = bounds.minX;
    const roomMaxX = bounds.maxX;

    const roomMinZ = bounds.minZ;
    const roomMaxZ = bounds.maxZ;

    const rowStep = plankWidth + gap;
    const columnStep = plankLength + gap;

    let rowIndex = 0;
    let rowStartZ = roomMinZ;

    while (rowStartZ < roomMaxZ) {
      const rowEndZ = Math.min(rowStartZ + plankWidth, roomMaxZ);
      const actualPlankWidth = rowEndZ - rowStartZ;

      if (actualPlankWidth <= 0) break;

      const rowCenterZ = rowStartZ + actualPlankWidth / 2;

      const offset = rowIndex % 2 === 0 ? 0 : -columnStep / 2;
      let plankStartX = roomMinX + offset;

      while (plankStartX < roomMaxX) {
        const plankEndX = plankStartX + plankLength;

        const clippedStartX = Math.max(plankStartX, roomMinX);
        const clippedEndX = Math.min(plankEndX, roomMaxX);

        const actualPlankLength = clippedEndX - clippedStartX;

        if (actualPlankLength > 0.02) {
          planks.push({
            x: clippedStartX + actualPlankLength / 2,
            z: rowCenterZ,
            rotation: 0,
            scaleX: actualPlankLength / plankLength,
            scaleZ: actualPlankWidth / plankWidth,
          });
        }

        plankStartX += columnStep;
      }

      rowStartZ += rowStep;
      rowIndex++;
    }

    return planks;
  }

  /**
   * Генерация раскладки ёлочкой
   *
   * @private
   * @method
   */
  private generateHerringbonePlanks(
    params: RoomParams,
    plankLength: number,
    plankWidth: number,
    gap: number,
  ): PlankInstance[] {
    const planks: PlankInstance[] = [];

    const scaleX = Math.max(0.01, (plankLength - gap) / plankLength);
    const scaleZ = Math.max(0.01, (plankWidth - gap) / plankWidth);

    const rowStep = plankWidth * Math.SQRT2;

    const margin = plankLength * 4;

    const minX = -params.width / 2 - margin;
    const maxX = params.width / 2 + margin;

    const minZ = -params.length / 2 - margin;
    const maxZ = params.length / 2 + margin;

    for (let rowZ = minZ; rowZ <= maxZ; rowZ += rowStep) {
      let currentX = minX;
      let currentZ = rowZ;

      let plankIndex = 0;

      while (currentX <= maxX) {
        const rotation = plankIndex % 2 === 0 ? Math.PI / 4 : -Math.PI / 4;

        const directionX = Math.cos(rotation);
        const directionZ = Math.sin(rotation);

        const normalX = -Math.sin(rotation);
        const normalZ = Math.cos(rotation);

        const jointInset = plankWidth / 2;

        const inwardSign = rotation > 0 ? -1 : 1;

        const plank: PlankInstance = {
          x: currentX + directionX * (plankLength / 2) + normalX * jointInset * inwardSign,

          z: currentZ + directionZ * (plankLength / 2) + normalZ * jointInset * inwardSign,

          rotation,
          scaleX,
          scaleZ,
        };

        if (this.plankIntersectsRoom(plank, params, plankLength, plankWidth, margin)) {
          planks.push(plank);
        }

        currentX += directionX * plankLength;
        currentZ += directionZ * plankLength;

        if (plankIndex % 2 === 1) {
          currentZ = rowZ;
        }

        plankIndex++;
      }
    }

    return planks;
  }

  /**
   * Проверка пересечения пола со стеной
   *
   * @private
   * @method
   */
  private plankIntersectsRoom(
    plank: PlankInstance,
    params: RoomParams,
    plankLength: number,
    plankWidth: number,
    margin: number,
  ): boolean {
    const halfLength = (plankLength * plank.scaleX) / 2;
    const halfWidth = (plankWidth * plank.scaleZ) / 2;

    const cos = Math.cos(plank.rotation);
    const sin = Math.sin(plank.rotation);

    const localCorners = [
      { x: -halfLength, z: -halfWidth },
      { x: halfLength, z: -halfWidth },
      { x: halfLength, z: halfWidth },
      { x: -halfLength, z: halfWidth },
    ];

    const corners = localCorners.map((corner) => ({
      x: plank.x + corner.x * cos - corner.z * sin,
      z: plank.z + corner.x * sin + corner.z * cos,
    }));

    const minPlankX = Math.min(...corners.map((corner) => corner.x));
    const maxPlankX = Math.max(...corners.map((corner) => corner.x));
    const minPlankZ = Math.min(...corners.map((corner) => corner.z));
    const maxPlankZ = Math.max(...corners.map((corner) => corner.z));

    const minRoomX = -params.width / 2 - margin;
    const maxRoomX = params.width / 2 + margin;

    const minRoomZ = -params.length / 2 - margin;
    const maxRoomZ = params.length / 2 + margin;

    const separated =
      maxPlankX < minRoomX || minPlankX > maxRoomX || maxPlankZ < minRoomZ || minPlankZ > maxRoomZ;

    return !separated;
  }

  /**
   * Получение материала подложки
   *
   * @private
   * @method
   */
  private getFloorMaterial(): THREE.MeshStandardMaterial {
    if (!this.floorMaterial) {
      throw new Error('Floor material is not initialized.');
    }

    return this.floorMaterial;
  }

  /**
   * Получение материала для досок
   *
   * @private
   * @method
   */
  private getPlankMaterial(): THREE.MeshStandardMaterial {
    if (!this.plankMaterial) {
      throw new Error('Plank material is not initialized.');
    }

    return this.plankMaterial;
  }

  /**
   * Возвращает рабочие границы пола с учётом теплового зазора у стен.
   *
   * @private
   * @method
   */
  private getFloorBounds(params: RoomParams): {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
    width: number;
    length: number;
  } {
    const wallGap = params.floorWallGap ?? 0.02;

    const minX = -params.width / 2 + wallGap;
    const maxX = params.width / 2 - wallGap;

    const minZ = -params.length / 2 + wallGap;
    const maxZ = params.length / 2 - wallGap;

    return {
      minX,
      maxX,
      minZ,
      maxZ,
      width: Math.max(0, maxX - minX),
      length: Math.max(0, maxZ - minZ),
    };
  }
}
