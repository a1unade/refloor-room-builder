// Core
import * as THREE from 'three';

/**
 * API для управления мешами (фигурами) на сцене.
 *
 * @internal
 * @interface
 */
export interface IMeshApi {
  /**
   * Добавляет один меш на сцену.
   *
   * @param mesh - меш для добавления
   *
   * @internal
   * @method
   */
  addMesh(mesh: THREE.Mesh): void;

  /**
   * Добавляет несколько мешей на сцену за один вызов.
   *
   * @param meshes - массив мешей для добавления
   *
   * @internal
   * @method
   */
  addMeshes(meshes: THREE.Mesh[]): void;

  /**
   * Удаляет один меш со сцены.
   *
   * @param mesh - меш для удаления
   *
   * @internal
   * @method
   */
  removeMesh(mesh: THREE.Mesh): void;

  /**
   * Удаляет несколько мешей со сцены за один вызов.
   *
   * @param meshes - массив мешей для удаления
   *
   * @internal
   * @method
   */
  removeMeshes(meshes: THREE.Mesh[]): void;

  /**
   * Возвращает список всех мешей, находящихся на сцене.
   *
   * @returns массив мешей
   *
   * @internal
   * @method
   */
  getMeshes(): THREE.Mesh[];
}
