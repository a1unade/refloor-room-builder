// Core
import * as THREE from 'three';

/**
 * Низкоуровневый доступ к сцене рендерера.
 *
 * @public
 * @interface
 */
export interface IRendererSceneAccess {
  /**
   * Возвращает сцену рендерера.
   *
   * @returns THREE.Scene - сцена Three.js
   *
   * @public
   * @method
   */
  getScene(): THREE.Scene;
}
