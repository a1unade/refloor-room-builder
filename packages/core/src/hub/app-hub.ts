// Core
import type { Renderer } from '@/core';
// IOC
import { type Disposable, inject, injectable } from 'tsyringe';
// Interfaces
import type { IWorker } from '@/interfaces/worker';
import type { IBuilder } from '@/interfaces/builder';
// Types
import type { RoomEstimate, RoomParams } from '@/types/room';

/**
 * Хаб для управления приложением.
 *
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

  public resizeRenderer(): void {
    this._renderer.resize();
  }

  /**
   * Полностью перестраивает комнату и возвращает расчёты материалов.
   *
   * @param params - Параметры комнаты.
   * @returns Расчёты пола и плинтуса.
   *
   * @public
   */
  public buildRoom(params: RoomParams): RoomEstimate {
    this.clearRoom();

    this._wallBuilder.build(params);
    this._floorBuilder.build(params);
    this._baseboardBuilder.build(params);

    return this.estimateRoom(params);
  }

  /**
   * Возвращает расчёты материалов без перестроения сцены.
   *
   * @param params - Параметры комнаты.
   * @returns Расчёты пола и плинтуса.
   *
   * @public
   */
  public estimateRoom(params: RoomParams): RoomEstimate {
    return {
      planksCount: this._floorBuilder.estimate(params),
      baseboardLength: this._baseboardBuilder.estimate(params),
    };
  }

  /**
   * Очищает все части комнаты из сцены.
   *
   * @public
   */
  public clearRoom(): void {
    this._wallBuilder.clear();
    this._floorBuilder.clear();
    this._baseboardBuilder.clear();
  }

  /**
   * Запускает редактор.
   * Вызывается после создания хаба.
   *
   * @public
   */
  public start(): void {
    this._worker.start();
  }

  /**
   * Останавливает редактор.
   *
   * @public
   */
  public stop(): void {
    this._worker.stop();
  }

  public dispose(): void {
    this.clearRoom();

    this._worker.dispose();
    this._renderer.dispose();
  }
}
