import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  pageTitle?: string;
  onLogoClick?: () => void;
}

function Header({ isSidebarOpen, onToggleSidebar, pageTitle = "Dashboard", onLogoClick }: HeaderProps) {
  return (
    <header className="header" role="banner">
      <div className="header__left">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="header__hamburger"
              aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={onToggleSidebar}
              type="button"
            >
              {isSidebarOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          </TooltipContent>
        </Tooltip>

        <div 
          className="header__logo" 
          onClick={onLogoClick} 
          style={{ cursor: onLogoClick ? 'pointer' : 'default' }}
          role={onLogoClick ? 'button' : undefined}
          tabIndex={onLogoClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (onLogoClick && (e.key === 'Enter' || e.key === ' ')) {
              onLogoClick();
            }
          }}
          aria-label={onLogoClick ? "Back to Dashboard" : undefined}
        >
          <img src="/assets/images/HP-Logo.png" alt="H&P Logo" className="header__logo-img" />
          <div className="header__logo-text">
            <span className="header__logo-title">H&amp;P RigSafe</span>
            <span className="header__logo-subtitle">{pageTitle}</span>
          </div>
        </div>
      </div>

      <div className="header__center">
        <div className="header__search">
          <span className="header__search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <Tooltip className="tooltip-root--block">
            <TooltipTrigger asChild>
              <input
                id="search-input"
                className="header__search-input"
                type="search"
                placeholder="Search"
                aria-label="Search rigs and cameras"
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">Search rigs, cameras, or incidents</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="header__right">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="header__realtime-badge" aria-live="polite" tabIndex={0}>
              <span className="header__realtime-dot" aria-hidden="true" />
              <span>Real time view</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Live monitoring mode</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="header__user" role="button" tabIndex={0} aria-label="User profile menu">
              <div className="header__avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="header__username">John Smith</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Account settings</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}

export default Header;
