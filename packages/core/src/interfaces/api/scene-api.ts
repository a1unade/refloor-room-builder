// Core
import * as THREE from 'three';

/**
 * Высокоуровневое API для управления сценой.
 *
 * @internal
 * @interface
 */
export interface ISceneApi {
  /**
   * Возвращает сцену рендерера.
   *
   * @internal
   * @method
   */
  getScene(): THREE.Scene;

  /**
   * Добавляет объект на сцену.
   *
   * @param object - объект Three.js для добавления (Mesh, Light, Group и т.д.)
   *
   * @internal
   * @method
   */
  addToScene(object: THREE.Object3D): void;

  /**
   * Удаляет объект со сцены.
   *
   * @param object - объект Three.js для удаления
   *
   * @internal
   * @method
   */
  removeFromScene(object: THREE.Object3D): void;

  /**
   * Добавляет объект в сцену и (опционально) выставляет ему слой.
   *
   * @param object - Объект, который нужно добавить в сцену.
   * @param layer - (Опц.) Номер слоя, который следует установить объекту перед добавлением.
   *
   * @internal
   * @method
   */
  addObject(object: THREE.Object3D, layer?: number): void;
}
