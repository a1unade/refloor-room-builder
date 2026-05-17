// Core
import * as THREE from 'three';
// IOC
import { inject, injectable } from 'tsyringe';
// Interfaces
import type { IRuntimeModule } from '@/interfaces/module';
import type { ISceneApi, IMeshApi } from '@/interfaces/api';

/**
 * Модуль управления сценой, используется для добавления/удаления фигур,
 * настройки необходимых хелперов на сцене (сетка, оси, свет)
 *
 * @internal
 * @class
 */
@injectable()
export class SceneModule implements IRuntimeModule, IMeshApi {
  /** Объекты, добавленные в сцену через модуль */
  private _objects: THREE.Object3D[] = [];

  /** Базовый свет сцены */
  private _light: THREE.HemisphereLight | null = null;

  public constructor(@inject('ISceneApi') private _api: ISceneApi) {}

  public init(): void {
    // Свет
    this._light = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    this._api.addToScene(this._light);
  }

  public getObjects(): THREE.Object3D[] {
    return this._objects;
  }

  public addObject(object: THREE.Object3D): void {
    // Пропуск дубликатов
    if (this._objects.includes(object)) return;

    this._objects.push(object);
    this._api.addToScene(object);
  }

  public removeObject(object: THREE.Object3D): void {
    const index = this._objects.indexOf(object);

    if (index >= 0) {
      this._objects.splice(index, 1);
    }

    this._api.removeFromScene(object);
  }

  public addObjects(objects: THREE.Object3D[]): void {
    for (const object of objects) {
      this.addObject(object);
    }
  }

  public removeObjects(objects: THREE.Object3D[]): void {
    for (const object of objects) {
      this.removeObject(object);
    }
  }

  /** Освобождает ресурсы модуля */
  public dispose(): void {
    // Объекты сцены
    for (const object of this._objects) {
      this._api.removeFromScene(object);
    }

    this._objects.length = 0;

    // Свет
    if (this._light) {
      this._api.removeFromScene(this._light);
      this._light = null;
    }
  }
}
