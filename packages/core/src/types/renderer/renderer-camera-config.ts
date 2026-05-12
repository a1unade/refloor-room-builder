// Types
import type { Vec3 } from '@/types/common';

/**
 * Настройки камеры рендерера
 *
 * @public
 */
export type RendererCameraConfig = {
  fov: number;
  near: number;
  far: number;
  position: Vec3;
};
