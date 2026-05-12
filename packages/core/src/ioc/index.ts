// IOC
import 'reflect-metadata';
import { container as globalContainer, type DependencyContainer } from 'tsyringe';
// Core
import { Renderer } from '@/core';
import { RendererWorker } from '@/workers';
// API
import { MeshApi } from '@/api/modules';
import { CameraApi, DomApi, SceneApi } from '@/api/renderer';
// Modules
import { ControlsModule, SceneModule } from '@/modules';
// Interfaces
import type { IMeshApi, ICameraApi, IDomApi, ISceneApi } from '@/interfaces/api';
import type { IWorker } from '@/interfaces/worker';
// Types
import type { RendererConfigInput } from '@/types/renderer';
// Shared
import { mergeRendererConfig } from '@/shared/helpers';
import { defaultRendererConfig } from '@/shared/constants';
// Hub
import { AppHub } from '@/hub/app-hub';

let isContainerInitialized = false;
const container = globalContainer.createChildContainer();

export function createContainer(
  canvas: HTMLCanvasElement,
  rendererConfig?: RendererConfigInput,
): DependencyContainer {
  if (isContainerInitialized) return container;

  // HTML
  container.registerInstance('Canvas', canvas);

  // Config
  container.registerInstance(
    'RendererConfig',
    mergeRendererConfig(defaultRendererConfig, rendererConfig),
  );

  // Core
  container.registerSingleton<IWorker>('IWorker', RendererWorker);

  container.registerSingleton('Renderer', Renderer);

  container.register('IRenderable', { useToken: 'Renderer' });
  container.register('IRendererAccess', { useToken: 'Renderer' });
  container.register('IRendererCameraAccess', { useToken: 'Renderer' });
  container.register('IRendererDomAccess', { useToken: 'Renderer' });
  container.register('IRendererSceneAccess', { useToken: 'Renderer' });

  // API
  container.registerSingleton<IMeshApi>('IMeshApi', MeshApi);
  container.registerSingleton<ICameraApi>('ICameraApi', CameraApi);
  container.registerSingleton<IDomApi>('IDomApi', DomApi);
  container.registerSingleton<ISceneApi>('ISceneApi', SceneApi);

  // Modules
  container.registerSingleton('ControlsModule', ControlsModule);
  container.registerSingleton('SceneModule', SceneModule);

  container.register('IUpdatableModule', { useToken: 'ControlsModule' });
  container.register('IRuntimeModule', { useToken: 'SceneModule' });

  // Hub
  container.registerSingleton('AppHub', AppHub);

  isContainerInitialized = true;

  return container;
}

export { container };
