// Core
import * as THREE from 'three';
// IOC
import { inject, injectable } from 'tsyringe';
// Interfaces
import type { ICameraApi } from '@/interfaces/api';
import type { IRendererCameraAccess } from '@/interfaces/api/renderer';

/**
 * Реализация API для управления камерой.
 *
 * @internal
 * @class
 */
@injectable()
export class CameraApi implements ICameraApi {
  public constructor(
    @inject('IRendererCameraAccess') private _cameraAccessApi: IRendererCameraAccess,
  ) {}

  public getCamera(): THREE.Camera {
    return this._cameraAccessApi.getCamera();
  }

  public enableCameraLayer(layer: number): void {
    this._cameraAccessApi.getCamera().layers.enable(layer);
  }

  public disableCameraLayer(layer: number): void {
    this._cameraAccessApi.getCamera().layers.disable(layer);
  }
}
