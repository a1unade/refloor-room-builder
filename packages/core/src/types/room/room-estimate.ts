/**
 * Расчёты материалов для комнаты.
 *
 * @public
 * @type
 */
export type RoomEstimate = {
  /**
   * Количество досок пола с учётом выбранной раскладки и запаса.
   *
   * @public
   * @member
   */
  planksCount: number;

  /**
   * Погонаж плинтуса в метрах.
   *
   * @public
   * @member
   */
  baseboardLength: number;
};
