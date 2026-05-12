// Types
import type {
  RendererBackgroundConfig,
  RendererCameraConfig,
  RendererOptionsConfig,
  RendererLightsConfig,
} from '@/types/renderer';

/**
 * Параметры настройки рендерера
 *
 * @public
 */
export type RendererConfig = {
  background: RendererBackgroundConfig;
  camera: RendererCameraConfig;
  renderer: RendererOptionsConfig;
  lights: RendererLightsConfig;
};
