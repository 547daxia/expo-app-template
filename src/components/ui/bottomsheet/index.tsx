'use client';
import type { PressableProps, TextInputProps, TextProps } from 'react-native';
import { Overlay } from '@gluestack-ui/core/overlay/creator';
import { FocusScope } from '@gluestack-ui/utils/aria';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import GorhomBottomSheet, {

  BottomSheetBackdrop as GorhomBottomSheetBackdrop,
  BottomSheetFlatList as GorhomBottomSheetFlatList,
  BottomSheetFooter as GorhomBottomSheetFooter,
  BottomSheetHandle as GorhomBottomSheetHandle,
  BottomSheetTextInput as GorhomBottomSheetInput,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
  BottomSheetSectionList as GorhomBottomSheetSectionList,
  BottomSheetView as GorhomBottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Keyboard, Platform, Pressable as RNPressable, Text, View } from 'react-native';
import { withUniwind } from 'uniwind';

const bottomSheetBackdropStyle = tva({
  base: 'absolute inset-0 bg-black opacity-50',
});

const bottomSheetContentStyle = tva({
  base: 'px-4 gap-2',
});

const bottomSheetTriggerStyle = tva({
  base: 'p-4 rounded-lg border border-border/90',
});

const bottomSheetHandleStyle = tva({
  base: 'py-3 w-full items-center rounded-t-xl',
});

const bottomSheetItemStyle = tva({
  base: 'p-3 flex-row items-center rounded-sm w-full disabled:opacity-40 web:pointer-events-auto disabled:cursor-not-allowed hover:bg-accent/40 active:bg-accent/50 data-[focus=true]:bg-accent/20 web:data-[focus-visible=true]:bg-accent/40',
});
const bottomSheetItemTextStyle = tva({
  base: 'text-foreground font-normal text-sm',
});

const bottomSheetFooterStyle = tva({
  base: 'p-4 border-t border-border/90',
});

const bottomSheetTextInputStyle = tva({
  base: 'flex-1 text-foreground text-sm md:text-sm py-1 placeholder:text-muted-foreground  web:outline-none ios:leading-[0px] web:cursor-text  h-9 w-full flex-row items-center rounded-md border border-border dark:bg-input/30 bg-transparent shadow-xs overflow-hidden px-3 gap-2',
});

type BottomSheetContextValue = {
  bottomSheetRef: React.RefObject<GorhomBottomSheet | null>;
  handleClose: () => void;
  handleOpen: (index?: number) => void;
  isVisible: boolean;
  handleSheetChanges: (index: number) => void;
  currentIndex: number;
};

const BottomSheetContext = createContext<BottomSheetContextValue>({
  bottomSheetRef: { current: null! },
  handleClose: () => { },
  handleOpen: () => { },
  isVisible: false,
  handleSheetChanges: () => { },
  currentIndex: -1,
});

export type BottomSheetRef = {
  open: (index?: number) => void;
  close: () => void;
  snapToIndex: (index: number) => void;
  expand: () => void;
  collapse: () => void;
};

type IBottomSheetRootProps = {
  defaultSnapIndex?: number;
  children?: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (index: number) => void;
};

export const BottomSheet = forwardRef<BottomSheetRef, IBottomSheetRootProps>(
  ({ defaultSnapIndex = 0, onOpen, onClose, onChange, children }, ref) => {
    const bottomSheetRef = useRef<GorhomBottomSheet>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const handleOpen = useCallback(
      (index?: number) => {
        const targetIndex = index ?? defaultSnapIndex;
        setCurrentIndex(targetIndex);
        setIsVisible(true);
        onOpen?.();
      },
      [defaultSnapIndex, onOpen],
    );

    const handleClose = useCallback(() => {
      Keyboard.dismiss();
      setCurrentIndex(-1);
    }, []);

    const handleSheetChanges = useCallback(
      (index: number) => {
        setCurrentIndex(index);
        onChange?.(index);
        if (index === -1) {
          setIsVisible(false);
          onClose?.();
        }
        else {
          setIsVisible(true);
        }
      },
      [onClose, onChange],
    );

    const snapToIndex = useCallback((index: number) => {
      if (bottomSheetRef.current) {
        bottomSheetRef.current.snapToIndex(index);
      }
      else {
        setCurrentIndex(index);
        setIsVisible(true);
      }
    }, []);

    const expand = useCallback(() => {
      bottomSheetRef.current?.expand();
    }, []);

    const collapse = useCallback(() => {
      bottomSheetRef.current?.collapse();
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        open: handleOpen,
        close: handleClose,
        snapToIndex,
        expand,
        collapse,
      }),
      [handleOpen, handleClose, snapToIndex, expand, collapse],
    );

    const contextValue = useMemo(
      () => ({
        bottomSheetRef,
        handleClose,
        handleOpen,
        isVisible,
        handleSheetChanges,
        currentIndex,
      }),
      [handleClose, handleOpen, isVisible, handleSheetChanges, currentIndex],
    );

    return (
      <BottomSheetContext.Provider value={contextValue}>
        {children}
      </BottomSheetContext.Provider>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

const StyledGorhomBottomSheet = withUniwind(GorhomBottomSheet);

type IBottomSheetPortalProps = Omit<
  React.ComponentProps<typeof GorhomBottomSheet>,
  'ref' | 'index'
> & {
  className?: string;
  backgroundClassName?: string;
  handleIndicatorClassName?: string;
};

export function BottomSheetPortal({
  className,
  backgroundClassName,
  handleIndicatorClassName,
  enablePanDownToClose = true,
  enableDynamicSizing = false,
  snapPoints,
  onChange,
  ...props
}: IBottomSheetPortalProps) {
  const { bottomSheetRef, handleSheetChanges, isVisible, currentIndex }
    = useContext(BottomSheetContext);

  const memoizedSnapPoints = snapPoints;
  const snapPointCount = Array.isArray(memoizedSnapPoints)
    ? memoizedSnapPoints.length
    : undefined;

  if (!isVisible)
    return null;

  // Defensive index check to prevent Invariant Violation
  const validIndex
    = snapPointCount && snapPointCount > 0
      ? Math.min(currentIndex, snapPointCount - 1)
      : currentIndex;

  return (
    <Overlay isOpen={true} isKeyboardDismissable={false} style={{ flex: 1 }}>
      <StyledGorhomBottomSheet
        ref={bottomSheetRef}
        snapPoints={memoizedSnapPoints}
        index={validIndex}
        enableDynamicSizing={enableDynamicSizing}
        onChange={(idx, position, type) => {
          handleSheetChanges(idx);
          onChange?.(idx, position, type);
        }}
        enablePanDownToClose={enablePanDownToClose}
        className={className}
        backgroundClassName={`${backgroundClassName} bg-background border border-border/90 rounded-xl`}
        handleIndicatorClassName={`${handleIndicatorClassName} bg-primary`}
        {...props}
      >
        {props.children}
      </StyledGorhomBottomSheet>
    </Overlay>
  );
}

export function BottomSheetTrigger({
  className,
  index,
  onPress,
  ...props
}: PressableProps & { className?: string; index?: number }) {
  const { handleOpen } = useContext(BottomSheetContext);
  return (
    <RNPressable
      {...props}
      onPress={(e) => {
        onPress?.(e);
        handleOpen(index);
      }}
      className={bottomSheetTriggerStyle({ className })}
    >
      {props.children}
    </RNPressable>
  );
}

type IBottomSheetBackdropProps = React.ComponentProps<
  typeof GorhomBottomSheetBackdrop
> & {
  className?: string;
};

export function BottomSheetBackdrop({
  disappearsOnIndex = -1,
  appearsOnIndex = 0,
  opacity = 0.5,
  className,
  pressBehavior = 'close',
  ...props
}: Partial<IBottomSheetBackdropProps>) {
  return (
    <GorhomBottomSheetBackdrop
      // @ts-expect-error - upstream creator extends the Gorhom sheet props
      className={bottomSheetBackdropStyle({ className })}
      disappearsOnIndex={disappearsOnIndex}
      appearsOnIndex={appearsOnIndex}
      opacity={opacity}
      pressBehavior={pressBehavior}
      {...props}
    />
  );
}

const StyledGorhomBottomSheetHandle = withUniwind(GorhomBottomSheetHandle);

type IBottomSheetHandleProps = React.ComponentProps<
  typeof GorhomBottomSheetHandle
> & {
  className?: string;
  indicatorClassName?: string;
};

export function BottomSheetDragIndicator({
  children,
  className,
  indicatorClassName,
  ...props
}: IBottomSheetHandleProps) {
  return (
    <StyledGorhomBottomSheetHandle
      {...props}
      className={bottomSheetHandleStyle({ className })}
    >
      {children}
    </StyledGorhomBottomSheetHandle>
  );
}

const StyledGorhomBottomSheetView = withUniwind(GorhomBottomSheetView);

type IBottomSheetContentProps = React.ComponentProps<
  typeof GorhomBottomSheetView
> & {
  className?: string;
  focusScope?: boolean;
};

export function BottomSheetContent({
  className,
  focusScope = true,
  ...props
}: IBottomSheetContentProps) {
  const { handleClose, isVisible } = useContext(BottomSheetContext);

  const keyDownHandlers = useMemo(() => {
    if (Platform.OS !== 'web')
      return {};
    return {
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleClose();
        }
      },
    };
  }, [handleClose]);

  const content = props.children;
  const wrappedContent
    = Platform.OS === 'web' && isVisible && focusScope
      ? (
          <FocusScope contain={isVisible} autoFocus restoreFocus>
            {content}
          </FocusScope>
        )
      : (
          content
        );

  return (
    <StyledGorhomBottomSheetView
      {...props}
      {...keyDownHandlers}
      className={bottomSheetContentStyle({ className })}
    >
      {wrappedContent}
    </StyledGorhomBottomSheetView>
  );
}

type IBottomSheetFooterProps = React.ComponentProps<
  typeof GorhomBottomSheetFooter
> & {
  className?: string;
  children?: React.ReactNode;
};

export function BottomSheetFooter({
  className,
  children,
  ...props
}: IBottomSheetFooterProps) {
  return (
    <GorhomBottomSheetFooter {...props}>
      <View
        className={bottomSheetFooterStyle({ className })}
      >
        {children}
      </View>
    </GorhomBottomSheetFooter>
  );
}

type IBottomSheetItemProps = PressableProps & {
  className?: string;
  closeOnSelect?: boolean;
};

export function BottomSheetItem({
  children,
  className,
  closeOnSelect = true,
  ...props
}: IBottomSheetItemProps) {
  const { handleClose } = useContext(BottomSheetContext);

  return (
    <RNPressable
      {...props}
      className={bottomSheetItemStyle({ className })}
      onPress={(e) => {
        props.onPress?.(e);
        if (closeOnSelect) {
          handleClose();
        }
      }}
      role="button"
      accessibilityRole="button"
    >
      {children}
    </RNPressable>
  );
}

type IBottomSheetItemTextProps = TextProps & {
  className?: string;
};

export function BottomSheetItemText({
  className,
  ...props
}: IBottomSheetItemTextProps) {
  return (
    <Text {...props} className={bottomSheetItemTextStyle({ className })} />
  );
}

const StyledGorhomBottomSheetInput = withUniwind(GorhomBottomSheetInput);

export function BottomSheetTextInput({
  className,
  ...props
}: TextInputProps) {
  return (
    <StyledGorhomBottomSheetInput
      {...props}
      className={bottomSheetTextInputStyle({ className })}
    />
  );
}

// Scrollable components
export const BottomSheetScrollView = GorhomBottomSheetScrollView;
export const BottomSheetFlatList = GorhomBottomSheetFlatList;
export const BottomSheetSectionList = GorhomBottomSheetSectionList;
