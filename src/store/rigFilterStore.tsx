import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

// ── Hierarchy data ────────────────────────────────────────────────────────────
// Mirrors CameraThumbnailBar + alerts.ts rig IDs so isInScope works across all
// three consumers (AlertTable, AlertToast, CameraThumbnailBar).

export interface HierarchyRig    { id: string; name: string; }
export interface HierarchySite   { id: string; name: string; rigs: HierarchyRig[]; }
export interface HierarchyRegion { id: string; name: string; sites: HierarchySite[]; }

export const RIG_HIERARCHY: HierarchyRegion[] = [
  {
    id: 'east', name: 'East',
    sites: [
      { id: 'east-s1',  name: 'Site 1',  rigs: [{ id: 'rig-145', name: 'Rig 145' }, { id: 'rig-146', name: 'Rig 146' }] },
      { id: 'east-s2',  name: 'Site 2',  rigs: [{ id: 'rig-147', name: 'Rig 147' }] },
      { id: 'east-s3',  name: 'Site 3',  rigs: [{ id: 'rig-148', name: 'Rig 148' }] },
      { id: 'east-s4',  name: 'Site 4',  rigs: [{ id: 'rig-149', name: 'Rig 149' }, { id: 'rig-150', name: 'Rig 150' }] },
    ],
  },
  {
    id: 'west', name: 'West',
    sites: [
      { id: 'west-s5',  name: 'Site 5',  rigs: [{ id: 'rig-151', name: 'Rig 151' }, { id: 'rig-152', name: 'Rig 152' }] },
      { id: 'west-s6',  name: 'Site 6',  rigs: [{ id: 'rig-153', name: 'Rig 153' }] },
      { id: 'west-s7',  name: 'Site 7',  rigs: [{ id: 'rig-154', name: 'Rig 154' }] },
      { id: 'west-s8',  name: 'Site 8',  rigs: [{ id: 'rig-155', name: 'Rig 155' }] },
    ],
  },
  {
    id: 'north', name: 'North',
    sites: [
      { id: 'north-s9',  name: 'Site 9',  rigs: [{ id: 'rig-156', name: 'Rig 156' }] },
      { id: 'north-s10', name: 'Site 10', rigs: [{ id: 'rig-157', name: 'Rig 157' }, { id: 'rig-158', name: 'Rig 158' }] },
      { id: 'north-s11', name: 'Site 11', rigs: [{ id: 'rig-159', name: 'Rig 159' }] },
      { id: 'north-s12', name: 'Site 12', rigs: [{ id: 'rig-160', name: 'Rig 160' }] },
    ],
  },
  {
    id: 'south', name: 'South',
    sites: [
      { id: 'south-s13', name: 'Site 13', rigs: [{ id: 'rig-161', name: 'Rig 161' }] },
      { id: 'south-s14', name: 'Site 14', rigs: [{ id: 'rig-162', name: 'Rig 162' }] },
      { id: 'south-s15', name: 'Site 15', rigs: [{ id: 'rig-163', name: 'Rig 163' }, { id: 'rig-164', name: 'Rig 164' }] },
      { id: 'south-s16', name: 'Site 16', rigs: [{ id: 'rig-165', name: 'Rig 165' }] },
    ],
  },
];

// ── Normalisation helper ──────────────────────────────────────────────────────
// "Rig 145" → "rig-145"   "Rig-145" → "rig-145"   "rig-145" → "rig-145"
export function normalizeRigId(rigName: string): string {
  return rigName.toLowerCase().replace(/\s+/g, '-');
}

// ── Hierarchy lookups ─────────────────────────────────────────────────────────
function getSiteRigIds(siteId: string): string[] {
  for (const region of RIG_HIERARCHY)
    for (const site of region.sites)
      if (site.id === siteId) return site.rigs.map(r => r.id);
  return [];
}

function getRegionRigIds(regionId: string): string[] {
  const region = RIG_HIERARCHY.find(r => r.id === regionId);
  return region ? region.sites.flatMap(s => s.rigs.map(r => r.id)) : [];
}

// ── localStorage persistence ──────────────────────────────────────────────────
const LS_KEY = 'rigFilter_selectedRigIds';

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
}

function saveToStorage(ids: Set<string>): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify([...ids])); } catch { /* ignore */ }
}

// ── Context ───────────────────────────────────────────────────────────────────
interface RigFilterContextValue {
  selectedRigIds:    Set<string>;
  selectedCount:     number;
  isMyRigsExpanded:  boolean;
  setMyRigsExpanded: (expanded: boolean) => void;
  toggleRig:         (rigId: string) => void;
  toggleSite:        (siteId: string) => void;
  toggleRegion:      (regionId: string) => void;
  resetFilter:       () => void;
  /** true when no filter is set OR the rig is in the selected set */
  isInScope:         (rigNameOrId: string) => boolean;
  getRigState:    (rigId: string) => boolean;
  getSiteState:   (siteId: string) => 'all' | 'some' | 'none';
  getRegionState: (regionId: string) => 'all' | 'some' | 'none';
  buildScopeText: () => string;
}

const RigFilterContext = createContext<RigFilterContextValue | null>(null);

export function RigFilterProvider({ children }: { children: ReactNode }) {
  const [selectedRigIds, setSelectedRigIds] = useState<Set<string>>(loadFromStorage);
  const [isMyRigsExpanded, setIsMyRigsExpandedState] = useState(false);

  const setMyRigsExpanded = useCallback((expanded: boolean) => {
    setIsMyRigsExpandedState(expanded);
  }, []);

  const updateIds = useCallback((updater: (prev: Set<string>) => Set<string>) => {
    setSelectedRigIds(prev => {
      const next = updater(prev);
      saveToStorage(next);
      return next;
    });
  }, []);

  const toggleRig = useCallback((rigId: string) => {
    updateIds(prev => {
      const next = new Set(prev);
      if (next.has(rigId)) next.delete(rigId); else next.add(rigId);
      return next;
    });
  }, [updateIds]);

  const toggleSite = useCallback((siteId: string) => {
    const siteRigs = getSiteRigIds(siteId);
    updateIds(prev => {
      const allSelected = siteRigs.every(id => prev.has(id));
      const next = new Set(prev);
      if (allSelected) siteRigs.forEach(id => next.delete(id));
      else             siteRigs.forEach(id => next.add(id));
      return next;
    });
  }, [updateIds]);

  const toggleRegion = useCallback((regionId: string) => {
    const regionRigs = getRegionRigIds(regionId);
    updateIds(prev => {
      const allSelected = regionRigs.every(id => prev.has(id));
      const next = new Set(prev);
      if (allSelected) regionRigs.forEach(id => next.delete(id));
      else             regionRigs.forEach(id => next.add(id));
      return next;
    });
  }, [updateIds]);

  const resetFilter = useCallback(() => {
    updateIds(() => new Set());
  }, [updateIds]);

  const isInScope = useCallback((rigNameOrId: string): boolean => {
    if (selectedRigIds.size === 0) return true;
    return selectedRigIds.has(normalizeRigId(rigNameOrId));
  }, [selectedRigIds]);

  const getRigState = useCallback((rigId: string): boolean => {
    return selectedRigIds.has(rigId);
  }, [selectedRigIds]);

  const getSiteState = useCallback((siteId: string): 'all' | 'some' | 'none' => {
    const rigs = getSiteRigIds(siteId);
    if (rigs.length === 0) return 'none';
    const n = rigs.filter(id => selectedRigIds.has(id)).length;
    if (n === 0) return 'none';
    return n === rigs.length ? 'all' : 'some';
  }, [selectedRigIds]);

  const getRegionState = useCallback((regionId: string): 'all' | 'some' | 'none' => {
    const rigs = getRegionRigIds(regionId);
    if (rigs.length === 0) return 'none';
    const n = rigs.filter(id => selectedRigIds.has(id)).length;
    if (n === 0) return 'none';
    return n === rigs.length ? 'all' : 'some';
  }, [selectedRigIds]);

  const buildScopeText = useCallback((): string => {
    if (selectedRigIds.size === 0) return '';
    const parts: string[] = [];
    for (const region of RIG_HIERARCHY) {
      const activeSites: string[] = [];
      for (const site of region.sites) {
        if (site.rigs.some(r => selectedRigIds.has(r.id))) {
          activeSites.push(site.name.startsWith('Site ') ? 'S' + site.name.slice(5) : site.name);
        }
      }
      if (activeSites.length > 0) {
        const all = activeSites.length === region.sites.length;
        parts.push(all ? region.name : `${region.name} (${activeSites.join(', ')})`);
      }
    }
    const n = selectedRigIds.size;
    return `My Rigs: ${parts.join(' \u00b7 ')} \u2014 ${n} rig${n !== 1 ? 's' : ''}`;
  }, [selectedRigIds]);

  return (
    <RigFilterContext.Provider value={{
      selectedRigIds,
      selectedCount: selectedRigIds.size,
      isMyRigsExpanded,
      setMyRigsExpanded,
      toggleRig,
      toggleSite,
      toggleRegion,
      resetFilter,
      isInScope,
      getRigState,
      getSiteState,
      getRegionState,
      buildScopeText,
    }}>
      {children}
    </RigFilterContext.Provider>
  );
}

export function useRigFilter(): RigFilterContextValue {
  const ctx = useContext(RigFilterContext);
  if (!ctx) throw new Error('useRigFilter must be used within RigFilterProvider');
  return ctx;
}
