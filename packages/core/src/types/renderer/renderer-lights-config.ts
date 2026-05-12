// Types
import type { RendererAmbientLightConfig, RendererDirectionalLightConfig } from '@/types/renderer';

/**
 * Настройки освещения рендерера
 *
 * @public
 */
export type RendererLightsConfig = {
  ambient: RendererAmbientLightConfig;
  directional: RendererDirectionalLightConfig;
};
