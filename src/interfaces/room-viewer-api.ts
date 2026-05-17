// Types
import type { RoomParams } from '@refloor/core';

export interface IRoomViewerApi {
  resizeRenderer(): void;
  start(): void;
  stop(): void;
  buildWalls(params: RoomParams): void;
}
