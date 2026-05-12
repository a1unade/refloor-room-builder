// Interfaces
import type { IRuntimeModule } from './runtime-module';

/**
 * Интерфейс для модулей, требующих периодического обновления.
 *
 * @internal
 */
export interface IUpdatableModule extends IRuntimeModule {
  /**
   * Обновление состояния модуля.
   *
   * @internal
   */
  update(): void;
}
