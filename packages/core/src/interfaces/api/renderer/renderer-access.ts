// Core
import * as THREE from 'three';

/**
 * Низкоуровневый доступ к WebGLRenderer.
 *
 * @public
 * @interface
 */
export interface IRendererAccess {
  /**
   * Возвращает WebGLRenderer.
   *
   * @returns THREE.WebGLRenderer - рендерер Three.js
   *
   * @public
   * @method
   */
  getRenderer(): THREE.WebGLRenderer;
}
