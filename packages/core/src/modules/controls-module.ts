// IOC
import { inject, injectable } from 'tsyringe';
// Interfaces
import type { IDomApi, ICameraApi } from '@/interfaces/api';
import type { IUpdatableModule } from '@/interfaces/module';
// Extensions
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Модуль управления камерой.
 *
 * @internal
 * @class
 */
@injectable()
export class ControlsModule implements IUpdatableModule {
  /** Orbit-контроллер для управления камерой */
  private _orbit: OrbitControls | null = null;

  public constructor(
    @inject('ICameraApi') private _cameraApi: ICameraApi,
    @inject('IDomApi') private _domApi: IDomApi,
  ) {}

  public init(): void {
    this._orbit = new OrbitControls(this._cameraApi.getCamera(), this._domApi.getDomElement());
    this._orbit.enableDamping = true;
    this._orbit.dampingFactor = 0.05;
  }

  public update(): void {
    this._orbit?.update();
  }

  /** Освобождает ресурсы модуля */
  public dispose(): Promise<void> | void {
    // Очистка хелперов
    this._orbit?.dispose();
    this._orbit = null;
  }
}
