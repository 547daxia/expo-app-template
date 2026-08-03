'use client';
import { Overlay } from '@gluestack-ui/core/overlay/creator';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  Image as RNImage,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolate,
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { clampImageIndex } from './utils';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(RNImage);

const imageViewerStyle = tva({
  base: 'w-full',
});

const imageViewerModalStyle = tva({
  base: 'flex-1 bg-[#000]/50',
});

const imageViewerContentStyle = tva({
  base: 'flex-1 justify-center items-center overflow-hidden web:flex web:justify-center web:items-center',
});

const imageViewerCloseButtonStyle = tva({
  base: 'absolute top-12 right-4 z-50 w-10 h-10 rounded-full bg-black/60 justify-center items-center',
});

const imageViewerNavigationStyle = tva({
  base: 'absolute inset-0 flex-row justify-between items-center px-2',
});

const imageViewerNavButtonStyle = tva({
  base: 'w-12 h-12 rounded-full bg-black/50 justify-center items-center',
});

const imageViewerCounterStyle = tva({
  base: 'absolute bottom-12 left-0 right-0 items-center',
});

const imageViewerCounterTextStyle = tva({
  base: 'text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full',
});

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

// Context for ImageViewer - with default values to prevent errors
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

// Single Zoomable Image Component
type ZoomableImageHandle = {
  resetZoom: () => void;
  isZoomed: () => boolean;
};

const ZoomableImage = React.memo(
  React.forwardRef<ZoomableImageHandle, {
    image: ImageItem;
    viewportWidth: number;
    viewportHeight: number;
    onDismiss: () => void;
    onZoomChange?: (isZoomed: boolean) => void;
  }>((
    {
      image,
      viewportWidth,
      viewportHeight,
      onDismiss,
      onZoomChange,
    },
    ref,
  ) => {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);
    const dismissProgress = useSharedValue(0);
    const opacity = useSharedValue(1);

    // Expose reset method to parent
    React.useImperativeHandle(ref, () => ({
      resetZoom: () => {
        scale.value = 1;
        savedScale.value = 1;
        translateX.value = 0;
        translateY.value = 0;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        if (onZoomChange) {
          onZoomChange(false);
        }
      },
      isZoomed: () => scale.value > 1,
    }));

    const pinchGesture = Gesture.Pinch()
      .onUpdate((event) => {
        scale.value = savedScale.value * event.scale;
      })
      .onEnd(() => {
        if (scale.value < 1) {
          scale.value = withSpring(1);
          savedScale.value = 1;
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          savedTranslateX.value = 0;
          savedTranslateY.value = 0;
          if (onZoomChange)
            runOnJS(onZoomChange)(false);
        }
        else if (scale.value > 4) {
          scale.value = withSpring(4);
          savedScale.value = 4;
          if (onZoomChange)
            runOnJS(onZoomChange)(true);
        }
        else {
          savedScale.value = scale.value;
          if (onZoomChange)
            runOnJS(onZoomChange)(scale.value > 1);
        }
      });

    // Runtime branching is required here: `.enabled(scale.value > 1)` would
    // capture the initial value and leave pan permanently disabled.
    const adaptivePanGesture = Gesture.Pan()
      .onUpdate((event) => {
        if (scale.value > 1) {
          const maxTranslateX = ((scale.value - 1) * viewportWidth) / 2;
          const maxTranslateY
            = ((scale.value - 1) * viewportHeight * 0.8) / 2;
          const nextX = savedTranslateX.value + event.translationX;
          const nextY = savedTranslateY.value + event.translationY;

          translateX.value = Math.max(
            -maxTranslateX,
            Math.min(maxTranslateX, nextX),
          );
          translateY.value = Math.max(
            -maxTranslateY,
            Math.min(maxTranslateY, nextY),
          );
          return;
        }

        if (Math.abs(event.translationY) > Math.abs(event.translationX)) {
          dismissProgress.value
            = Math.abs(event.translationY) / (viewportHeight * 0.3);
          translateY.value = event.translationY;
          opacity.value = interpolate(
            dismissProgress.value,
            [0, 1],
            [1, 0.3],
            Extrapolate.CLAMP,
          );
        }
      })
      .onEnd((event) => {
        if (scale.value > 1) {
          savedTranslateX.value = translateX.value;
          savedTranslateY.value = translateY.value;
          return;
        }

        if (
          Math.abs(event.translationY) > 120
          && Math.abs(event.translationY) > Math.abs(event.translationX)
        ) {
          runOnJS(onDismiss)();
        }
        else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          opacity.value = withTiming(1, { duration: 200 });
          dismissProgress.value = withTiming(0, { duration: 200 });
        }
      });

    const lastTapX = useSharedValue(0);
    const lastTapY = useSharedValue(0);

    const doubleTapGesture = Gesture.Tap()
      .numberOfTaps(2)
      .onBegin((event) => {
        lastTapX.value = event.x;
        lastTapY.value = event.y;
      })
      .onEnd(() => {
        if (scale.value > 1) {
          scale.value = withSpring(1);
          savedScale.value = 1;
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          savedTranslateX.value = 0;
          savedTranslateY.value = 0;
          if (onZoomChange)
            runOnJS(onZoomChange)(false);
        }
        else {
          const zoomScale = 2.5;
          scale.value = withSpring(zoomScale);
          savedScale.value = zoomScale;

          const centerX = viewportWidth / 2;
          const centerY = viewportHeight * 0.4;
          const deltaX = centerX - lastTapX.value;
          const deltaY = centerY - lastTapY.value;
          const maxTranslateX = ((zoomScale - 1) * viewportWidth) / 2;
          const maxTranslateY = ((zoomScale - 1) * viewportHeight * 0.8) / 2;
          const targetX = Math.max(
            -maxTranslateX,
            Math.min(maxTranslateX, deltaX),
          );
          const targetY = Math.max(
            -maxTranslateY,
            Math.min(maxTranslateY, deltaY),
          );

          translateX.value = withSpring(targetX);
          translateY.value = withSpring(targetY);
          savedTranslateX.value = targetX;
          savedTranslateY.value = targetY;
          if (onZoomChange)
            runOnJS(onZoomChange)(true);
        }
      });

    const composedGesture = Gesture.Race(
      doubleTapGesture,
      Gesture.Simultaneous(pinchGesture, adaptivePanGesture),
    );

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    }));

    return (
      <GestureDetector gesture={composedGesture}>
        <AnimatedImage
          source={{ uri: image.url }}
          alt={image.alt}
          resizeMode="contain"
          style={[
            { width: viewportWidth, height: viewportHeight * 0.8 },
            animatedStyle,
          ]}
        />
      </GestureDetector>
    );
  }),
);

// FlatList-based Image Gallery Component
const SlidableImageGallery = React.memo(({
  images,
  currentIndex,
  onIndexChange,
  onDismiss,
}: {
  images: ImageItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onDismiss: () => void;
}) => {
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const [localIndex, setLocalIndex] = useState(currentIndex);
  const imageRefsRef = useRef<Map<number, ZoomableImageHandle>>(new Map());
  const [isCurrentImageZoomed, setIsCurrentImageZoomed] = useState(false);

  // Handle zoom change from current image
  const handleZoomChange = useCallback((isZoomed: boolean) => {
    setIsCurrentImageZoomed(isZoomed);
  }, []);

  // Track previous currentIndex to detect external changes
  const prevCurrentIndexRef = useRef(currentIndex);

  // Scroll to index when currentIndex changes from outside (button press)
  useEffect(() => {
    // Only scroll if currentIndex changed externally (not from manual scroll)
    if (currentIndex !== prevCurrentIndexRef.current && flatListRef.current) {
      // Reset zoom on current image before scrolling to new one
      const currentImageRef = imageRefsRef.current.get(localIndex);
      if (currentImageRef?.resetZoom) {
        currentImageRef.resetZoom();
      }

      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
      setLocalIndex(currentIndex);
      prevCurrentIndexRef.current = currentIndex;
    }
  }, [currentIndex, localIndex]);

  // Handle scroll end - update index when scroll completes
  const handleMomentumScrollEnd = useCallback(
    (event: any) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(contentOffsetX / viewportWidth);

      if (
        newIndex !== localIndex
        && newIndex >= 0
        && newIndex < images.length
      ) {
        setLocalIndex(newIndex);
        prevCurrentIndexRef.current = newIndex; // Update ref to prevent effect from scrolling back
        onIndexChange(newIndex);
      }
    },
    [images.length, localIndex, onIndexChange, viewportWidth],
  );

  // Render each image item
  const renderItem = useCallback(
    ({ item, index }: { item: ImageItem; index: number }) => (
      <View style={{ width: viewportWidth, height: viewportHeight * 0.8 }}>
        <ZoomableImage
          ref={(ref) => {
            if (ref) {
              imageRefsRef.current.set(index, ref);
            }
            else {
              imageRefsRef.current.delete(index);
            }
          }}
          image={item}
          viewportWidth={viewportWidth}
          viewportHeight={viewportHeight}
          onDismiss={onDismiss}
          onZoomChange={index === localIndex ? handleZoomChange : undefined}
        />
      </View>
    ),
    [
      handleZoomChange,
      localIndex,
      onDismiss,
      viewportHeight,
      viewportWidth,
    ],
  );

  // Get item layout for better performance
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: viewportWidth,
      offset: viewportWidth * index,
      index,
    }),
    [viewportWidth],
  );

  const keyExtractor = useCallback(
    (item: ImageItem, index: number) => `image-${index}-${item.url}`,
    [],
  );

  return (
    <View
      style={{ width: viewportWidth, height: viewportHeight * 0.8 }}
      className="web:my-auto"
    >
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled={false}
        scrollEnabled={!isCurrentImageZoomed}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={getItemLayout}
        initialScrollIndex={currentIndex}
        bounces={true}
        scrollEventThrottle={16}
        decelerationRate="normal"
        snapToInterval={viewportWidth}
        snapToAlignment="center"
        disableIntervalMomentum={true}
      />
    </View>
  );
});

// Main ImageViewer Component
const ImageViewer = React.forwardRef<View, ImageViewerProps>(
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
        // Keep the selection valid when the controlled image collection shrinks.
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
      <View ref={ref} className={imageViewerStyle({})}>
        <ImageViewerContext.Provider value={contextValue}>
          {children}
        </ImageViewerContext.Provider>
      </View>
    );
  },
);

// Trigger Component
const ImageViewerTrigger = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ImageViewerTriggerProps
>(({ children, onPress, ...props }, ref) => {
  const { open } = useImageViewerContext();

  const handlePress = useCallback(() => {
    onPress?.();
    open();
  }, [onPress, open]);

  return (
    <Pressable ref={ref} onPress={handlePress} {...props}>
      {children}
    </Pressable>
  );
});

// Content Component (Uses gluestack Overlay for proper portal rendering)
// Context provider is placed INSIDE the Overlay so portaled content has access
const ImageViewerContent = React.forwardRef<
  View,
  { children?: React.ReactNode }
>(({ children }, ref) => {
  const context = useImageViewerContext();
  const { images, currentIndex, isOpen, close, goTo } = context;
  const currentImage = images[currentIndex];

  return (
    <Overlay
      isOpen={isOpen}
      onRequestClose={close}
      isKeyboardDismissable={true}
    >
      <ImageViewerContext.Provider value={context}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AnimatedView
            entering={FadeIn.duration(300).easing(Easing.out(Easing.ease))}
            exiting={FadeOut.duration(200).easing(Easing.in(Easing.ease))}
            className={imageViewerModalStyle({})}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              ref={ref}
              className={imageViewerContentStyle({})}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {currentImage && (
                <SlidableImageGallery
                  images={images}
                  currentIndex={currentIndex}
                  onIndexChange={goTo}
                  onDismiss={close}
                />
              )}
              {children}
            </View>
          </AnimatedView>
        </GestureHandlerRootView>
      </ImageViewerContext.Provider>
    </Overlay>
  );
});

// Close Button Component
const ImageViewerCloseButton = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  { className?: string }
>(({ className, ...props }, ref) => {
  const { close } = useImageViewerContext();

  return (
    <TouchableOpacity
      ref={ref}
      onPress={close}
      className={imageViewerCloseButtonStyle({ class: className })}
      accessibilityLabel="Close image viewer"
      accessibilityRole="button"
      {...props}
    >
      <Text className="text-xl font-bold text-white">✕</Text>
    </TouchableOpacity>
  );
});

// Navigation Component
const ImageViewerNavigation = React.forwardRef<View, { className?: string }>(
  ({ className }, ref) => {
    const { goPrevious, goNext, currentIndex, images }
      = useImageViewerContext();

    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex < images.length - 1;

    return (
      <View
        ref={ref}
        className={imageViewerNavigationStyle({ class: className })}
      >
        {canGoPrevious && (
          <TouchableOpacity
            onPress={goPrevious}
            className={imageViewerNavButtonStyle({})}
            accessibilityLabel="Previous image"
            accessibilityRole="button"
          >
            <Text className="text-2xl font-bold text-white">‹</Text>
          </TouchableOpacity>
        )}
        <View className="flex-1" />
        {canGoNext && (
          <TouchableOpacity
            onPress={goNext}
            className={imageViewerNavButtonStyle({})}
            accessibilityLabel="Next image"
            accessibilityRole="button"
          >
            <Text className="text-2xl font-bold text-white">›</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

// Counter Component
const ImageViewerCounter = React.forwardRef<View, { className?: string }>(
  ({ className }, ref) => {
    const { currentIndex, images } = useImageViewerContext();

    return (
      <View ref={ref} className={imageViewerCounterStyle({ class: className })}>
        <Text className={imageViewerCounterTextStyle({})}>
          {currentIndex + 1}
          {' '}
          /
          {images.length}
        </Text>
      </View>
    );
  },
);

export {
  ImageViewer,
  ImageViewerCloseButton,
  ImageViewerContent,
  ImageViewerCounter,
  ImageViewerNavigation,
  ImageViewerTrigger,
};
export type { ImageItem, ImageViewerProps, ImageViewerTriggerProps };
