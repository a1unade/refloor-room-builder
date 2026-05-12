// IOC
import { inject, injectable, injectAll } from 'tsyringe';
// Interfaces
import type { IWorker } from '@/interfaces/worker';
import type { IRenderable } from '@/interfaces/api/renderer';
import type { IRuntimeModule, IUpdatableModule } from '@/interfaces/module';

/**
 * Воркер для оркестрации жизненного цикла модулей и цикла рендеринга.
 *
 * @internal
 * @class
 */
@injectable()
export class RendererWorker implements IWorker {
  /**
   * ID анимационного цикла (для остановки)
   *
   * @private
   * @member
   */
  private _animationId: number | null = null;

  /**
   * Конструктор воркера.
   *
   * @internal
   * @constructor
   */
  constructor(
    @injectAll('IUpdatableModule', { isOptional: true })
    private readonly _updatable: IUpdatableModule[],

    @injectAll('IRuntimeModule', { isOptional: true })
    private readonly _runtime: IRuntimeModule[],

    @inject('IRenderable') private readonly _renderer: IRenderable,
  ) {}

  public start(): void {
    const all = [...this._runtime, ...this._updatable];
    new Set(all).forEach((m) => m.init());

    this._loop();
  }

  /**
   * Внутренний анимационный цикл.
   *
   * @remarks
   * Каждый кадр:
   * 1. Обновляет модули (`update()`)
   * 2. Рендерит сцену
   *
   * @private
   * @method
   */
  private _loop(): void {
    this._updatable.forEach((m) => m.update());
    this._renderer.render();
    this._animationId = requestAnimationFrame(() => this._loop());
  }

  public stop(): void {
    if (this._animationId) {
      cancelAnimationFrame(this._animationId);
      this._animationId = null;
    }
  }

  /**
   * Освобождает ресурсы контроллера.
   *
   * @public
   * @method
   */
  public dispose(): Promise<void> | void {
    this._animationId = null;
  }
}
