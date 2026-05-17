// Types
import type { FloorLayout } from '@/types/room';

/**
 * Конфигурация комнаты.
 *
 * Содержит размеры помещения, параметры отделочных материалов,
 * настройки раскладки пола, зазоров и плинтуса.
 *
 * @public
 * @type
 */
export type RoomParams = {
  /**
   * Длина комнаты в метрах.
   *
   * @public
   * @member
   */
  length: number;

  /**
   * Ширина комнаты в метрах.
   *
   * @public
   * @member
   */
  width: number;

  /**
   * Высота комнаты в метрах.
   *
   * @public
   * @member
   */
  height?: number;

  /**
   * HEX-цвет стен.
   *
   * @public
   * @member
   */
  wallColor?: string;

  /**
   * Тип раскладки напольного покрытия.
   *
   * @public
   * @member
   */
  floorLayout?: FloorLayout;

  /**
   * HEX-цвет подложки пола.
   *
   * @public
   * @member
   */
  floorColor?: string;

  /**
   * HEX-цвет досок пола.
   *
   * @public
   * @member
   */
  plankColor?: string;

  /**
   * Длина одной доски в метрах.
   *
   * @public
   * @member
   */
  plankLength?: number;

  /**
   * Ширина одной доски в метрах.
   *
   * @public
   * @member
   */
  plankWidth?: number;

  /**
   * Размер шва между досками в метрах.
   *
   * @public
   * @member
   */
  plankGap?: number;

  /**
   * Тепловой зазор между напольным покрытием и стенами в метрах.
   *
   * @public
   * @member
   */
  floorWallGap?: number;

  /**
   * HEX-цвет плинтуса.
   *
   * @public
   * @member
   */
  baseboardColor?: string;

  /**
   * Высота плинтуса в метрах.
   *
   * @public
   * @member
   */
  baseboardHeight?: number;

  /**
   * Толщина плинтуса в метрах.
   *
   * @public
   * @member
   */
  baseboardThickness?: number;

  /**
   * Дополнительное перекрытие пола плинтусом в метрах.
   *
   * @public
   * @member
   */
  baseboardCoverOverlap?: number;

  /**
   * Вертикальное перекрытие между плинтусом и полом в метрах.
   *
   * @public
   * @member
   */
  baseboardVerticalOverlap?: number;

  /**
   * Отступ плинтуса от стены внутрь комнаты в метрах.
   *
   * @public
   * @member
   */
  baseboardWallInset?: number;
};
