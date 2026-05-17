// Core
import type { Renderer } from '@/core';
// IOC
import { type Disposable, inject, injectable } from 'tsyringe';
// Interfaces
import type { IWorker } from '@/interfaces/worker';
import type { RoomParams } from '@/types/room';
import type { IBuilder } from '@/interfaces/builder';

/**
 * Хаб для управления приложением
 * @public
 */
@injectable()
export class AppHub implements Disposable {
  public constructor(
    @inject('Renderer') private _renderer: Renderer,
    @inject('IWorker') private _worker: IWorker,
    @inject('WallBuilder') private _wallBuilder: IBuilder,
    @inject('FloorBuilder') private _floorBuilder: IBuilder,
    @inject('BaseboardBuilder') private _baseboardBuilder: IBuilder,
  ) {}

  public resizeRenderer() {
    this._renderer.resize();
  }

  public buildWalls(params: RoomParams) {
    this._wallBuilder.build(params);
    this._floorBuilder.build(params);
    this._baseboardBuilder.build(params);
    const res = this._floorBuilder.estimate(params);
    console.log(res);
  }

  /**
   * Запускает редактор.
   * Вызывается после создания хаба.
   */
  public start(): void {
    this._worker.start();
  }

  /**
   * Останавливает редактор.
   */
  public stop(): void {
    this._worker.stop();
  }

  public dispose(): Promise<void> | void {
    this._worker.dispose();
    this._renderer.dispose();
  }
}
