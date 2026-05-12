// Core
import * as THREE from 'three';
// IOC
import { inject, injectable } from 'tsyringe';
// Interfaces
import type { ISceneApi } from '@/interfaces/api';
import type { IRendererSceneAccess } from '@/interfaces/api/renderer';

/**
 * Реализация API для управления сценой.
 *
 * @internal
 * @class
 */
@injectable()
export class SceneApi implements ISceneApi {
  public constructor(
    @inject('IRendererSceneAccess') private _sceneAccessApi: IRendererSceneAccess,
  ) {}

  public getScene(): THREE.Scene {
    return this._sceneAccessApi.getScene();
  }

  public addToScene(object: THREE.Object3D): void {
    this._sceneAccessApi.getScene().add(object);
  }

  public removeFromScene(object: THREE.Object3D): void {
    this._sceneAccessApi.getScene().remove(object);
  }

  public addObject(object: THREE.Object3D, layer?: number) {
    // Получение сцены рендерера
    const scene: THREE.Scene = this._sceneAccessApi.getScene();

    if (!scene) return;

    if (typeof layer === 'number') {
      object.layers.set(layer);
    }
    scene.add(object);
  }
}
