import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoPanel from './components/VideoPanel';
import EventTimeline, { TimelineEvent } from './components/EventTimeline';
import { AlertCard } from './components/AlertCardPanel';
import { alertData } from './constants/alerts';
import { Tooltip, TooltipContent, TooltipTrigger } from './components/Tooltip';

interface IncidentDetailsPageProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onBack?: () => void;
  activeLayout: string;
  onLayoutChange: (layout: string) => void;
}

const RANGE_OPTIONS = [
  { label: 'Last 15 mins', minutes: 15 },
  { label: 'Last 1 hour', minutes: 60 },
  { label: 'Last 6 hours', minutes: 6 * 60 },
  { label: 'Last 12 hours', minutes: 12 * 60 },
  { label: 'Last 24 hours', minutes: 24 * 60 },
  { label: 'Last 2 days', minutes: 2 * 24 * 60 },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 'event-1', minutesAgo: 8, type: 'warning', description: 'Motion detected', cameraName: 'Cam-02', zoneType: 'Yellow Zone' },
  { id: 'event-2', minutesAgo: 22, type: 'warning', description: 'Vehicle detected', cameraName: 'Cam-03', zoneType: 'Yellow Zone' },
  { id: 'event-3', minutesAgo: 35, type: 'critical', description: 'Human detected', cameraName: 'Cam-02', zoneType: 'Restricted Zone' },
  { id: 'event-4', minutesAgo: 90, type: 'warning', description: 'Area cleared', cameraName: 'Cam-02', zoneType: 'Yellow Zone' },
  { id: 'event-5', minutesAgo: 280, type: 'warning', description: 'Shift change', cameraName: 'Cam-01', zoneType: 'Operational Zone' },
  { id: 'event-6', minutesAgo: 640, type: 'critical', description: 'Unauthorized access', cameraName: 'Cam-04', zoneType: 'Restricted Zone' },
  { id: 'event-7', minutesAgo: 1290, type: 'warning', description: 'Equipment activity detected', cameraName: 'Cam-03', zoneType: 'Yellow Zone' },
  { id: 'event-8', minutesAgo: 2200, type: 'critical', description: 'Restricted zone entry', cameraName: 'Cam-04', zoneType: 'Restricted Zone' },
];

const IncidentDetailsPage: React.FC<IncidentDetailsPageProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  onBack,
  activeLayout,
  onLayoutChange,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>('event-3');
  const [seekTime, setSeekTime] = useState<number | undefined>(undefined);
  const [rangeMinutes, setRangeMinutes] = useState(24 * 60);

  const visibleTimelineEvents = useMemo(
    () =>
      TIMELINE_EVENTS
        .filter((event) => event.minutesAgo <= rangeMinutes)
        .sort((a, b) => b.minutesAgo - a.minutesAgo),
    [rangeMinutes]
  );

  useEffect(() => {
    if (!visibleTimelineEvents.length) {
      setSelectedEventId(undefined);
      setSeekTime(undefined);
      return;
    }

    const isSelectedEventVisible = visibleTimelineEvents.some((event) => event.id === selectedEventId);
    if (!isSelectedEventVisible) {
      const fallbackEvent = visibleTimelineEvents[visibleTimelineEvents.length - 1];
      setSelectedEventId(fallbackEvent.id);
      setSeekTime(fallbackEvent.minutesAgo);
    }
  }, [selectedEventId, visibleTimelineEvents]);

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEventId(event.id);
    setSeekTime(event.minutesAgo);
  };

  const recentAlerts = alertData.filter(alert => alert.activity === 'Recent');
  const activeAlertData = alertData.find(alert => alert.activity === 'Active') || {
    id: 12345,
    status: 'critical' as const,
    issue: 'Human Detected',
    activity: 'Active',
    eventId: '#12345',
    rig: 'HP-123',
    camera: 'Cam-04',
    dateTime: '01 Feb 2026; 02:30 PM',
    zoneType: 'Red Zone',
    location: 'West – Midland Site',
    confidence: '97%'
  };

  return (
    <div className="incident-details-page">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={onToggleSidebar}
        pageTitle="Incident Details"
        onLogoClick={onBack}
      />

      <div className="app-container">
        <Sidebar
          isOpen={isSidebarOpen}
          activeLayout={activeLayout}
          onLayoutChange={onLayoutChange}
          hideLayouts
        />

      <div className="incident-grid">
        <div className="context-bar context-bar--incident">
          <div className="context-bar__left">
            <select
              className="time-range-selector"
              value={rangeMinutes}
              onChange={(event) => setRangeMinutes(Number(event.target.value))}
              aria-label="Select timeline range"
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.minutes} value={option.minutes}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="context-bar__center">
            <div className="context-bar__breadcrumb">
              West / Midland Site / Rig 145 / Cam 02 - Pipe Deck
            </div>
          </div>
          <div className="context-bar__right">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="video-panel__action-btn" type="button" aria-label="Settings">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>Camera settings</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <main className="incident-main">
          <div className="incident-video-container">
            <VideoPanel
              cameraName="Cam 02 - Pipe Deck"
              breadcrumb="West / Midland Site / Rig 145 / Cam 02 - Pipe Deck"
              feedImage="/assets/images/camera-04.png"
              feedVideo="/assets/images/Rig video 1.mp4"
              isAlert={true}
              startTime={seekTime}
              canClosePanel={false}
            />
          </div>
          <EventTimeline
            events={visibleTimelineEvents}
            rangeMinutes={rangeMinutes}
            selectedEventId={selectedEventId}
            onEventClick={handleEventClick}
          />
        </main>

        <aside className="incident-side">
          <section className="incident-side__section incident-side__section--fixed">
            <h1 className="incident-panel-title">Selected alert event</h1>
            <AlertCard
              alert={activeAlertData}
              isHighlighted={true}
            />
          </section>

          <section className="incident-side__section incident-side__section--scrollable">
            <h1 className="incident-panel-title">Recent Alerts</h1>
            <div className="incident-side__list">
              {recentAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </section>
        </aside>
      </div>
      </div>
    </div>
  );
};

export default IncidentDetailsPage;


