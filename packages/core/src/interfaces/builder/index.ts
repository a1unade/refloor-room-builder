// Types
import type { RoomParams } from '@/types/room';
// Interfaces
import type { Disposable } from 'tsyringe';

/**
 * Базовый интерфейс builder-класса, отвечающего за построение
 * отдельной части комнаты: стен, пола, плинтуса или другого элемента сцены.
 *
 * @public
 * @interface
 */
export interface IBuilder extends Disposable {
  /**
   * Строит или перестраивает свою часть комнаты на основе переданных параметров.
   *
   * @param params - Параметры комнаты и выбранных материалов.
   *
   * @method
   * @public
   */
  build(params: RoomParams): void;

  /**
   * Применение выбранных материалов для части комнаты на основе переданных параметров.
   *
   * @param params - Параметры комнаты и выбранных материалов.
   *
   * @method
   * @public
   */
  paint(params: RoomParams): void;

  /**
   * Выполняет расчёт материалов или метрик для своей области ответственности.
   *
   * @param params - Параметры комнаты и выбранных материалов.
   * @returns Расчётное значение для конкретного builder-а.
   *
   * @method
   * @public
   */
  estimate(params: RoomParams): number;

  /**
   * Удаляет созданные builder-ом объекты из сцены.
   *
   * @method
   * @public
   */
  clear(): void;
}
