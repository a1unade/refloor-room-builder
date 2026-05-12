// Core
import React, { useMemo, useState } from 'react';
// Interfaces
import type { IRoomViewerApi } from '@/interfaces/room-viewer-api';
// Contexts
import { RoomViewerHubContext } from '@/contexts/room-viewer-hub-context';

interface RoomViewerProviderProps {
  children: React.ReactNode;
}

export const RoomViewerProvider: React.FC<RoomViewerProviderProps> = ({ children }) => {
  const [hub, setHub] = useState<IRoomViewerApi | null>(null);

  const value = useMemo(
    () => ({
      hub,
      setHub,
    }),
    [hub],
  );

  return <RoomViewerHubContext.Provider value={value}>{children}</RoomViewerHubContext.Provider>;
};

export default RoomViewerProvider;
