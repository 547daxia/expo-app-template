import type { ComponentProps, ReactNode } from 'react';
import type {
  AttachmentData,
  AttachmentMediaCategory,
  AttachmentVariant,
} from './attachments-utils';
import {
  FileText,
  Globe,
  Image as ImageIcon,
  Music2,
  Paperclip,
  Video,
  X,
} from 'lucide-react-native';
import React, {

  createContext,

  useCallback,
  useContext,
  useMemo,
} from 'react';
import { Platform, ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Tooltip, TooltipContent, TooltipText } from '@/components/ui/tooltip';
import { getMediaCategory } from './attachments-utils';

export {
  getAttachmentLabel,
  getMediaCategory,
} from './attachments-utils';
export type {
  AttachmentData,
  AttachmentMediaCategory,
  AttachmentVariant,
} from './attachments-utils';

type AttachmentsContextValue = {
  variant: AttachmentVariant;
};

const AttachmentsContext = createContext<AttachmentsContextValue | null>(null);

type AttachmentContextValue = {
  data: AttachmentData;
  mediaCategory: AttachmentMediaCategory;
  onRemove?: () => void;
  variant: AttachmentVariant;
};

const AttachmentContext = createContext<AttachmentContextValue | null>(null);

export function useAttachmentsContext() {
  return useContext(AttachmentsContext) ?? { variant: 'grid' as const };
}

export function useAttachmentContext() {
  const ctx = useContext(AttachmentContext);
  if (!ctx)
    throw new Error('Attachment components must be used within <Attachment>');
  return ctx;
}

export type AttachmentsProps = ComponentProps<typeof ScrollView> & {
  variant?: AttachmentVariant;
};

export function Attachments({
  variant = 'grid',
  className = '',
  children,
  ...props
}: AttachmentsProps) {
  const contextValue = useMemo(() => ({ variant }), [variant]);

  return (
    <AttachmentsContext.Provider value={contextValue}>
      <Box>
        <ScrollView
          horizontal={variant !== 'list'}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: variant === 'list' ? 'column' : 'row',
            gap: 8,
          }}
          className={`${variant === 'list' ? 'w-full' : ''} ${className}`}
          {...props}
        >
          {children}
        </ScrollView>
      </Box>
    </AttachmentsContext.Provider>
  );
}

export type AttachmentProps = ComponentProps<typeof Box> & {
  data: AttachmentData;
  onRemove?: () => void;
};

export function Attachment({
  data,
  onRemove,
  className = '',
  children,
  ...props
}: AttachmentProps) {
  const { variant } = useAttachmentsContext();
  const mediaCategory = getMediaCategory(data);

  const contextValue = useMemo(
    () => ({ data, mediaCategory, onRemove, variant }),
    [data, mediaCategory, onRemove, variant],
  );

  return (
    <AttachmentContext.Provider value={contextValue}>
      <Box
        className={`
          group relative
          ${variant === 'grid' ? 'size-24 overflow-hidden rounded-lg' : ''}
          ${variant === 'inline' ? 'h-8 flex-row items-center gap-1.5 rounded-md border border-border px-1.5 text-sm font-medium' : ''}
          ${variant === 'list' ? 'w-full flex-row items-center gap-3 rounded-lg border border-border p-3' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
        {onRemove && (
          <AttachmentRemove
            className={
              Platform.OS === 'web'
                ? ''
                : 'absolute top-3 right-3 z-10 opacity-100'
            }
          />
        )}
      </Box>
    </AttachmentContext.Provider>
  );
}

export type AttachmentPreviewProps = ComponentProps<typeof Box> & {
  fallbackIcon?: ReactNode;
};

export function AttachmentPreview({
  fallbackIcon,
  className = '',
  ...props
}: AttachmentPreviewProps) {
  const { data, mediaCategory, variant } = useAttachmentContext();

  const renderContent = () => {
    if (mediaCategory === 'image' && data.type === 'file' && data.url) {
      return (
        <Image
          source={{ uri: data.url }}
          alt={data.filename || 'Image'}
          className={`size-full object-cover ${variant !== 'grid' ? 'rounded-sm' : 'rounded-xl'}`}
          style={variant === 'grid' ? { width: 104, height: 104 } : undefined}
        />
      );
    }

    const iconMap: Record<AttachmentMediaCategory, React.ComponentType<any>> = {
      audio: Music2,
      document: FileText,
      image: ImageIcon,
      source: Globe,
      unknown: Paperclip,
      video: Video,
    };

    const Icon = iconMap[mediaCategory];
    const size = variant === 'inline' ? 12 : variant === 'list' ? 24 : 20;

    return (
      fallbackIcon ?? <Icon size={size} className="text-muted-foreground" />
    );
  };

  return (
    <Box
      className={`
        flex shrink-0 items-center justify-center overflow-hidden
        ${variant === 'grid' ? 'size-full' : ''}
        ${variant === 'inline' ? 'size-5 rounded-sm bg-background' : ''}
        ${variant === 'list' ? 'size-12 rounded-sm bg-muted' : ''}
        ${className}
      `}
      {...props}
    >
      {renderContent()}
    </Box>
  );
}

export type AttachmentRemoveProps = ComponentProps<typeof Button> & {
  label?: string;
};

export function AttachmentRemove({
  label = 'Remove',
  className = '',
  children,
  ...props
}: AttachmentRemoveProps) {
  const { onRemove, variant } = useAttachmentContext();
  const isWeb = Platform.OS === 'web';

  const handlePress = useCallback(() => onRemove?.(), [onRemove]);

  if (!onRemove)
    return null;

  return (
    <Button
      accessibilityLabel={label}
      onPress={handlePress}
      className={`
        ${
    variant === 'grid'
      ? isWeb
        ? 'absolute top-2 right-2 size-6 rounded-full bg-background/80 opacity-0 group-hover:opacity-100'
        : 'absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-muted'
      : ''
    }
        ${variant === 'inline' ? 'ml-auto size-5' : ''}
        ${variant === 'list' ? 'ml-auto size-8 shrink-0' : ''}
        ${className}
      `}
      variant="ghost"
      size="sm"
      {...props}
    >
      {children ?? (
        <X className="text-destructive" size={12} />
      )}
    </Button>
  );
}

export type AttachmentHoverCardProps = Omit<
  ComponentProps<typeof Tooltip>,
  'trigger' | 'children'
> & {
  children: ReactNode;
};

export function AttachmentHoverCard({
  children,
  placement = 'top',
  openDelay = 0,
  closeDelay = 100,
  ...props
}: AttachmentHoverCardProps) {
  const childrenArray = React.Children.toArray(children);
  const triggerElement = childrenArray[0];
  const contentElements = childrenArray.slice(1);

  if (!triggerElement) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      placement={placement}
      openDelay={openDelay}
      closeDelay={closeDelay}
      trigger={(triggerProps) => {
        if (React.isValidElement<Record<string, unknown>>(triggerElement)) {
          return React.cloneElement(triggerElement, {
            ...triggerProps,
            ...triggerElement.props,
          });
        }
        return triggerElement;
      }}
      {...props}
    >
      {contentElements}
    </Tooltip>
  );
}

export function AttachmentHoverCardContent({
  className = '',
  children,
  ...props
}: ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipContent className={`w-auto p-2 ${className}`} {...props}>
      {children}
    </TooltipContent>
  );
}

export const AttachmentHoverCardText = TooltipText;

export function AttachmentEmpty({
  className = '',
  children,
  ...props
}: ComponentProps<typeof Box>) {
  return (
    <Box
      className={`flex items-center justify-center text-sm text-muted-foreground ${className}`}
      {...props}
    >
      {children ?? 'No attachments'}
    </Box>
  );
}
