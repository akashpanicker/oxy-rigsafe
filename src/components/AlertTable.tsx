import { useState } from 'react';
import AlertRow from './AlertRow';

import { alertData } from '../constants/alerts';
import { useRigFilter } from '../store/rigFilterStore';

interface AlertTableProps {
  onViewRecording?: () => void;
}

function AlertTable({ onViewRecording }: AlertTableProps) {
  const [activeView, setActiveView] = useState<'table' | 'card'>('table');
  const { isInScope } = useRigFilter();
  const criticalAlerts = alertData.filter((alert) => alert.status === 'critical' && isInScope(alert.rig));
  const warningAlerts  = alertData.filter((alert) => alert.status === 'warning'  && isInScope(alert.rig));
  const orderedAlerts  = [...criticalAlerts, ...warningAlerts];

  return (
    <section className="alerts-section" aria-label="Alert notifications">
      <div className="alerts-section__header">
        <h2 className="alerts-section__title">All Alert</h2>

        <div className="alerts-section__view-toggle" role="tablist" aria-label="View toggle">
          <button
            className={`alerts-section__view-btn${activeView === 'table' ? ' alerts-section__view-btn--active' : ''}`}
            onClick={() => setActiveView('table')}
            role="tab"
            aria-selected={activeView === 'table'}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="9" x2="9" y2="20" />
              <line x1="15" y1="9" x2="15" y2="20" />
            </svg>
            Table
          </button>
          <button
            className={`alerts-section__view-btn${activeView === 'card' ? ' alerts-section__view-btn--active' : ''}`}
            onClick={() => setActiveView('card')}
            role="tab"
            aria-selected={activeView === 'card'}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="5" width="7" height="14" rx="1.5" />
              <rect x="13" y="5" width="7" height="14" rx="1.5" />
            </svg>
            Card
          </button>
        </div>
      </div>

      <div className="alert-table-wrapper">
        <table className="alert-table" aria-label="Alerts list">
          <thead className="alert-table__head">
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Issue</th>
              <th scope="col">Active / Recent</th>
              <th scope="col">Event ID</th>
              <th scope="col">Region</th>
              <th scope="col">Site</th>
              <th scope="col">Rig</th>
              <th scope="col">Camera</th>
              <th scope="col">Date & Time</th>
              <th scope="col">Recording</th>
              <th scope="col">Acknowledge</th>
            </tr>
          </thead>
          <tbody className="alert-table__body">
            {orderedAlerts.map((alert, index) => (
              <AlertRow
                key={alert.id}
                status={alert.status}
                issue={alert.issue}
                activity={alert.activity}
                eventId={alert.eventId}
                region={alert.region}
                site={alert.site}
                rig={alert.rig}
                camera={alert.camera}
                dateTime={alert.dateTime}
                onViewRecording={onViewRecording}
                isStickyCritical={index === 0 && alert.status === 'critical'}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AlertTable;
