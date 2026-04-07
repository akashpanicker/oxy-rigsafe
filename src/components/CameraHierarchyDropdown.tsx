import { useState, useRef, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';

interface Camera {
  id: string;
  name: string;
}

interface Rig {
  id: string;
  name: string;
  cameras?: Camera[];
}

interface Site {
  id: string;
  name: string;
  rigs?: Rig[];
}

interface Region {
  id: string;
  name: string;
  sites?: Site[];
}

const HIERARCHY_DATA: Region[] = [
  {
    id: 'east',
    name: 'East',
    sites: [
      {
        id: 'site-1',
        name: 'Site 1',
        rigs: [
          {
            id: 'rig-145',
            name: 'Rig 145',
            cameras: [
              { id: 'cam-01', name: 'Cam 01 – Drill Floor' },
              { id: 'cam-02', name: 'Cam 02 – Pipe Deck' },
              { id: 'cam-03', name: 'Cam 03 – Mud Pumps' },
              { id: 'cam-04', name: 'Camera 4' },
              { id: 'cam-05', name: 'Camera 5' },
              { id: 'cam-06', name: 'Camera 6' },
            ],
          },
        ],
      },
      {
        id: 'site-2',
        name: 'Site 2',
        rigs: [
          {
            id: 'rig-146',
            name: 'Rig 146',
            cameras: [
              { id: 'cam-07', name: 'Cam 02 – Pipe Deck' },
            ],
          },
        ],
      },
      { id: 'site-3', name: 'Site 3', rigs: [
        { id: 'rig-147', name: 'Rig 147', cameras: []}
      ] },
      { id: 'site-4', name: 'Site 4', rigs: [
        { id: 'rig-148', name: 'Rig 148', cameras: []}
      ] },
    ],
  },
  { id: 'west', name: 'West', sites: [] },
  { id: 'north', name: 'North', sites: [] },
  { id: 'south', name: 'South', sites: [] },
];

interface CameraHierarchyDropdownProps {
  selectedCameraName: string;
  onCameraSelect: (cameraName: string, breadcrumb: string) => void;
}

export function CameraHierarchyDropdown({ selectedCameraName, onCameraSelect }: CameraHierarchyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>('east');
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>('site-1');
  const [selectedRigId, setSelectedRigId] = useState<string | null>('rig-145');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRegion = HIERARCHY_DATA.find(r => r.id === selectedRegionId);
  const currentSite = currentRegion?.sites?.find(s => s.id === selectedSiteId);
  const currentRig = currentSite?.rigs?.find(r => r.id === selectedRigId);

  const handleCameraClick = (cameraName: string) => {
    const breadcrumb = `${currentRegion?.name} > ${currentSite?.name} > ${currentRig?.name} > ${cameraName}`;
    onCameraSelect(cameraName, breadcrumb);
    setIsOpen(false);
  };

  return (
    <div className="hierarchy-dropdown" ref={dropdownRef}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className="hierarchy-dropdown__trigger"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="true"
            aria-expanded={isOpen}
            type="button"
          >
            <span>{selectedCameraName}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent>Select camera</TooltipContent>
      </Tooltip>

      {isOpen && (
        <div className="hierarchy-dropdown__menu">
          {/* Level 1: Regions */}
          <div className="hierarchy-dropdown__column">
            {HIERARCHY_DATA.map(region => (
              <button 
                key={region.id}
                type="button"
                className={`hierarchy-dropdown__item ${selectedRegionId === region.id ? 'hierarchy-dropdown__item--selected' : ''}`}
                onMouseEnter={() => {
                  setSelectedRegionId(region.id);
                  setSelectedSiteId(region.sites?.[0]?.id || null);
                  setSelectedRigId(region.sites?.[0]?.rigs?.[0]?.id || null);
                }}
              >
                <span>{region.name}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>

          {/* Level 2: Sites */}
          <div className="hierarchy-dropdown__column">
            {(currentRegion?.sites || []).length > 0 ? currentRegion?.sites?.map(site => (
              <button 
                key={site.id}
                type="button"
                className={`hierarchy-dropdown__item ${selectedSiteId === site.id ? 'hierarchy-dropdown__item--selected' : ''}`}
                onMouseEnter={() => {
                  setSelectedSiteId(site.id);
                  setSelectedRigId(site.rigs?.[0]?.id || null);
                }}
              >
                <span>{site.name}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )) : (
              <div className="hierarchy-dropdown__empty">No sites</div>
            )}
          </div>

          {/* Level 3: Rigs */}
          <div className="hierarchy-dropdown__column">
            {(currentSite?.rigs || []).length > 0 ? currentSite?.rigs?.map(rig => (
              <button 
                key={rig.id}
                type="button"
                className={`hierarchy-dropdown__item ${selectedRigId === rig.id ? 'hierarchy-dropdown__item--selected' : ''}`}
                onMouseEnter={() => setSelectedRigId(rig.id)}
              >
                <span>{rig.name}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )) : (
              <div className="hierarchy-dropdown__empty">No rigs</div>
            )}
          </div>

          {/* Level 4: Cameras */}
          <div className="hierarchy-dropdown__column">
            {(currentRig?.cameras || []).length > 0 ? currentRig?.cameras?.map(camera => (
              <button 
                key={camera.id}
                type="button"
                className="hierarchy-dropdown__item"
                onClick={() => handleCameraClick(camera.name)}
              >
                <span>{camera.name}</span>
              </button>
            )) : (
              <div className="hierarchy-dropdown__empty">No cameras</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraHierarchyDropdown;
