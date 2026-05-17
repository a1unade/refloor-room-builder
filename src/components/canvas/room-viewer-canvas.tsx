// Core
import React, { useEffect, useRef } from 'react';
import { createAppHub, type RendererConfigInput } from '@refloor/core';
// Interfaces
import type { IRoomViewerApi } from '@/interfaces/room-viewer-api';
// Contexts
import { useRoomViewerHubContext } from '@/contexts/room-viewer-hub-context';

interface ViewerCanvasProps {
  className?: string;
  width?: number;
  height?: number;
  config?: RendererConfigInput;
}

export const RoomViewerCanvas: React.FC<ViewerCanvasProps> = ({
  className,
  width = 1000,
  height = 1000,
  config,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setHub } = useRoomViewerHubContext();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;

    const appHub = createAppHub(canvas, config);

    const api: IRoomViewerApi = {
      start: () => appHub.start(),
      resizeRenderer: () => appHub.resizeRenderer(),
      stop: () => appHub.stop(),
      buildRoom: (params) => appHub.buildRoom(params),
    };

    setHub(api);

    const handleResize = () => {
      const nextWidth = parent.clientWidth;
      const nextHeight = parent.clientHeight;

      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;

      api.resizeRenderer();
    };

    handleResize();
    api.start();

    window.addEventListener('resize', handleResize);

    return () => {
      api.stop();
      window.removeEventListener('resize', handleResize);
      appHub.dispose();
      setHub(null);
    };
  }, [config, setHub]);

  return <canvas ref={canvasRef} className={className} width={width} height={height} />;
};

export default RoomViewerCanvas;
