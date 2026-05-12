// Types
import type { RendererColor } from '@/types/renderer';

/**
 * Настройки ambient-освещения рендерера
 *
 * @public
 */
export type RendererAmbientLightConfig = {
  enabled: boolean;
  color: RendererColor;
  intensity: number;
};
