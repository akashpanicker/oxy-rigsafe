import { useRef, useState, useEffect } from 'react';
import CameraHierarchyDropdown from './CameraHierarchyDropdown';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';

interface BoundingBox {
  top: string;
  left: string;
  width: string;
  height: string;
}

interface VideoPanelProps {
  cameraName: string;
  breadcrumb: string;
  feedImage: string;
  feedVideo?: string;
  isAlert?: boolean;
  boundingBox?: BoundingBox;
  startTime?: number;
  onOpenIncidentDetails?: () => void;
  onClosePanel?: () => void;
  canClosePanel?: boolean;
}

function VideoPanel({
  cameraName: initialCameraName,
  breadcrumb: initialBreadcrumb,
  feedImage,
  feedVideo,
  isAlert = false,
  boundingBox,
  startTime,
  onOpenIncidentDetails,
  onClosePanel,
  canClosePanel = true,
}: VideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [cameraName, setCameraName] = useState(initialCameraName);
  const [breadcrumb, setBreadcrumb] = useState(initialBreadcrumb);

  useEffect(() => {
    if (videoRef.current && startTime !== undefined) {
      videoRef.current.currentTime = startTime;
    }
  }, [startTime]);

  const handleCameraSelect = (name: string, path: string) => {
    setCameraName(name);
    setBreadcrumb(path);
  };

  return (
    <article
      className={`video-panel${isAlert ? ' video-panel--alert' : ''}`}
      aria-label={`Video panel - ${cameraName}`}
    >
      {/* Header Bar */}
      <div className="video-panel__header">
        <div className="video-panel__header-left">
          <CameraHierarchyDropdown
            selectedCameraName={cameraName}
            onCameraSelect={handleCameraSelect}
          />
          <span className="video-panel__breadcrumb" title={breadcrumb}>
            {breadcrumb}
          </span>
        </div>

        <div className="video-panel__header-actions">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="video-panel__action-btn" type="button" aria-label="Settings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>Camera settings</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="video-panel__action-btn"
                type="button"
                aria-label="Open in new tab"
                onClick={onOpenIncidentDetails}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>Open incident details in a new tab</TooltipContent>
          </Tooltip>
          {canClosePanel && onClosePanel && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="video-panel__action-btn" type="button" aria-label="Close panel" onClick={onClosePanel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>Close video panel</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Video Content Area */}
      <div className="video-panel__content">
        {feedVideo ? (
          <video
            ref={videoRef}
            className="video-panel__feed"
            src={feedVideo}
            poster={feedImage}
            autoPlay
            muted
            loop
            playsInline
            aria-label={`Live CCTV feed from ${cameraName}`}
          />
        ) : (
          <img
            className="video-panel__feed"
            src={feedImage}
            alt={`Live CCTV feed from ${cameraName}`}
          />
        )}

        {/* Bounding Box Overlay */}
        {boundingBox && (
          <div
            className="video-panel__bbox"
            style={{
              top: boundingBox.top,
              left: boundingBox.left,
              width: boundingBox.width,
              height: boundingBox.height,
            }}
            aria-label="Detected person bounding box"
          >
            <span className="video-panel__bbox-label">Person Detected</span>
          </div>
        )}

        {/* Playback Controls */}
        <div className="video-panel__controls">
          <button className="video-panel__control-btn" type="button" aria-label="Go to start" onClick={() => { if (videoRef.current) { videoRef.current.currentTime = 0; } }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="video-panel__control-btn" type="button" aria-label="Previous frame" onClick={() => { if (videoRef.current) { videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5); } }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>Step backward</TooltipContent>
          </Tooltip>
          <button className="video-panel__control-btn" type="button" aria-label="Step back" onClick={() => { if (videoRef.current) { videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 1 / 30); } }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 18V6l-8.5 6 8.5 6zm.5-6 8.5 6V6l-8.5 6z" />
            </svg>
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="video-panel__control-btn video-panel__control-btn--play"
                type="button"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={() => {
                  if (videoRef.current) {
                    if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
                    setIsPlaying(!isPlaying);
                  }
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  {isPlaying && feedVideo ? (
                    <>
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </>
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>{isPlaying ? 'Pause recording' : 'Play recording'}</TooltipContent>
          </Tooltip>
          <button className="video-panel__control-btn" type="button" aria-label="Step forward" onClick={() => { if (videoRef.current) { videoRef.current.currentTime += 1 / 30; } }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
            </svg>
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="video-panel__control-btn" type="button" aria-label="Next frame" onClick={() => { if (videoRef.current) { videoRef.current.currentTime += 5; } }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>Step forward</TooltipContent>
          </Tooltip>
          <button className="video-panel__control-btn" type="button" aria-label="Go to end" onClick={() => { if (videoRef.current) { videoRef.current.currentTime = videoRef.current.duration; } }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Bookmark / Star button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="video-panel__fullscreen" type="button" aria-label="Bookmark camera">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent>Mark camera as favorite</TooltipContent>
        </Tooltip>
      </div>
    </article>
  );
}

export default VideoPanel;
