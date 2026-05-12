// Interfaces
import type { Disposable } from 'tsyringe';

/**
 * Базовый интерфейс для всех runtime-модулей приложения.
 *
 * @remarks
 * Модули — это независимые компоненты, которые управляют определёнными аспектами:
 * - управление камерой и контролами (`ControlsModule`)
 * - управление сценой и объектами (`SceneModule`)
 *
 * @internal
 * @interface
 */
export interface IRuntimeModule extends Disposable {
  /**
   * Инициализирует модуль.
   *
   * @remarks
   * Вызывается один раз при старте приложения.
   * Здесь модуль должен:
   * - создавать необходимые объекты
   * - подписываться на события
   * - регистрировать обработчики
   *
   * @internal
   */
  init(): void;
}
