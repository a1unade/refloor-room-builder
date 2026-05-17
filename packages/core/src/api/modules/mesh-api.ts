// Core
import * as THREE from 'three';
// IOC
import { inject, injectable } from 'tsyringe';
// Interfaces
import type { IMeshApi } from '@/interfaces/api';

/**
 * API для управления мешами (фигурами) на сцене.
 *
 * @see {@link IMeshApi} - интерфейс, который реализует этот класс
 * @see {@link SceneModule} - реальная реализация операций с мешами
 *
 * @internal
 * @class
 */
@injectable()
export class MeshApi implements IMeshApi {
  /** @constructor */
  public constructor(@inject('SceneModule') private readonly _sceneModule: IMeshApi) {}

  public addObject(object: THREE.Object3D): void {
    this._sceneModule.addObject(object);
  }

  public addObjects(meshes: THREE.Object3D[]): void {
    this._sceneModule.addObjects(meshes);
  }

  public removeObject(mesh: THREE.Object3D): void {
    this._sceneModule.removeObject(mesh);
  }

  public removeObjects(meshes: THREE.Object3D[]): void {
    this._sceneModule.removeObjects(meshes);
  }

  public getObjects(): THREE.Object3D[] {
    return this._sceneModule.getObjects();
  }
}
