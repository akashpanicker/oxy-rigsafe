interface CameraThumbnailProps {
  name: string;
  image: string;
  video?: string;
  isActive: boolean;
  isAlert: boolean;
  hasDetection: boolean;
  onClick: () => void;
}

function CameraThumbnail({
  name,
  image,
  video,
  isActive,
  isAlert,
  hasDetection,
  onClick,
}: CameraThumbnailProps) {
  const classNames = [
    'camera-thumbnail',
    isActive ? 'camera-thumbnail--active' : '',
    isAlert ? 'camera-thumbnail--alert' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={onClick}
      aria-label={`Select ${name}${isAlert ? ' - Alert detected' : ''}`}
      type="button"
    >
      {video ? (
        <video
          className="camera-thumbnail__image"
          src={video}
          poster={image}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img
          className="camera-thumbnail__image"
          src={image}
          alt={`Live feed from ${name}`}
          loading="lazy"
        />
      )}
      <span className="camera-thumbnail__label">{name}</span>
      <div className="camera-thumbnail__overlay" aria-hidden="true" />

      {hasDetection && (
        <div className="camera-thumbnail__detection" aria-label="Human detected">
          <span className="camera-thumbnail__detection-dot" />
          ALERT
        </div>
      )}
    </button>
  );
}

export default CameraThumbnail;
