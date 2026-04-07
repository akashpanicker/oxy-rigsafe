import { useEffect, useRef, useState, useMemo } from 'react';
import CameraThumbnail from './CameraThumbnail';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';
import { useRigFilter } from '../store/rigFilterStore';

interface Camera {
  id: number;
  name: string;
  image: string;
  video?: string;
  isAlert: boolean;
  hasDetection: boolean;
}

const cameras: Camera[] = [
  { id: 1, name: 'Camera 01', image: '/assets/images/camera-01.png', isAlert: false, hasDetection: false },
  { id: 2, name: 'Camera 02', image: '/assets/images/camera-02.png', isAlert: false, hasDetection: false },
  { id: 3, name: 'Camera 03', image: '/assets/images/camera-03.png', isAlert: false, hasDetection: false },
  { id: 4, name: 'Camera 04', image: '/assets/images/camera-04.png', video: '/assets/images/Rig video 1.mp4', isAlert: true, hasDetection: true },
  { id: 5, name: 'Camera 05', image: '/assets/images/camera-05.png', isAlert: false, hasDetection: false },
  { id: 6, name: 'Camera 06', image: '/assets/images/camera-06.png', isAlert: false, hasDetection: false },
];

interface RigNode {
  id: string;
  name: string;
}

interface SiteNode {
  id: string;
  name: string;
  rigs: RigNode[];
}

interface RegionNode {
  id: string;
  name: string;
  sites: SiteNode[];
}

const THUMBNAIL_HIERARCHY_DATA: RegionNode[] = [
  {
    id: 'east',
    name: 'East',
    sites: [
      {
        id: 'site-1',
        name: 'Site 1',
        rigs: [
          { id: 'rig-145', name: 'Rig 145' },
          { id: 'rig-146', name: 'Rig 146' },
        ],
      },
      {
        id: 'site-2',
        name: 'Site 2',
        rigs: [{ id: 'rig-147', name: 'Rig 147' }],
      },
      {
        id: 'site-3',
        name: 'Site 3',
        rigs: [{ id: 'rig-148', name: 'Rig 148' }],
      },
      {
        id: 'site-4',
        name: 'Site 4',
        rigs: [
          { id: 'rig-149', name: 'Rig 149' },
          { id: 'rig-150', name: 'Rig 150' },
        ],
      },
    ],
  },
  {
    id: 'west',
    name: 'West',
    sites: [
      {
        id: 'site-5',
        name: 'Site 5',
        rigs: [
          { id: 'rig-151', name: 'Rig 151' },
          { id: 'rig-152', name: 'Rig 152' },
        ],
      },
      {
        id: 'site-6',
        name: 'Site 6',
        rigs: [{ id: 'rig-153', name: 'Rig 153' }],
      },
      {
        id: 'site-7',
        name: 'Site 7',
        rigs: [{ id: 'rig-154', name: 'Rig 154' }],
      },
      {
        id: 'site-8',
        name: 'Site 8',
        rigs: [{ id: 'rig-155', name: 'Rig 155' }],
      },
    ],
  },
  {
    id: 'north',
    name: 'North',
    sites: [
      {
        id: 'site-9',
        name: 'Site 9',
        rigs: [{ id: 'rig-156', name: 'Rig 156' }],
      },
      {
        id: 'site-10',
        name: 'Site 10',
        rigs: [
          { id: 'rig-157', name: 'Rig 157' },
          { id: 'rig-158', name: 'Rig 158' },
        ],
      },
      {
        id: 'site-11',
        name: 'Site 11',
        rigs: [{ id: 'rig-159', name: 'Rig 159' }],
      },
      {
        id: 'site-12',
        name: 'Site 12',
        rigs: [{ id: 'rig-160', name: 'Rig 160' }],
      },
    ],
  },
  {
    id: 'south',
    name: 'South',
    sites: [
      {
        id: 'site-13',
        name: 'Site 13',
        rigs: [{ id: 'rig-161', name: 'Rig 161' }],
      },
      {
        id: 'site-14',
        name: 'Site 14',
        rigs: [{ id: 'rig-162', name: 'Rig 162' }],
      },
      {
        id: 'site-15',
        name: 'Site 15',
        rigs: [
          { id: 'rig-163', name: 'Rig 163' },
          { id: 'rig-164', name: 'Rig 164' },
        ],
      },
      {
        id: 'site-16',
        name: 'Site 16',
        rigs: [{ id: 'rig-165', name: 'Rig 165' }],
      },
    ],
  },
];

interface CameraThumbnailBarProps {
  onChipClick?: () => void;
}

function CameraThumbnailBar({ onChipClick }: CameraThumbnailBarProps) {
  const { isInScope, selectedCount, buildScopeText } = useRigFilter();
  const [activeCamera, setActiveCamera] = useState<number>(1);
  const [isHierarchyOpen, setIsHierarchyOpen] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('east');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('site-1');
  const [selectedRigId, setSelectedRigId] = useState<string>('rig-145');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedRigId, setFocusedRigId] = useState<string | null>(null);

  const hierarchyRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hierarchyRef.current && !hierarchyRef.current.contains(event.target as Node)) {
        setIsHierarchyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isHierarchyOpen) {
      if (searchInputRef.current) searchInputRef.current.focus();
      
      // Auto-focus the currently selected rig when opening
      if (!focusedRigId) {
        setFocusedRigId(selectedRigId);
        const r = THUMBNAIL_HIERARCHY_DATA.find(r => r.sites.some(s => s.rigs.some(rig => rig.id === selectedRigId)));
        if (r) {
          setSelectedRegionId(r.id);
          const s = r.sites.find(s => s.rigs.some(rig => rig.id === selectedRigId));
          if (s) setSelectedSiteId(s.id);
        }
      }
    } else {
      setSearchQuery('');
      setFocusedRigId(null);
    }
  }, [isHierarchyOpen]);

  const filteredTree = useMemo(() => {
    if (!searchQuery) return THUMBNAIL_HIERARCHY_DATA;
    const q = searchQuery.toLowerCase();

    return THUMBNAIL_HIERARCHY_DATA.map(region => {
      const regionMatches = region.name.toLowerCase().includes(q);
      const sites = region.sites.map(site => {
        const siteMatches = site.name.toLowerCase().includes(q);
        const rigs = site.rigs.filter(rig => rig.name.toLowerCase().includes(q) || siteMatches || regionMatches);
        
        if (rigs.length > 0 || siteMatches || regionMatches) {
          return { ...site, rigs };
        }
        return null;
      }).filter(Boolean) as SiteNode[];

      if (sites.length > 0 || regionMatches) {
        return { ...region, sites };
      }
      return null;
    }).filter(Boolean) as RegionNode[];
  }, [searchQuery]);

  const flatMatchedRigs = useMemo(() => {
    return filteredTree.flatMap(r => 
      r.sites.flatMap(s => 
        s.rigs.map(rig => ({ rig, siteId: s.id, regionId: r.id }))
      )
    );
  }, [filteredTree]);

  // When search query changes, auto-focus the first rig
  useEffect(() => {
    if (isHierarchyOpen && searchQuery) {
      if (flatMatchedRigs.length > 0) {
        // If current focused is still in list, keep it. Else select first.
        if (!focusedRigId || !flatMatchedRigs.find(item => item.rig.id === focusedRigId)) {
          setFocusedRigId(flatMatchedRigs[0].rig.id);
        }
      } else {
        setFocusedRigId(null);
      }
    }
  }, [searchQuery, isHierarchyOpen]);

  // When focusedRigId changes, auto-update selected Region and Site so the third column shows it
  useEffect(() => {
    if (isHierarchyOpen && focusedRigId) {
      const match = flatMatchedRigs.find(item => item.rig.id === focusedRigId);
      if (match) {
        setSelectedRegionId(match.regionId);
        setSelectedSiteId(match.siteId);
      }
    }
  }, [focusedRigId, isHierarchyOpen, flatMatchedRigs]);

  const handleRigSelect = (rigId: string) => {
    setSelectedRigId(rigId);
    setIsHierarchyOpen(false);
  };

  const handleRegionHover = (regionId: string) => {
    const nextRegion = filteredTree.find((region) => region.id === regionId);
    const firstSite = nextRegion?.sites[0];
    const firstRig = firstSite?.rigs[0];

    setSelectedRegionId(regionId);
    setSelectedSiteId(firstSite?.id ?? '');
    setFocusedRigId(firstRig?.id ?? null);
  };

  const handleSiteHover = (siteId: string) => {
    const currentRegion = filteredTree.find((region) => region.id === selectedRegionId);
    const nextSite = currentRegion?.sites.find((site) => site.id === siteId);
    
    setSelectedSiteId(siteId);
    setFocusedRigId(nextSite?.rigs[0]?.id ?? null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isHierarchyOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatMatchedRigs.length > 0) {
        const idx = flatMatchedRigs.findIndex(item => item.rig.id === focusedRigId);
        const nextIdx = (idx + 1) % flatMatchedRigs.length;
        setFocusedRigId(flatMatchedRigs[nextIdx].rig.id);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatMatchedRigs.length > 0) {
        const idx = flatMatchedRigs.findIndex(item => item.rig.id === focusedRigId);
        const prevIdx = (idx - 1 + flatMatchedRigs.length) % flatMatchedRigs.length;
        setFocusedRigId(flatMatchedRigs[prevIdx].rig.id);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatMatchedRigs.length === 1) {
        handleRigSelect(flatMatchedRigs[0].rig.id);
      } else if (focusedRigId) {
        handleRigSelect(focusedRigId);
      }
    }
  };

  const highlightMatch = (text: string) => {
    if (!searchQuery) return text;
    const index = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span style={{ color: 'var(--primary-1)', fontWeight: 600 }}>{text.substring(index, index + searchQuery.length)}</span>
        {text.substring(index + searchQuery.length)}
      </>
    );
  };

  const currentRigName = THUMBNAIL_HIERARCHY_DATA.flatMap(r => r.sites).flatMap(s => s.rigs).find(r => r.id === selectedRigId)?.name;

  const currentRegion = filteredTree.find((region) => region.id === selectedRegionId);
  const currentSite = currentRegion?.sites.find((site) => site.id === selectedSiteId);

  return (
    <section className="thumbnail-section" aria-label="Camera thumbnails">
      <div className="thumbnail-section__top">
        <div className="hierarchy-dropdown" ref={hierarchyRef}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="thumbnail-section__dropdown"
                type="button"
                aria-label="Select rig hierarchy"
                aria-haspopup="true"
                aria-expanded={isHierarchyOpen}
                onClick={() => {
                  setIsHierarchyOpen(prev => !prev);
                  if (!isHierarchyOpen) {
                    setSearchQuery('');
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentRigName ?? 'Select rig'}</span>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Select a rig to show its camera thumbnails</TooltipContent>
          </Tooltip>

          {isHierarchyOpen && (
            <div className="hierarchy-dropdown__menu" style={{ flexDirection: 'column', padding: 0, zIndex: 1000 }}>
              <div style={{ position: 'relative', borderBottom: '1px solid var(--surface-4)', backgroundColor: 'var(--surface-2)', padding: '12px' }}>
                <span style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search rigs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: '100%',
                    height: '34px',
                    padding: '0 16px 0 36px',
                    backgroundColor: 'var(--surface-3)',
                    border: '1px solid var(--surface-4)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-1)',
                    fontSize: 'var(--font-size-sm)',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {filteredTree.length === 0 ? (
                  <div className="hierarchy-dropdown__empty" style={{ width: '100%', padding: '24px' }}>No rigs found</div>
                ) : (
                  <>
                    <div className="hierarchy-dropdown__column">
                      {filteredTree.map((region) => (
                        <button
                          key={region.id}
                          type="button"
                          className={`hierarchy-dropdown__item ${selectedRegionId === region.id ? 'hierarchy-dropdown__item--selected' : ''}`}
                          onMouseEnter={() => handleRegionHover(region.id)}
                        >
                          <span>{highlightMatch(region.name)}</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      ))}
                    </div>

                    <div className="hierarchy-dropdown__column">
                      {(currentRegion?.sites ?? []).length > 0 ? (
                        currentRegion?.sites.map((site) => (
                          <button
                            key={site.id}
                            type="button"
                            className={`hierarchy-dropdown__item ${selectedSiteId === site.id ? 'hierarchy-dropdown__item--selected' : ''}`}
                            onMouseEnter={() => handleSiteHover(site.id)}
                          >
                            <span>{highlightMatch(site.name)}</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        ))
                      ) : (
                        <div className="hierarchy-dropdown__empty">No sites</div>
                      )}
                    </div>

                    <div className="hierarchy-dropdown__column">
                      {(currentSite?.rigs ?? []).length > 0 ? (
                        currentSite?.rigs.map((rig) => (
                          <button
                            key={rig.id}
                            type="button"
                            className={`hierarchy-dropdown__item ${rig.id === focusedRigId ? 'hierarchy-dropdown__item--selected' : ''}`}
                            onMouseEnter={() => setFocusedRigId(rig.id)}
                            onClick={() => handleRigSelect(rig.id)}
                          >
                            <span>{highlightMatch(rig.name)}</span>
                          </button>
                        ))
                      ) : (
                        <div className="hierarchy-dropdown__empty">No rigs</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedCount > 0 && (() => {
          const full = buildScopeText();
          const chipText = full.startsWith('My Rigs: ') ? full.slice('My Rigs: '.length) : full;
          return (
            <div className="scope-chip" role="button" tabIndex={0} aria-label={`Active rig filter: ${chipText}`} onClick={onChipClick} onKeyDown={e => e.key === 'Enter' && onChipClick?.()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>{chipText}</span>
            </div>
          );
        })()}
      </div>

      {selectedCount > 0 && !isInScope(selectedRigId) && (
        <div className="thumbnail-bar__filter-notice">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Selected rig is outside the My Rigs filter</span>
        </div>
      )}

      <div className="thumbnail-bar" role="listbox" aria-label="Camera feed thumbnails">
        {cameras.map((camera) => (
          <CameraThumbnail
            key={camera.id}
            name={camera.name}
            image={camera.image}
            video={camera.video}
            isActive={activeCamera === camera.id}
            isAlert={camera.isAlert}
            hasDetection={camera.hasDetection}
            onClick={() => setActiveCamera(camera.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default CameraThumbnailBar;
