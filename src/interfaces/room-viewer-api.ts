// Types
import type { RoomParams } from '@refloor/core/dist/src/types/room';

export interface IRoomViewerApi {
  resizeRenderer(): void;
  start(): void;
  stop(): void;
  buildWalls(params: RoomParams): void;
}
