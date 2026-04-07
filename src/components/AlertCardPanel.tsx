import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';

interface AlertData {
  id: number;
  status: 'critical' | 'warning';
  issue: string;
  activity: string;
  eventId: string;
  region?: string;
  site?: string;
  rig: string;
  camera: string;
  dateTime: string;
  zoneType?: string;
  location?: string;
  confidence?: string;
}

interface StatusBadgeProps {
  status: 'critical' | 'warning';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const label = status === 'critical' ? 'CRITICAL' : 'WARNING';
  const className = `status-badge status-badge--${status}`;
  
  return (
    <span className={className}>
      {label}
    </span>
  );
};

interface AlertCardHeaderProps {
  title: string;
  status: 'critical' | 'warning';
}

export const AlertCardHeader: React.FC<AlertCardHeaderProps> = ({ title, status }) => {
  return (
    <div className="alert-card__header">
      <h3 className="alert-card__title">{title}</h3>
      <StatusBadge status={status} />
    </div>
  );
};

interface AlertCardBodyProps {
  rig: string;
  eventId: string;
  cameraId: string;
  dateTime: string;
  zoneType: string;
  location: string;
  confidence?: string;
}

export const AlertCardBody: React.FC<AlertCardBodyProps> = ({
  rig,
  eventId,
  cameraId,
  dateTime,
  zoneType,
  location,
  confidence
}) => {
  const confidenceValue = confidence || '97%';

  return (
    <div className="alert-card__body">
      <div className="alert-card__row">
        <span className="alert-card__label">Location:</span>
        <span className="alert-card__value">{location}</span>
      </div>
      <div className="alert-card__row">
        <span className="alert-card__label">Rig:</span>
        <span className="alert-card__value">{rig}</span>
      </div>
      <div className="alert-card__row">
        <span className="alert-card__label">Camera ID:</span>
        <span className="alert-card__value">{cameraId}</span>
      </div>
      <div className="alert-card__row">
        <span className="alert-card__label">Date & Time:</span>
        <span className="alert-card__value">{dateTime}</span>
      </div>
      <div className="alert-card__row">
        <span className="alert-card__label">Zone Type:</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="alert-card__value" tabIndex={0}>{zoneType}</span>
          </TooltipTrigger>
          <TooltipContent>Area classification used for safety monitoring</TooltipContent>
        </Tooltip>
      </div>
      <div className="alert-card__row">
        <span className="alert-card__label">Confidence:</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="alert-card__value" tabIndex={0}>{confidenceValue}</span>
          </TooltipTrigger>
          <TooltipContent>AI detection confidence score</TooltipContent>
        </Tooltip>
      </div>
      <div className="alert-card__row">
        <span className="alert-card__label">Event ID:</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="alert-card__value" tabIndex={0}>{eventId}</span>
          </TooltipTrigger>
          <TooltipContent>Unique identifier for this incident</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

interface AlertCardActionsProps {
  onViewRecording: () => void;
  onAcknowledge: () => void;
  onExportClip?: () => void;
}

export const AlertCardActions: React.FC<AlertCardActionsProps> = ({
  onViewRecording,
  onAcknowledge,
  onExportClip
}) => {
  return (
    <div className={`alert-card__actions ${onExportClip ? 'alert-card__actions--triple' : ''}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="alert-card__btn alert-card__btn--secondary" onClick={onViewRecording}>
            {onExportClip ? 'Play recording' : 'View Recording'}
          </button>
        </TooltipTrigger>
        <TooltipContent>Jump to this event in the video</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="alert-card__btn alert-card__btn--primary" onClick={onAcknowledge}>
            Acknowledge
          </button>
        </TooltipTrigger>
        <TooltipContent>Mark alert as acknowledged</TooltipContent>
      </Tooltip>
      {onExportClip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="alert-card__btn alert-card__btn--secondary" onClick={onExportClip}>
              Export clip
            </button>
          </TooltipTrigger>
          <TooltipContent>Download video segment</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

interface AlertCardProps {
  alert: AlertData;
  isHighlighted?: boolean;
  onViewRecording?: () => void;
  onAcknowledge?: () => void;
  onExportClip?: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ 
  alert, 
  isHighlighted,
  onViewRecording,
  onAcknowledge,
  onExportClip
}) => {
  const cameraDigits = alert.camera.match(/\d+/)?.[0] || '04';
  const cameraId = `Cam-${cameraDigits.padStart(2, '0')}`;
  const locationValue =
    alert.location ||
    (alert.region && alert.site ? `${alert.region} - ${alert.site}` : 'West - Midland Site');

  const handleViewRecording = () => {
    if (onViewRecording) {
      onViewRecording();
    } else {
      console.log(`View recording for alert ${alert.id}`);
    }
  };

  const handleAcknowledge = () => {
    if (onAcknowledge) {
      onAcknowledge();
    } else {
      console.log(`Acknowledge alert ${alert.id}`);
    }
  };

  const handleExportClip = () => {
    if (onExportClip) {
      onExportClip();
    } else {
      console.log(`Export clip for alert ${alert.id}`);
    }
  };

  return (
    <div className={`alert-card ${isHighlighted ? 'alert-card--highlighted' : ''}`}>
      <AlertCardHeader title={alert.issue} status={alert.status} />
      <AlertCardBody
        rig={alert.rig}
        eventId={alert.eventId}
        cameraId={cameraId}
        dateTime={alert.dateTime}
        zoneType={alert.zoneType || (alert.status === 'critical' ? 'Red Zone' : 'Yellow Zone')}
        location={locationValue}
        confidence={alert.confidence || '97%'}
      />
      <AlertCardActions
        onViewRecording={handleViewRecording}
        onAcknowledge={handleAcknowledge}
        onExportClip={onExportClip ? handleExportClip : undefined}
      />
    </div>
  );
};

interface AlertCardPanelProps {
  activeAlert: AlertData | null;
  recentAlerts: AlertData[];
}

export const AlertCardPanel: React.FC<AlertCardPanelProps> = ({ activeAlert, recentAlerts }) => {
  return (
    <aside className="alert-card-panel">
      <div className="alert-card-panel__section">
        <h2 className="alert-card-panel__title">Active Alert</h2>
        {activeAlert ? (
          <AlertCard alert={activeAlert} isHighlighted={true} />
        ) : (
          <p className="alert-card-panel__empty">No active alerts</p>
        )}
      </div>

      <div className="alert-card-panel__section">
        <h2 className="alert-card-panel__title">Recent Alerts</h2>
        <div className="alert-card-panel__list">
          {recentAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AlertCardPanel;
