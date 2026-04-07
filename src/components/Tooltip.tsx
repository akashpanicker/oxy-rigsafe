import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from 'react';

interface TooltipProviderContextValue {
  activeTooltipId: string | null;
  setActiveTooltipId: Dispatch<SetStateAction<string | null>>;
}

const TooltipProviderContext = createContext<TooltipProviderContextValue | null>(null);

interface TooltipProviderProps {
  children: ReactNode;
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveTooltipId(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const value = useMemo(
    () => ({ activeTooltipId, setActiveTooltipId }),
    [activeTooltipId]
  );

  return (
    <TooltipProviderContext.Provider value={value}>
      {children}
    </TooltipProviderContext.Provider>
  );
}

interface TooltipContextValue {
  tooltipId: string;
  contentId: string;
  isOpen: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
  openTooltip: () => void;
  requestCloseTooltip: () => void;
  closeTooltip: () => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipProviderContext() {
  const context = useContext(TooltipProviderContext);
  if (!context) {
    throw new Error('Tooltip components must be wrapped with TooltipProvider.');
  }
  return context;
}

function useTooltipContext() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('TooltipTrigger and TooltipContent must be used within Tooltip.');
  }
  return context;
}

interface TooltipProps {
  children: ReactNode;
  className?: string;
}

export function Tooltip({ children, className }: TooltipProps) {
  const { activeTooltipId, setActiveTooltipId } = useTooltipProviderContext();
  const tooltipId = useId();
  const contentId = `${tooltipId}-content`;
  const closeTimeoutRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openTooltip = () => {
    clearCloseTimeout();
    setActiveTooltipId(tooltipId);
  };

  const requestCloseTooltip = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveTooltipId((currentId) => (currentId === tooltipId ? null : currentId));
    }, 80);
  };

  const closeTooltip = () => {
    clearCloseTimeout();
    setActiveTooltipId((currentId) => (currentId === tooltipId ? null : currentId));
  };

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, []);

  const value = useMemo(
    () => ({
      tooltipId,
      contentId,
      isOpen: activeTooltipId === tooltipId,
      rootRef,
      openTooltip,
      requestCloseTooltip,
      closeTooltip,
    }),
    [activeTooltipId, tooltipId]
  );

  return (
    <TooltipContext.Provider value={value}>
      <div
        ref={rootRef}
        className={`tooltip-root${className ? ` ${className}` : ''}`}
        onMouseEnter={openTooltip}
        onMouseLeave={requestCloseTooltip}
        onFocusCapture={openTooltip}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            requestCloseTooltip();
          }
        }}
        onClickCapture={closeTooltip}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

interface TooltipTriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

export function TooltipTrigger({ asChild = false, children }: TooltipTriggerProps) {
  const { contentId, isOpen } = useTooltipContext();

  if (asChild) {
    if (!isValidElement(children)) {
      throw new Error('TooltipTrigger with asChild expects a single React element child.');
    }

    const child = children as ReactElement<{ 'aria-describedby'?: string }>;
    const existingDescribedBy = child.props['aria-describedby'];
    const describedBy = isOpen
      ? [existingDescribedBy, contentId].filter(Boolean).join(' ')
      : existingDescribedBy;

    return cloneElement(child, {
      'aria-describedby': describedBy || undefined,
    });
  }

  return (
    <span aria-describedby={isOpen ? contentId : undefined}>
      {children}
    </span>
  );
}

interface TooltipContentProps {
  children: ReactNode;
  side?: 'top' | 'bottom';
}

export function TooltipContent({ children, side = 'top' }: TooltipContentProps) {
  const { contentId, isOpen, rootRef, openTooltip, requestCloseTooltip, closeTooltip } = useTooltipContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [resolvedSide, setResolvedSide] = useState<'top' | 'bottom'>(side);
  const [contentStyle, setContentStyle] = useState<CSSProperties>({});

  const updatePosition = useCallback(() => {
    const rootEl = rootRef.current;
    const tooltipEl = contentRef.current;
    if (!rootEl || !tooltipEl) {
      return;
    }

    const rootRect = rootEl.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const viewportPadding = 8;
    const gap = 8;

    const topSpace = rootRect.top;
    const bottomSpace = window.innerHeight - rootRect.bottom;
    const needsBottom = side === 'top' && topSpace < tooltipRect.height + gap + viewportPadding;
    const needsTop = side === 'bottom' && bottomSpace < tooltipRect.height + gap + viewportPadding;

    let nextSide: 'top' | 'bottom' = side;
    if (needsBottom) {
      nextSide = 'bottom';
    } else if (needsTop) {
      nextSide = topSpace > bottomSpace ? 'top' : 'bottom';
    }

    const triggerCenterInRoot = rootRect.width / 2;
    const idealLeft = triggerCenterInRoot - tooltipRect.width / 2;
    const minLeft = viewportPadding - rootRect.left;
    const maxLeft = window.innerWidth - viewportPadding - rootRect.left - tooltipRect.width;
    const clampedLeft = Math.min(Math.max(idealLeft, minLeft), maxLeft);
    const arrowLeft = Math.min(
      Math.max(triggerCenterInRoot - clampedLeft, 10),
      tooltipRect.width - 10
    );

    setResolvedSide(nextSide);
    setContentStyle({
      left: `${clampedLeft}px`,
      transform: 'none',
      ['--tooltip-arrow-left' as string]: `${arrowLeft}px`,
    });
  }, [rootRef, side]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      id={contentId}
      role="tooltip"
      className={`tooltip-content ${resolvedSide === 'bottom' ? 'tooltip-content--bottom' : ''}`}
      style={contentStyle}
      onMouseEnter={openTooltip}
      onMouseLeave={requestCloseTooltip}
      onClick={closeTooltip}
    >
      {Children.toArray(children)}
      <span className="tooltip-content__arrow" aria-hidden="true" />
    </div>
  );
}
