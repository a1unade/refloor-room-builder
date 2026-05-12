/**
 * Низкоуровневый доступ к DOM-элементам рендерера.
 *
 * @see {@link Renderer} - класс, реализующий этот интерфейс
 *
 * @public
 * @interface
 */
export interface IRendererDomAccess {
  /**
   * Возвращает canvas-элемент редактора.
   *
   * @returns HTMLCanvasElement - canvas элемент
   *
   * @public
   */
  getCanvas(): HTMLCanvasElement;

  /**
   * Возвращает DOM-элемент рендерера.
   *
   * @remarks
   * Обычно это тот же canvas, но в некоторых случаях может быть
   * другим элементом (например, div-обёрткой). Используется для
   * подписки на события ввода (mousemove, click, dblclick и т.д.).
   *
   * @returns HTMLElement - DOM-элемент для подписки на события
   *
   * @example
   * ```typescript
   * const domElement = domAccess.getDomElement();
   * ```
   *
   * @public
   * @method
   */
  getDomElement(): HTMLElement;
}
