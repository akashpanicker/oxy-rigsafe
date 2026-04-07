import { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CameraThumbnailBar from './components/CameraThumbnailBar';
import VideoPanel from './components/VideoPanel';
import AlertToast from './components/AlertToast';
import AlertTable from './components/AlertTable';
import AlertCardPanel from './components/AlertCardPanel';
import IncidentDetailsPage from './IncidentDetailsPage';
import { alertData } from './constants/alerts';
import { useRigFilter } from './store/rigFilterStore';

type AppView = 'dashboard' | 'incident-details';

const DASHBOARD_HASH = '#/';
const INCIDENT_DETAILS_HASH = '#/incident-details';

const getViewFromHash = (hash: string): AppView =>
  hash === INCIDENT_DETAILS_HASH ? 'incident-details' : 'dashboard';

interface DashboardVideoPanel {
  id: string;
  cameraName: string;
  breadcrumb: string;
  feedImage: string;
  feedVideo?: string;
  isAlert?: boolean;
}

const DEFAULT_LAYOUT_2_VIDEO_PANELS: DashboardVideoPanel[] = [
  {
    id: 'cam-04',
    cameraName: 'Cam 04 - Pipe Deck',
    breadcrumb: 'West / Midland Site / Rig 145 / Cam 04 - Pipe Deck',
    feedImage: '/assets/images/camera-02.png',
    feedVideo: '/assets/images/Rig video 1.mp4',
    isAlert: true,
  },
  {
    id: 'cam-03',
    cameraName: 'Cam 03 – Pipe Deck',
    breadcrumb: 'West / Site 09 / Rig 146 / Cam 03 – Pipe Deck',
    feedImage: '/assets/images/camera-05.png',
  },
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLayout, setActiveLayout] = useState('Layout 2');
  const [currentView, setCurrentView] = useState<AppView>(() => getViewFromHash(window.location.hash));
  const [layout2VideoPanels, setLayout2VideoPanels] = useState<DashboardVideoPanel[]>(DEFAULT_LAYOUT_2_VIDEO_PANELS);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(getViewFromHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToView = (view: AppView) => {
    const targetHash = view === 'incident-details' ? INCIDENT_DETAILS_HASH : DASHBOARD_HASH;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
      return;
    }
    setCurrentView(view);
  };

  const { setMyRigsExpanded } = useRigFilter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChipClick = () => {
    setIsSidebarOpen(true);
    setMyRigsExpanded(true);
  };

  const handleLayoutChange = (layout: string) => {
    setActiveLayout(layout);
    navigateToView('dashboard');
  };

  const handleOpenIncidentDetailsInNewTab = () => {
    const incidentDetailsUrl = `${window.location.pathname}${window.location.search}${INCIDENT_DETAILS_HASH}`;
    window.open(incidentDetailsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleBackToDashboard = () => {
    navigateToView('dashboard');
  };

  const handleCloseDashboardVideoPanel = (panelId: string) => {
    setLayout2VideoPanels((currentPanels) => {
      if (currentPanels.length <= 1) {
        return currentPanels;
      }
      return currentPanels.filter((panel) => panel.id !== panelId);
    });
  };

  if (currentView === 'incident-details') {
    return (
      <IncidentDetailsPage
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        onBack={handleBackToDashboard}
        activeLayout={activeLayout}
        onLayoutChange={handleLayoutChange}
      />
    );
  }

  const activeAlert = alertData.find(a => a.activity === 'Active') || null;
  const recentAlerts = alertData.filter(a => a.activity === 'Recent');

  return (
    <div className="app">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        onLogoClick={handleBackToDashboard}
      />

      <div className="app-container">
        <Sidebar
          isOpen={isSidebarOpen}
          activeLayout={activeLayout}
          onLayoutChange={handleLayoutChange}
        />

        <main className={`main-content ${activeLayout === 'Layout 1' ? 'main-content--layout-1' : ''}`}>
          {activeLayout === 'Layout 1' ? (
            <div className="layout-1-grid">
              <div className="layout-1-main">
                <CameraThumbnailBar onChipClick={handleChipClick} />

                <section className="video-section video-section--single" aria-label="Video monitoring panel">
                  <VideoPanel
                    cameraName="Cam 04 - Pipe Deck"
                    breadcrumb="West / Midland Site / Rig 145 / Cam 04 - Pipe Deck"
                    feedImage="/assets/images/camera-04.png"
                    feedVideo="/assets/images/Rig video 1.mp4"
                    isAlert={true}
                    onOpenIncidentDetails={handleOpenIncidentDetailsInNewTab}
                    canClosePanel={false}
                  />
                </section>
              </div>
              <AlertCardPanel activeAlert={activeAlert} recentAlerts={recentAlerts} />
            </div>
          ) : (
            <div className="main-content__inner">
              <CameraThumbnailBar onChipClick={handleChipClick} />

              <section
                className={`video-section video-section--dashboard${layout2VideoPanels.length === 1 ? ' video-section--one-panel' : ''}`}
                aria-label="Video monitoring panels"
              >
                {layout2VideoPanels.map((panel) => (
                  <VideoPanel
                    key={panel.id}
                    cameraName={panel.cameraName}
                    breadcrumb={panel.breadcrumb}
                    feedImage={panel.feedImage}
                    feedVideo={panel.feedVideo}
                    isAlert={panel.isAlert}
                    onOpenIncidentDetails={handleOpenIncidentDetailsInNewTab}
                    onClosePanel={() => handleCloseDashboardVideoPanel(panel.id)}
                    canClosePanel={layout2VideoPanels.length > 1}
                  />
                ))}
              </section>

              <AlertTable onViewRecording={handleOpenIncidentDetailsInNewTab} />
            </div>
          )}
        </main>
      </div>

      <AlertToast onViewDetails={handleOpenIncidentDetailsInNewTab} />
    </div>
  );
}

export default App;

