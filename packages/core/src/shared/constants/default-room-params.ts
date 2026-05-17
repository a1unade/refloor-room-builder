// Types
import { FloorLayout } from '@/types/room';

/**
 * Дефолтные константы для настроек комнаты
 *
 * @const
 */
export const defaultRoomParams = {
  /**
   * Высота комнаты в метрах.
   *
   * @public
   * @member
   */
  height: 2.7,

  /**
   * HEX-цвет стен.
   *
   * @public
   * @member
   */
  wallColor: '#8c91d5',

  /**
   * Тип раскладки напольного покрытия.
   *
   * @public
   * @member
   */
  floorLayout: FloorLayout.Herringbone,

  /**
   * HEX-цвет подложки пола.
   *
   * @public
   * @member
   */
  floorColor: '#1f1f1f',

  /**
   * HEX-цвет досок пола.
   *
   * @public
   * @member
   */
  plankColor: '#b47a45',

  /**
   * Длина одной доски в метрах.
   *
   * @public
   * @member
   */
  plankLength: 0.6,

  /**
   * Ширина одной доски в метрах.
   *
   * @public
   * @member
   */
  plankWidth: 0.1,

  /**
   * Размер шва между досками в метрах.
   *
   * @public
   * @member
   */
  plankGap: 0.01,

  /**
   * Толщина доски в метрах.
   *
   * @public
   * @member
   */
  plankThickness: 0.025,

  /**
   * Тепловой зазор между напольным покрытием и стенами в метрах.
   *
   * @public
   * @member
   */
  floorWallGap: 0.03,

  /**
   * HEX-цвет плинтуса.
   *
   * @public
   * @member
   */
  baseboardColor: '#ffffff',

  /**
   * Высота плинтуса в метрах.
   *
   * @public
   * @member
   */
  baseboardHeight: 0.08,

  /**
   * Толщина плинтуса в метрах.
   *
   * @public
   * @member
   */
  baseboardThickness: 0.015,

  /**
   * Дополнительное перекрытие пола плинтусом в метрах.
   *
   * @public
   * @member
   */
  baseboardCoverOverlap: 0.012,

  /**
   * Вертикальное перекрытие между плинтусом и полом в метрах.
   *
   * @public
   * @member
   */
  baseboardVerticalOverlap: 0.003,

  /**
   * Отступ плинтуса от стены внутрь комнаты в метрах.
   *
   * @public
   * @member
   */
  baseboardWallInset: 0.002,

  baseOffset: 0.002,
};
