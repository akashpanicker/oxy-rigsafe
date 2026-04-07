import { useEffect, useState } from 'react';
import MyRigsSection from './MyRigsSection';

interface SidebarProps {
  isOpen: boolean;
  activeLayout: string;
  onLayoutChange: (layout: string) => void;
  hideLayouts?: boolean;
}

function Sidebar({ isOpen, activeLayout, onLayoutChange, hideLayouts = false }: SidebarProps) {
  const [isCameraExpanded, setIsCameraExpanded] = useState(true);
  const [isLayoutsExpanded, setIsLayoutsExpanded] = useState(true); // Default to true for easier access during development
  
  // Sub-section states — East
  const [isEastExpanded, setIsEastExpanded] = useState(true);
  const [isSite1Expanded, setIsSite1Expanded] = useState(true);
  const [isRig145Expanded, setIsRig145Expanded] = useState(true);

  // Sub-section states — West
  const [isWestExpanded, setIsWestExpanded] = useState(false);
  const [isWestSite1Expanded, setIsWestSite1Expanded] = useState(false);
  const [isWestRig250Expanded, setIsWestRig250Expanded] = useState(false);

  // Sub-section states — North
  const [isNorthExpanded, setIsNorthExpanded] = useState(false);
  const [isNorthSite1Expanded, setIsNorthSite1Expanded] = useState(false);
  const [isNorthRig350Expanded, setIsNorthRig350Expanded] = useState(false);

  // Sub-section states — South
  const [isSouthExpanded, setIsSouthExpanded] = useState(false);
  const [isSouthSite1Expanded, setIsSouthSite1Expanded] = useState(false);
  const [isSouthRig450Expanded, setIsSouthRig450Expanded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsCameraExpanded(false);
      setIsLayoutsExpanded(false);
      setIsEastExpanded(false);
      setIsSite1Expanded(false);
      setIsRig145Expanded(false);
      setIsWestExpanded(false);
      setIsWestSite1Expanded(false);
      setIsWestRig250Expanded(false);
      setIsNorthExpanded(false);
      setIsNorthSite1Expanded(false);
      setIsNorthRig350Expanded(false);
      setIsSouthExpanded(false);
      setIsSouthSite1Expanded(false);
      setIsSouthRig450Expanded(false);
    }
  }, [isOpen]);

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__content">
        {/* My Rigs Section */}
        <MyRigsSection />

        {/* Select Camera Section */}
        <div className="sidebar__section">
          <button 
            className="sidebar__section-header" 
            onClick={() => setIsCameraExpanded(!isCameraExpanded)}
          >
            <div className="sidebar__section-title">
              <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12V4H12" />
                <path d="M12 20H20V12" />
                <rect x="2" y="14" width="8" height="8" />
                <rect x="14" y="2" width="8" height="8" />
              </svg>
              <span>Select Camera</span>
            </div>
            <svg
              className={`sidebar__chevron ${isCameraExpanded ? 'sidebar__chevron--expanded' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {isCameraExpanded && (
            <div className="sidebar__tree">
              {/* East Region */}
              <div
                className="sidebar__tree-item sidebar__tree-item--region"
                onClick={() => setIsEastExpanded(!isEastExpanded)}
              >
                <svg
                  className={`sidebar__chevron ${isEastExpanded ? 'sidebar__chevron--expanded' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <span>East</span>
              </div>

              {/* Site 1 */}
              {isEastExpanded && (
                <div className="sidebar__tree-group">
                  <div
                    className="sidebar__tree-item sidebar__tree-item--site"
                    onClick={() => setIsSite1Expanded(!isSite1Expanded)}
                  >
                    <svg
                      className={`sidebar__chevron ${isSite1Expanded ? 'sidebar__chevron--expanded' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span>Site 1</span>
                  </div>

                  {/* Rig-145 */}
                  {isSite1Expanded && (
                    <div className="sidebar__tree-group">
                      <div
                        className="sidebar__tree-item sidebar__tree-item--rig"
                        onClick={() => setIsRig145Expanded(!isRig145Expanded)}
                      >
                        <svg
                          className={`sidebar__chevron ${isRig145Expanded ? 'sidebar__chevron--expanded' : ''}`}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span>Rig-145</span>
                      </div>

                      {/* Cameras */}
                      {isRig145Expanded && (
                        <div className="sidebar__tree-cameras">
                          <div className="sidebar__camera-item">
                            <svg className="sidebar__camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            <span>Cam 01 – Drill Floor</span>
                          </div>
                          <div className="sidebar__camera-item sidebar__camera-item--active">
                            <svg className="sidebar__camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            <span>Cam 04 - Pipe Deck</span>
                          </div>
                          <div className="sidebar__camera-item">
                            <svg className="sidebar__camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            <span>Cam 03 – Mud Pumps</span>
                          </div>
                          <div className="sidebar__camera-item">
                            <svg className="sidebar__camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            <span>Cam 04 – Mud Pumps</span>
                          </div>
                          <div className="sidebar__camera-item">
                            <svg className="sidebar__camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            <span>Cam 05 – Mud Pumps</span>
                          </div>
                        </div>
                      )}

                      <div className="sidebar__tree-item sidebar__tree-item--rig">
                        <svg className="sidebar__chevron sidebar__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span>Rig-146</span>
                      </div>
                      <div className="sidebar__tree-item sidebar__tree-item--rig">
                        <svg className="sidebar__chevron sidebar__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span>Rig-147</span>
                      </div>
                      <div className="sidebar__tree-item sidebar__tree-item--rig">
                        <svg className="sidebar__chevron sidebar__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span>Rig-148</span>
                      </div>
                      <div className="sidebar__tree-item sidebar__tree-item--rig">
                        <svg className="sidebar__chevron sidebar__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span>Rig-149</span>
                      </div>
                    </div>
                  )}
                  {/* Other Sites */}
                  {[2, 3, 4, 5, 6, 7, 8, 9].map(site => (
                    <div key={site} className="sidebar__tree-item sidebar__tree-item--site">
                      <svg className="sidebar__chevron sidebar__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      <span>Site {site}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* West Region */}
              <div
                className="sidebar__tree-item sidebar__tree-item--region"
                onClick={() => setIsWestExpanded(!isWestExpanded)}
              >
                <svg
                  className={`sidebar__chevron ${isWestExpanded ? 'sidebar__chevron--expanded' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <span>West</span>
              </div>

              {isWestExpanded && (
                <div className="sidebar__tree-group">
                  <div
                    className="sidebar__tree-item sidebar__tree-item--site"
                    onClick={() => setIsWestSite1Expanded(!isWestSite1Expanded)}
                  >
                    <svg
                      className={`sidebar__chevron ${isWestSite1Expanded ? 'sidebar__chevron--expanded' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span>Site 1</span>
                  </div>

                  {isWestSite1Expanded && (
                    <div className="sidebar__tree-group">
                      <div
                        className="sidebar__tree-item sidebar__tree-item--rig"
                        onClick={() => setIsWestRig250Expanded(!isWestRig250Expanded)}
                      >
                        <svg
                          className={`sidebar__chevron ${isWestRig250Expanded ? 'sidebar__chevron--expanded' : ''}`}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span>Rig-250</span>
                      </div>

                      {isWestRig250Expanded && (
                        <div className="sidebar__tree-cameras">
                          {['Cam 01 – Drill Floor', 'Cam 02 – Pipe Deck', 'Cam 03 – Mud Pumps', 'Cam 04 – Shaker Room', 'Cam 05 – Cellar Deck'].map(cam => (
                            <div key={cam} className="sidebar__camera-item">
                              <svg className="sidebar__camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" />
                              </svg>
                              <span>{cam}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {['Rig-251', 'Rig-252', 'Rig-253', 'Rig-254'].map(rig => (
                        <div key={rig} className="sidebar__tree-item sidebar__tree-item--rig">
                          <svg className="sidebar__chevron sidebar__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          <span>{rig}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {[2, 3, 4, 5, 6, 7, 8].map(site => (
                    <div key={site} className="sidebar__tree-item sidebar__tree-item--site">
                      <svg className="sidebar__chevron sidebar__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      <span>Site {site}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* North Region */}
              <div
                className="sidebar__tree-item sidebar__tree-item--region"
                onClick={() => setIsNorthExpanded(!isNorthExpanded)}
              >
                <svg
                  className={`sidebar__chevron ${isNorthExpanded ? 'sidebar__chevron--expanded' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <span>North</span>
              </div>

              {isNorthExpanded && (
                <div className="sidebar__tree-group">
                  <div
                    className="sidebar__tree-item sidebar__tree-item--site"
                    onClick={() => setIsNorthSite1Expanded(!isNorthSite1Expanded)}
                  >
                    <svg
                      className={`sidebar__chevron ${isNorthSite1Expanded ? 'sidebar__chevron--expanded' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span>Site 1</span>
                  </div>

                  {isNorthSite1Expanded && (
                    <div className="sidebar__tree-group">
                      <div
                        className="sidebar__tree-item sidebar__tree-item--rig"
                        onClick={() => setIsNorthRig350Expanded(!isNorthRig350Expanded)}
                      >
                        <svg
                          className={`sidebar__chevron ${isNorthRig350Expanded ? 'sidebar__chevron--expanded' : ''}`}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span>Rig-350</span>
                      </div>

                      {isNorthRig350Expanded && (
                        <div className="sidebar__tree-cameras">
                          {['Cam 01 – Drill Floor', 'Cam 02 – Pipe Deck', 'Cam 03 – Mud Pumps', 'Cam 04 – Shaker Room', 'Cam 05 – Cellar Deck'].map(cam => (
                            <div key={cam} className="sidebar__camera-item">
                              <svg className="sidebar__camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" />
                              </svg>
                              <span>{cam}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {['Rig-351', 'Rig-352', 'Rig-353', 'Rig-354'].map(rig => (
                        <div key={rig} className="sidebar__tree-item sidebar__tree-item--rig">
                          <svg className="sidebar__chevron sidebar__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          <span>{rig}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {[2, 3, 4, 5, 6].map(site => (
                    <div key={site} className="sidebar__tree-item sidebar__tree-item--site">
                      <svg className="sidebar__chevron sidebar__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      <span>Site {site}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* South Region */}
              <div
                className="sidebar__tree-item sidebar__tree-item--region"
                onClick={() => setIsSouthExpanded(!isSouthExpanded)}
              >
                <svg
                  className={`sidebar__chevron ${isSouthExpanded ? 'sidebar__chevron--expanded' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <span>South</span>
              </div>

              {isSouthExpanded && (
                <div className="sidebar__tree-group">
                  <div
                    className="sidebar__tree-item sidebar__tree-item--site"
                    onClick={() => setIsSouthSite1Expanded(!isSouthSite1Expanded)}
                  >
                    <svg
                      className={`sidebar__chevron ${isSouthSite1Expanded ? 'sidebar__chevron--expanded' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span>Site 1</span>
                  </div>

                  {isSouthSite1Expanded && (
                    <div className="sidebar__tree-group">
                      <div
                        className="sidebar__tree-item sidebar__tree-item--rig"
                        onClick={() => setIsSouthRig450Expanded(!isSouthRig450Expanded)}
                      >
                        <svg
                          className={`sidebar__chevron ${isSouthRig450Expanded ? 'sidebar__chevron--expanded' : ''}`}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span>Rig-450</span>
                      </div>

                      {isSouthRig450Expanded && (
                        <div className="sidebar__tree-cameras">
                          {['Cam 01 – Drill Floor', 'Cam 02 – Pipe Deck', 'Cam 03 – Mud Pumps', 'Cam 04 – Shaker Room', 'Cam 05 – Cellar Deck'].map(cam => (
                            <div key={cam} className="sidebar__camera-item">
                              <svg className="sidebar__camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" />
                              </svg>
                              <span>{cam}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {['Rig-451', 'Rig-452', 'Rig-453', 'Rig-454'].map(rig => (
                        <div key={rig} className="sidebar__tree-item sidebar__tree-item--rig">
                          <svg className="sidebar__chevron sidebar__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          <span>{rig}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {[2, 3, 4, 5].map(site => (
                    <div key={site} className="sidebar__tree-item sidebar__tree-item--site">
                      <svg className="sidebar__chevron sidebar__chevron--right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      <span>Site {site}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Predefined Layouts Section */}
        {!hideLayouts && <div className="sidebar__section">
          <button 
            className="sidebar__section-header" 
            onClick={() => setIsLayoutsExpanded(!isLayoutsExpanded)}
          >
            <div className="sidebar__section-title">
              <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Predefined Layouts</span>
            </div>
            <svg
              className={`sidebar__chevron ${isLayoutsExpanded ? 'sidebar__chevron--expanded' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {isLayoutsExpanded && (
            <div className="sidebar__tree">
              <div 
                className={`sidebar__tree-item ${activeLayout === 'Layout 1' ? 'sidebar__tree-item--active' : ''}`}
                onClick={() => onLayoutChange('Layout 1')}
              >
                <div className="sidebar__tree-item-content">
                  <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                  </svg>
                  <span>Layout 1</span>
                </div>
                {activeLayout === 'Layout 1' && (
                  <svg className="sidebar__check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div 
                className={`sidebar__tree-item ${activeLayout === 'Layout 2' ? 'sidebar__tree-item--active' : ''}`}
                onClick={() => onLayoutChange('Layout 2')}
              >
                <div className="sidebar__tree-item-content">
                  <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                  </svg>
                  <span>Layout 2</span>
                </div>
                {activeLayout === 'Layout 2' && (
                  <svg className="sidebar__check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>}
      </div>
    </aside>
  );
}

export default Sidebar;
