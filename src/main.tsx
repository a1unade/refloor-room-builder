// Core
import { createRoot } from 'react-dom/client';
// Providers
import { RoomVewerProvider } from '@/providers';
// Styles
import './index.css';
// Components
import { RoomViewerCanvas } from '@/components/canvas';

export const App = () => {
  return (
    <RoomVewerProvider>
      <div className="room-renderer">
        <RoomViewerCanvas className="room-renderer__canvas" />
      </div>
    </RoomVewerProvider>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
