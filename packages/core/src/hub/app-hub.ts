// Core
import type { Renderer } from '@/core';
// IOC
import { type Disposable, inject, injectable } from 'tsyringe';
// Interfaces
import type { IWorker } from '@/interfaces/worker';

/**
 * Хаб для управления приложением
 * @public
 */
@injectable()
export class AppHub implements Disposable {
  public constructor(
    @inject('Renderer') private _renderer: Renderer,
    @inject('IWorker') private _worker: IWorker,
  ) {}

  public resizeRenderer() {
    this._renderer.resize();
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
