// IOC
import type { Disposable } from 'tsyringe';

/**
 * Интерфейс для воркера, управляющего жизненным циклом модулей.
 *
 * @public
 * @interface
 */
export interface IWorker extends Disposable {
  /**
   * Запускает воркер.
   * Инициализирует все модули и запускает цикл рендеринга.
   *
   * @public
   * @method
   */
  start(): void;

  /**
   * Останавливает воркер.
   * Останавливает цикл рендеринга и освобождает ресурсы.
   *
   * @public
   * @method
   */
  stop(): void;
}
