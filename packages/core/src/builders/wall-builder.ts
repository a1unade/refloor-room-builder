// Core
import * as THREE from 'three';
// IOC
import { injectable, inject } from 'tsyringe';
// Interfaces
import type { IBuilder } from '@/interfaces/builder';
import type { IMeshApi } from '@/interfaces/api';
// Types
import type { RoomParams } from '@/types/room';
// Constants
import { defaultRoomParams, groupNames, sceneObjectNames } from '@/shared/constants';

/**
 * Билдер для добавления стен комнаты на сцену.
 *
 * @remarks
 * Отвечает за создание и покраску стен комнаты на сцене.
 *
 * @public
 * @class
 */
@injectable()
export class WallBuilder implements IBuilder {
  /**
   * Группа, содержащая все стены комнаты
   *
   * @private
   * @member
   */
  private readonly group = new THREE.Group();

  /**
   * Материал стен
   *
   * @private
   * @member
   */
  private material: THREE.MeshStandardMaterial | null = null;

  /**
   * Геометрии, созданные билдером
   *
   * @private
   * @member
   */
  private readonly geometries = new Set<THREE.BufferGeometry>();

  public constructor(@inject('IMeshApi') private _api: IMeshApi) {
    this.group.name = groupNames.WALLS;
  }

  public build(params: RoomParams): void {
    // Размеры комнаты
    const length = params.length;
    const width = params.width;
    const height = params.height ?? defaultRoomParams.height;

    this.paint(params);

    // Задняя стена
    const backWall = this.createWall({
      name: sceneObjectNames.BACK_WALL,
      width,
      height,
      position: new THREE.Vector3(0, height / 2, -length / 2),
      rotation: new THREE.Euler(0, 0, 0),
    });

    // Передняя стена
    const frontWall = this.createWall({
      name: sceneObjectNames.FRONT_WALL,
      width,
      height,
      position: new THREE.Vector3(0, height / 2, length / 2),
      rotation: new THREE.Euler(0, Math.PI, 0),
    });

    // Левая стена
    const leftWall = this.createWall({
      name: sceneObjectNames.LEFT_WALL,
      width: length,
      height,
      position: new THREE.Vector3(-width / 2, height / 2, 0),
      rotation: new THREE.Euler(0, Math.PI / 2, 0),
    });

    // Правая стена
    const rightWall = this.createWall({
      name: sceneObjectNames.RIGHT_WALL,
      width: length,
      height,
      position: new THREE.Vector3(width / 2, height / 2, 0),
      rotation: new THREE.Euler(0, -Math.PI / 2, 0),
    });

    this.group.add(backWall, frontWall, leftWall, rightWall);
    this._api.addObject(this.group);
  }

  public paint(params: RoomParams): void {
    const color = params.wallColor ?? defaultRoomParams.wallColor;

    this.material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.85,
      metalness: 0,
      side: THREE.FrontSide,
    });
  }

  public estimate(): number {
    return 0;
  }

  public clear(): void {
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

  /**
   * Получение материала для стен
   *
   * @private
   * @method
   */
  private getMaterial(): THREE.MeshStandardMaterial {
    if (!this.material) {
      throw new Error('Wall material is not initialized');
    }

    return this.material;
  }

  /**
   * Создаёт mesh одной стены на основе размеров, позиции и поворота.
   *
   * @param options - Параметры создаваемой стены.
   * @param options.name - Имя объекта сцены.
   * @param options.width - Ширина стены в метрах.
   * @param options.height - Высота стены в метрах.
   * @param options.position - Позиция центра стены в сцене.
   * @param options.rotation - Поворот стены в сцене.
   *
   * @returns Mesh-объект стены.
   */
  private createWall(options: {
    name: string;
    width: number;
    height: number;
    position: THREE.Vector3;
    rotation: THREE.Euler;
  }): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(options.width, options.height);
    this.geometries.add(geometry);

    const mesh: THREE.Mesh = new THREE.Mesh(geometry, this.getMaterial());

    mesh.name = options.name;
    mesh.position.copy(options.position);
    mesh.rotation.copy(options.rotation);
    mesh.receiveShadow = true;

    return mesh;
  }
}
