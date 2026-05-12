// Core
import * as THREE from 'three';

/**
 * Предоставляет низкоуровневый доступ к камере рендерера.
 *
 * @see {@link Renderer} - класс, который реализует этот интерфейс
 *
 * @public
 * @interface
 */
export interface IRendererCameraAccess {
  /**
   * Возвращает камеру рендерера.
   *
   * @returns Камера Three.js.
   *
   * @public
   * @method
   */
  getCamera(): THREE.Camera;
}
