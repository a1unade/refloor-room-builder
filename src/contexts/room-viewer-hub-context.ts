// Core
import { createContext, useContext } from 'react';
// Interfaces
import type { IRoomViewerApi } from '@/interfaces/room-viewer-api';

export interface IRoomViewerContext {
  hub: IRoomViewerApi | null;
  setHub: (hub: IRoomViewerApi | null) => void;
}

export const RoomViewerHubContext = createContext<IRoomViewerContext | null>(null);

export const useRoomViewerHubContext = (): IRoomViewerContext => {
  const context = useContext(RoomViewerHubContext);

  if (!context) {
    throw new Error('useViewerHubContext must be used inside ViewerProvider');
  }

  return context;
};

export const useRoomViewerHub = (): IRoomViewerApi | null => {
  return useRoomViewerHubContext().hub;
};
