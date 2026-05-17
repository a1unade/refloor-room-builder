// Types
import type { RoomParams, RoomEstimate } from '@refloor/core';

export interface IRoomViewerApi {
  resizeRenderer(): void;
  start(): void;
  stop(): void;
  buildRoom(params: RoomParams): RoomEstimate;
}
