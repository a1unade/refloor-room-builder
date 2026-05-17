// Core
import * as THREE from 'three';

/**
 * API для управления фигурами и объектами на сцене.
 *
 * @internal
 * @interface
 */
export interface IMeshApi {
  /**
   * Добавляет произвольный объект в сцену.
   *
   * @param object - Three.js объект для добавления.
   */
  addObject(object: THREE.Object3D): void;

  /**
   * Удаляет произвольный объект из сцены.
   *
   * @param object - Three.js объект для удаления.
   *
   * @internal
   * @method
   */
  removeObject(object: THREE.Object3D): void;

  /**
   * Добавляет несколько объектов в сцену.
   *
   * @param objects - Список Three.js объектов.
   *
   * @internal
   * @method
   */
  addObjects(objects: THREE.Object3D[]): void;

  /**
   * Удаляет несколько объектов из сцены.
   *
   * @param objects - Список Three.js объектов.
   *
   * @internal
   * @method
   */
  removeObjects(objects: THREE.Object3D[]): void;

  /**
   * Возвращает все объекты, добавленные через данный API.
   *
   * @returns Список объектов сцены.
   *
   * @internal
   * @method
   */
  getObjects(): THREE.Object3D[];
}
