'use client';
import { Overlay } from '@gluestack-ui/core/overlay/creator';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import React, { useCallback, useEffect, useState } from 'react';
import { clampImageIndex } from './utils';

type ImageItem = {
  url: string;
  alt?: string;
};

type ImageViewerProps = {
  images: ImageItem[];
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
  children?: React.ReactNode;
};

type ImageViewerTriggerProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

// Web-specific styles
const imageViewerModalStyle = tva({
  base: 'fixed inset-0 bg-black/95',
});

const imageViewerContentStyle = tva({
  base: 'flex flex-col items-center justify-center h-full w-full',
});

const imageViewerCloseButtonStyle = tva({
  base: 'absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xl font-bold cursor-pointer backdrop-blur-sm',
});

const imageViewerNavigationStyle = tva({
  base: 'absolute inset-0 flex items-center justify-between px-4 pointer-events-none',
});

const imageViewerNavButtonStyle = tva({
  base: 'w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-2xl font-bold cursor-pointer pointer-events-auto backdrop-blur-sm',
});

const imageViewerCounterStyle = tva({
  base: 'absolute bottom-8 left-0 right-0 flex justify-center',
});

const imageViewerCounterTextStyle = tva({
  base: 'text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full',
});

// Context for ImageViewer - with default values to prevent errors when used outside provider
type ImageViewerContextType = {
  images: ImageItem[];
  currentIndex: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  goNext: () => void;
  goPrevious: () => void;
  goTo: (index: number) => void;
};

const ImageViewerContext = React.createContext<ImageViewerContextType>({
  images: [],
  currentIndex: 0,
  isOpen: false,
  open: () => {},
  close: () => {},
  goNext: () => {},
  goPrevious: () => {},
  goTo: () => {},
});

function useImageViewerContext() {
  const context = React.useContext(ImageViewerContext);
  return context;
}

// Main ImageViewer Component
const ImageViewer = React.forwardRef<HTMLDivElement, ImageViewerProps>(
  (
    {
      images,
      defaultOpen = false,
      isOpen: controlledIsOpen,
      onOpenChange,
      onIndexChange,
      initialIndex = 0,
      children,
    },
    ref,
  ) => {
    const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
    const [currentIndex, setCurrentIndex] = useState(() =>
      clampImageIndex(initialIndex, images.length),
    );

    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

    useEffect(() => {
      onIndexChange?.(currentIndex);
    }, [currentIndex, onIndexChange]);

    useEffect(() => {
      const safeIndex = clampImageIndex(currentIndex, images.length);
      if (safeIndex !== currentIndex) {
        // Keep the selection valid when the image collection shrinks.
        // eslint-disable-next-line react/set-state-in-effect
        setCurrentIndex(safeIndex);
      }
    }, [currentIndex, images.length]);

    const open = useCallback(() => {
      if (!isControlled) {
        setUncontrolledIsOpen(true);
      }
      onOpenChange?.(true);
    }, [isControlled, onOpenChange]);

    const close = useCallback(() => {
      if (!isControlled) {
        setUncontrolledIsOpen(false);
      }
      onOpenChange?.(false);
    }, [isControlled, onOpenChange]);

    const goNext = useCallback(() => {
      setCurrentIndex(prev => Math.min(prev + 1, images.length - 1));
    }, [images.length]);

    const goPrevious = useCallback(() => {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }, []);

    const goTo = useCallback((index: number) => {
      setCurrentIndex(clampImageIndex(index, images.length));
    }, [images.length]);

    const contextValue = React.useMemo(
      () => ({
        images,
        currentIndex,
        isOpen,
        open,
        close,
        goNext,
        goPrevious,
        goTo,
      }),
      [images, currentIndex, isOpen, open, close, goNext, goPrevious, goTo],
    );

    return (
      <div ref={ref} className="w-full">
        <ImageViewerContext.Provider value={contextValue}>
          {children}
        </ImageViewerContext.Provider>
      </div>
    );
  },
);

// Trigger Component
const ImageViewerTrigger = React.forwardRef<
  HTMLDivElement,
  ImageViewerTriggerProps
>(({ children, onPress, ...props }, ref) => {
  const { open } = useImageViewerContext();

  const handlePress = useCallback(() => {
    onPress?.();
    open();
  }, [onPress, open]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handlePress();
      }
    },
    [handlePress],
  );

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={handlePress}
      onKeyDown={handleKeyDown}
      className="cursor-pointer"
      {...props}
    >
      {children}
    </div>
  );
});

// Content Component (Uses gluestack Overlay for proper portal rendering)
// Context provider is placed INSIDE the Overlay so portaled content has access
const ImageViewerContent = React.forwardRef<
  HTMLDivElement,
  { children?: React.ReactNode }
>(({ children }, ref) => {
  const context = useImageViewerContext();
  const { images, currentIndex, isOpen, close, goNext, goPrevious } = context;
  const currentImage = images[currentIndex];

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined')
      return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        close();
      if (e.key === 'ArrowLeft')
        goPrevious();
      if (e.key === 'ArrowRight')
        goNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, goNext, goPrevious]);

  return (
    <Overlay
      isOpen={isOpen}
      onRequestClose={close}
      isKeyboardDismissable={true}
    >
      <ImageViewerContext.Provider value={context}>
        <div className={imageViewerModalStyle({})}>
          <div ref={ref} className={imageViewerContentStyle({})}>
            {currentImage && (
              <img
                src={currentImage.url}
                alt={currentImage.alt || `Image ${currentIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain"
              />
            )}
            {children}
          </div>
        </div>
      </ImageViewerContext.Provider>
    </Overlay>
  );
});

// Close Button Component
const ImageViewerCloseButton = React.forwardRef<
  HTMLButtonElement,
  { className?: string }
>(({ className, ...props }, ref) => {
  const { close } = useImageViewerContext();

  return (
    <button
      ref={ref}
      onClick={close}
      className={imageViewerCloseButtonStyle({ class: className })}
      aria-label="Close image viewer"
      {...props}
    >
      ✕
    </button>
  );
});

// Navigation Component
const ImageViewerNavigation = React.forwardRef<
  HTMLDivElement,
  { className?: string }
>(({ className }, ref) => {
  const { goPrevious, goNext, currentIndex, images } = useImageViewerContext();

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;

  return (
    <div ref={ref} className={imageViewerNavigationStyle({ class: className })}>
      {canGoPrevious && (
        <button
          onClick={goPrevious}
          className={imageViewerNavButtonStyle({})}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}
      <div className="flex-1" />
      {canGoNext && (
        <button
          onClick={goNext}
          className={imageViewerNavButtonStyle({})}
          aria-label="Next image"
        >
          ›
        </button>
      )}
    </div>
  );
});

// Counter Component
const ImageViewerCounter = React.forwardRef<
  HTMLDivElement,
  { className?: string }
>(({ className }, ref) => {
  const { currentIndex, images } = useImageViewerContext();

  return (
    <div ref={ref} className={imageViewerCounterStyle({ class: className })}>
      <span className={imageViewerCounterTextStyle({})}>
        {currentIndex + 1}
        {' '}
        /
        {images.length}
      </span>
    </div>
  );
});

export {
  ImageViewer,
  ImageViewerCloseButton,
  ImageViewerContent,
  ImageViewerCounter,
  ImageViewerNavigation,
  ImageViewerTrigger,
};

export type { ImageItem, ImageViewerProps, ImageViewerTriggerProps };
