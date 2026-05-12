// Types
import type { RendererConfig, RendererConfigInput } from '@/types/renderer';

/** Создание конфига для рендерера, при использовании частичного пользовательского конфига */
export const mergeRendererConfig = (
  base: RendererConfig,
  input?: RendererConfigInput,
): RendererConfig => {
  if (!input) {
    return base;
  }

  return {
    background: {
      ...base.background,
      ...input.background,
    },

    camera: {
      ...base.camera,
      ...input.camera,
      position: {
        ...base.camera.position,
        ...input.camera?.position,
      },
    },

    renderer: {
      ...base.renderer,
      ...input.renderer,
    },

    lights: {
      ambient: {
        ...base.lights.ambient,
        ...input.lights?.ambient,
      },

      directional: {
        ...base.lights.directional,
        ...input.lights?.directional,
        position: {
          ...base.lights.directional.position,
          ...input.lights?.directional?.position,
        },
      },
    },
  };
};
