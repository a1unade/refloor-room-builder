// Types
import type { RendererColor } from '@/types/renderer';
import type { Vec3 } from '@/types/common';

/**
 * Настройки directional-освещения рендерера
 *
 * @public
 */
export type RendererDirectionalLightConfig = {
  enabled: boolean;
  color: RendererColor;
  intensity: number;
  position: Vec3;
};
