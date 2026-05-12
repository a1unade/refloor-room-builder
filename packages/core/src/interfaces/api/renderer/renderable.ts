/**
 * Интерфейс для объектов, которые могут быть отрисованы.
 *
 * @public
 * @interface
 */
export interface IRenderable {
  /**
   * Выполняет кастомный рендеринг объекта.
   *
   * @public
   * @method
   */
  render(): void;
}
