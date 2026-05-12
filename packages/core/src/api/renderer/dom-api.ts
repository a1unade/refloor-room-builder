// Core
import { inject, injectable } from 'tsyringe';
// Interfaces
import type { IDomApi } from '@/interfaces/api';
import type { IRendererDomAccess } from '@/interfaces/api/renderer';

/**
 * Реализация API для доступа к DOM-элементам рендерера.
 *
 * @internal
 * @class
 */
@injectable()
export class DomApi implements IDomApi {
  public constructor(@inject('IRendererDomAccess') private _domAccessApi: IRendererDomAccess) {}

  public getCanvas(): HTMLCanvasElement {
    return this._domAccessApi.getCanvas();
  }

  public getDomElement(): HTMLElement {
    return this._domAccessApi.getDomElement();
  }
}
