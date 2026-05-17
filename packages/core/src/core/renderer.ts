// Core
import * as THREE from 'three';
// IOC
import { type Disposable, inject, injectable } from 'tsyringe';
// Interfaces
import type {
  IRendererCameraAccess,
  IRendererAccess,
  IRendererDomAccess,
  IRendererSceneAccess,
  IRenderable,
} from '@/interfaces/api/renderer';
// Types
import type { RendererConfig } from '@/types/renderer';

/**
 * Базовый класс рендерера для работы с WebGL через Three.js.
 *
 * @public
 * @class
 */
@injectable()
export class Renderer
  implements
    IRendererAccess,
    IRendererCameraAccess,
    IRendererDomAccess,
    IRendererSceneAccess,
    IRenderable,
    Disposable
{
  /**
   * Корневой объект сцены Three.js.
   *
   * @protected
   * @member
   */
  protected scene!: THREE.Scene;

  /**
   * Камера для сцены Three.js.
   *
   * @protected
   * @member
   */
  protected camera!: THREE.PerspectiveCamera;

  /**
   * Экземпляр Three.js WebGLRenderer.
   *
   * @protected
   * @member
   */
  protected renderer!: THREE.WebGLRenderer;

  /**
   * HTML-элемент canvas, на котором рендерится сцена.
   *
   * @protected
   * @member
   */
  protected canvas!: HTMLCanvasElement;

  /**
   * Конструктор рендерера.
   *
   * @param _canvas - HTMLCanvasElement для рендеринга
   * @param _config - Конфиг для настройки рендерера
   *
   * @public
   * @constructor
   */
  public constructor(
    @inject('Canvas') _canvas: HTMLCanvasElement,
    @inject('RendererConfig') private readonly _config: RendererConfig,
  ) {
    // Canvas из html верстки
    this.canvas = _canvas;

    // Добавление сцены
    this.scene = new THREE.Scene();
    // Настройка фона
    if (this._config.background.transparent) {
      this.scene.background = null;
    } else {
      this.scene.background = new THREE.Color(this._config.background.color);
    }

    // Добавление и настройка камеры
    this.camera = new THREE.PerspectiveCamera(
      this._config.camera.fov,
      this.canvas.clientWidth / this.canvas.clientHeight,
      this._config.camera.near,
      this._config.camera.far,
    );
    this.camera.position.set(
      this._config.camera.position.x,
      this._config.camera.position.y,
      this._config.camera.position.z,
    );

    // Рендерер three.js
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this._config.renderer.antialias,
      alpha: this._config.background.transparent || this._config.renderer.alpha,
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.localClippingEnabled = true;

    if (this._config.background.transparent) {
      this.renderer.setClearAlpha(0);
    } else {
      this.renderer.setClearColor(this._config.background.color, 1);
    }

    // Освещение
    if (this._config.lights.ambient.enabled) {
      const ambientLight = new THREE.AmbientLight(
        this._config.lights.ambient.color,
        this._config.lights.ambient.intensity,
      );

      // общий свет
      this.scene.add(ambientLight);
    }

    if (this._config.lights.directional.enabled) {
      const directionalLight = new THREE.DirectionalLight(
        this._config.lights.directional.color,
        this._config.lights.directional.intensity,
      );

      directionalLight.position.set(
        this._config.lights.directional.position.x,
        this._config.lights.directional.position.y,
        this._config.lights.directional.position.z,
      );

      this.scene.add(directionalLight);
    }
  }

  /**
   * Обновляет размер рендерера и пропорции камеры.
   *
   * @public
   * @method
   */
  public resize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  /**
   * Выполняет рендеринг текущего кадра.
   *
   * @public
   * @method
   */
  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Обновляет состояние рендерера перед рендерингом.
   *
   * @protected
   * @method
   */
  protected update(): void {}

  /**
   * Запускает основной цикл рендеринга.
   *
   * @public
   * @method
   */
  public loop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  }

  public getCamera(): THREE.Camera {
    return this.camera;
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getDomElement(): HTMLElement {
    return this.renderer.domElement;
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Освобождает ресурсы рендерера.
   *
   * @public
   * @method
   */
  public dispose(): Promise<void> | void {
    this.scene = null!;
    this.camera = null!;

    this.renderer?.dispose();

    this.canvas = null!;
  }
}
