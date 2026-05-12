/**
 * Высокоуровневый API для доступа к DOM-элементам рендерера.
 *
 * @internal
 * @interface
 */
export interface IDomApi {
  /**
   * Возвращает canvas-элемент приложения.
   *
   * @returns HTMLCanvasElement - canvas элемент
   *
   * @internal
   * @method
   */
  getCanvas(): HTMLCanvasElement;

  /**
   * Возвращает DOM-элемент рендерера.
   *
   * @returns HTMLElement - DOM-элемент для подписки на события
   *
   * @internal
   * @method
   */
  getDomElement(): HTMLElement;
}
