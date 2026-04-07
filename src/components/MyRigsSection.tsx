import { useEffect, useRef, useState } from 'react';
import { RIG_HIERARCHY, useRigFilter } from '../store/rigFilterStore';

// ── Indeterminate checkbox ────────────────────────────────────────────────────
interface IndeterminateCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
}

function IndeterminateCheckbox({ checked, indeterminate, onChange }: IndeterminateCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className="myRigs__checkbox"
      checked={checked}
      onChange={onChange}
      onClick={e => e.stopPropagation()}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function MyRigsSection() {
  const {
    isMyRigsExpanded,
    setMyRigsExpanded,
    toggleRig,
    toggleSite,
    toggleRegion,
    resetFilter,
    getRigState,
    getSiteState,
    getRegionState,
    selectedCount,
  } = useRigFilter();

  const [regionExpanded, setRegionExpanded] = useState<Record<string, boolean>>({});
  const [siteExpanded,   setSiteExpanded]   = useState<Record<string, boolean>>({});

  const toggleRegionExpanded = (id: string) =>
    setRegionExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleSiteExpanded = (id: string) =>
    setSiteExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="sidebar__section">
      {/* Section header */}
      <button
        className="sidebar__section-header"
        onClick={() => setMyRigsExpanded(!isMyRigsExpanded)}
        type="button"
      >
        <div className="sidebar__section-title">
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
            <polyline points="16 2 12 6 8 2" />
          </svg>
          <span>My Rigs</span>
          {selectedCount > 0 && (
            <span className="myRigs__badge">{selectedCount}</span>
          )}
        </div>
        <svg
          className={`sidebar__chevron ${isMyRigsExpanded ? 'sidebar__chevron--expanded' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {isMyRigsExpanded && (
        <>
          <div className="sidebar__tree">
            {RIG_HIERARCHY.map(region => {
              const regionState  = getRegionState(region.id);
              const isExpanded   = !!regionExpanded[region.id];

              return (
                <div key={region.id}>
                  {/* Region row */}
                  <div className="myRigs__row myRigs__row--region">
                    <IndeterminateCheckbox
                      checked={regionState === 'all'}
                      indeterminate={regionState === 'some'}
                      onChange={() => toggleRegion(region.id)}
                    />
                    <div
                      className="myRigs__label"
                      onClick={() => toggleRegionExpanded(region.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && toggleRegionExpanded(region.id)}
                    >
                      <svg
                        className={`sidebar__chevron ${isExpanded ? 'sidebar__chevron--expanded' : ''}`}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>{region.name}</span>
                    </div>
                  </div>

                  {isExpanded && region.sites.map(site => {
                    const siteState     = getSiteState(site.id);
                    const isSiteExpanded = !!siteExpanded[site.id];

                    return (
                      <div key={site.id}>
                        {/* Site row */}
                        <div className="myRigs__row myRigs__row--site">
                          <IndeterminateCheckbox
                            checked={siteState === 'all'}
                            indeterminate={siteState === 'some'}
                            onChange={() => toggleSite(site.id)}
                          />
                          <div
                            className="myRigs__label"
                            onClick={() => toggleSiteExpanded(site.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && toggleSiteExpanded(site.id)}
                          >
                            <svg
                              className={`sidebar__chevron ${isSiteExpanded ? 'sidebar__chevron--expanded' : ''}`}
                              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            <span>{site.name}</span>
                          </div>
                        </div>

                        {isSiteExpanded && site.rigs.map(rig => (
                          <div key={rig.id} className="myRigs__row myRigs__row--rig">
                            <input
                              type="checkbox"
                              className="myRigs__checkbox"
                              checked={getRigState(rig.id)}
                              onChange={() => toggleRig(rig.id)}
                              onClick={e => e.stopPropagation()}
                            />
                            <span className="myRigs__rig-label">{rig.name}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Footer counter */}
          <div className="myRigs__footer">
            {selectedCount > 0 ? (
              <>
                <span className="myRigs__count">{selectedCount} rig{selectedCount !== 1 ? 's' : ''} selected</span>
                <button className="myRigs__reset" onClick={resetFilter} type="button">Reset</button>
              </>
            ) : (
              <span className="myRigs__count myRigs__count--empty">No filter active — showing all</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MyRigsSection;
