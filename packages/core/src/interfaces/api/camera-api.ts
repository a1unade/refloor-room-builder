// Core
import * as THREE from 'three';

/**
 * Низкоуровневый API доступа к камере renderer.
 * Используется internal runtime-модулями редактора.
 *
 * @internal
 * @interface
 */
export interface ICameraApi {
  /**
   * Возвращает экземпляр камеры.
   *
   * @returns Камера Three.js - {@link THREE.Camera}
   *
   * @internal
   * @method
   */
  getCamera(): THREE.Camera;

  /**
   * Включает указанный слой для камеры.
   *
   * @param layer - номер слоя
   *
   * @see {@link disableCameraLayer} - выключение слоя
   *
   * @internal
   * @method
   */
  enableCameraLayer(layer: number): void;

  /**
   * Выключает указанный слой для камеры.
   *
   * @param layer - номер слоя
   *
   * @see {@link enableCameraLayer} - включение слоя
   *
   * @internal
   * @method
   */
  disableCameraLayer(layer: number): void;
}
