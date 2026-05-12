// IOC
import 'reflect-metadata';
import { createContainer } from '@/ioc';
import type { DependencyContainer } from 'tsyringe';
// Hub
import type { AppHub } from '@/hub/app-hub';
// Types
import type { RendererConfigInput } from '@/types/renderer';

/** IOC-контейнер */
let _container: DependencyContainer | null = null;

/**
 * Инициализирует приложение и возвращает хаб.
 *
 * @public
 */
export const createAppHub = (
  canvas: HTMLCanvasElement,
  rendererConfig?: RendererConfigInput,
): AppHub => {
  if (_container) {
    return _container.resolve<AppHub>('AppHub');
  }

  _container = createContainer(canvas, rendererConfig);
  return _container.resolve<AppHub>('AppHub');
};

/**
 * Возвращает уже созданный хаб, если редактор инициализирован.
 * @public
 */
export const getAppHub = (): AppHub => {
  if (!_container) {
    throw new Error('AppHub is not initialized. Call createAppHub(canvas) first.');
  }

  return _container.resolve<AppHub>('AppHub');
};
