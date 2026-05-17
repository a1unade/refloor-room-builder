// Core
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
// UI
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
// Core package
import { defaultRoomParams, type RoomEstimate, type RoomParams } from '@refloor/core';
// Providers
import { RoomVewerProvider } from '@/providers';
// Contexts
import { useRoomViewerHubContext } from '@/contexts/room-viewer-hub-context';
// Styles
import './index.css';
// Components
import { RoomViewerCanvas } from '@/components/canvas';
import { RoomControls } from '@/components/controls';

const RoomViewerPage = () => {
  const { hub } = useRoomViewerHubContext();

  const [params, setParams] = useState<RoomParams>(defaultRoomParams);
  const [estimate, setEstimate] = useState<RoomEstimate | null>(null);

  useEffect(() => {
    if (!hub) return;

    const nextEstimate = hub.buildRoom(params);
    setEstimate(nextEstimate);
  }, [hub, params]);

  return (
    <div className="room-renderer">
      <RoomViewerCanvas className="room-renderer__canvas" />

      <RoomControls
        params={params}
        estimate={estimate}
        onChange={setParams}
        onReset={() => setParams(defaultRoomParams)}
      />
    </div>
  );
};

export const App = () => {
  return (
    <FluentProvider theme={webLightTheme}>
      <RoomVewerProvider>
        <RoomViewerPage />
      </RoomVewerProvider>
    </FluentProvider>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
