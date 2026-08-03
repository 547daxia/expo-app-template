import React from 'react';

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetPortal,
  BottomSheetTextInput,
  BottomSheetTrigger,
} from '@/components/ui/bottomsheet';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { CloseIcon, MenuIcon, SettingsIcon, ThreeDotsIcon } from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '@/components/ui/menu';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from '@/components/ui/popover';
import { Portal } from '@/components/ui/portal';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { DemoLabel, DemoRow, DemoSection } from './catalog-layout';

export function OverlaysDemo() {
  return (
    <DemoSection
      eyebrow="Overlays"
      title="Menus, sheets and dialogs"
      description="Open each control to verify focus management, backdrops, portal rendering and animated presentation."
    >
      <VStack className="gap-5">
        <SheetControls />
        <DialogControls />
        <AnchoredControls />
        <PortalAndFabDemo />
      </VStack>
    </DemoSection>
  );
}

function SheetControls() {
  const [actionsOpen, setActionsOpen] = React.useState(false);

  return (
    <VStack className="gap-3">
      <DemoLabel>Actionsheet and bottomsheet</DemoLabel>
      <DemoRow>
        <Button onPress={() => setActionsOpen(true)}><ButtonText>Actionsheet</ButtonText></Button>
        <BottomSheet>
          <BottomSheetTrigger className="rounded-md border border-border px-4 py-2">
            <Text selectable className="font-medium">Bottom sheet</Text>
          </BottomSheetTrigger>
          <BottomSheetPortal
            snapPoints={['38%']}
            backdropComponent={props => <BottomSheetBackdrop {...props} />}
          >
            <BottomSheetContent>
              <Text selectable className="text-lg font-semibold">Quick actions</Text>
              <BottomSheetTextInput placeholder="Filter actions…" />
              <BottomSheetItem><BottomSheetItemText>Duplicate component</BottomSheetItemText></BottomSheetItem>
              <BottomSheetItem><BottomSheetItemText>View documentation</BottomSheetItemText></BottomSheetItem>
            </BottomSheetContent>
          </BottomSheetPortal>
        </BottomSheet>
      </DemoRow>
      <Actionsheet isOpen={actionsOpen} onClose={() => setActionsOpen(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper><ActionsheetDragIndicator /></ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={() => setActionsOpen(false)}><ActionsheetItemText>Copy example</ActionsheetItemText></ActionsheetItem>
          <ActionsheetItem onPress={() => setActionsOpen(false)}><ActionsheetItemText>Open documentation</ActionsheetItemText></ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
}

function DialogControls() {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <VStack className="gap-3">
      <DemoLabel>Alert-dialog, drawer and modal</DemoLabel>
      <DemoRow>
        <Button variant="destructive" onPress={() => setAlertOpen(true)}><ButtonText>Alert dialog</ButtonText></Button>
        <Button variant="outline" onPress={() => setDrawerOpen(true)}><ButtonText>Drawer</ButtonText></Button>
        <Button variant="secondary" onPress={() => setModalOpen(true)}><ButtonText>Modal</ButtonText></Button>
      </DemoRow>
      <DeleteAlert isOpen={alertOpen} onClose={() => setAlertOpen(false)} />
      <SettingsDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ExampleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </VStack>
  );
}

function DeleteAlert({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader><Text selectable className="text-lg font-semibold">Reset examples?</Text></AlertDialogHeader>
        <AlertDialogBody><Text selectable className="text-muted-foreground">This is a visual demonstration; no data will be removed.</Text></AlertDialogBody>
        <AlertDialogFooter>
          <Button variant="outline" onPress={onClose}><ButtonText>Cancel</ButtonText></Button>
          <Button variant="destructive" onPress={onClose}><ButtonText>Reset</ButtonText></Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SettingsDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} anchor="right" size="md">
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <Text selectable className="text-lg font-semibold">Component settings</Text>
          <DrawerCloseButton onPress={onClose}><ButtonIcon as={CloseIcon} /></DrawerCloseButton>
        </DrawerHeader>
        <DrawerBody><Text selectable className="text-muted-foreground">Drawer body with independently scrollable content.</Text></DrawerBody>
        <DrawerFooter><Button onPress={onClose}><ButtonText>Save</ButtonText></Button></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ExampleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text selectable className="text-lg font-semibold">Modal example</Text>
          <ModalCloseButton onPress={onClose}><ButtonIcon as={CloseIcon} /></ModalCloseButton>
        </ModalHeader>
        <ModalBody><Text selectable className="text-muted-foreground">Reusable dialog content rendered through the Gluestack overlay provider.</Text></ModalBody>
        <ModalFooter><Button onPress={onClose}><ButtonText>Done</ButtonText></Button></ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function AnchoredControls() {
  return (
    <VStack className="gap-3">
      <DemoLabel>Menu and popover</DemoLabel>
      <DemoRow>
        <Menu
          placement="bottom left"
          trigger={triggerProps => (
            <Button {...triggerProps} variant="outline">
              <ButtonIcon as={MenuIcon} />
              <ButtonText>Menu</ButtonText>
            </Button>
          )}
        >
          <MenuItem textValue="Edit"><MenuItemLabel>Edit example</MenuItemLabel></MenuItem>
          <MenuSeparator />
          <MenuItem textValue="Share"><MenuItemLabel>Share preview</MenuItemLabel></MenuItem>
        </Menu>
        <Popover
          placement="bottom"
          trigger={triggerProps => (
            <Button {...triggerProps} variant="ghost">
              <ButtonIcon as={ThreeDotsIcon} />
              <ButtonText>Popover</ButtonText>
            </Button>
          )}
        >
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>
              <Text selectable className="font-semibold">Popover title</Text>
              <PopoverCloseButton><ButtonIcon as={CloseIcon} /></PopoverCloseButton>
            </PopoverHeader>
            <PopoverBody><Text selectable className="text-sm text-muted-foreground">Anchored contextual content.</Text></PopoverBody>
            <PopoverFooter><Text selectable className="text-xs text-primary">Gluestack UI</Text></PopoverFooter>
          </PopoverContent>
        </Popover>
      </DemoRow>
    </VStack>
  );
}

function PortalAndFabDemo() {
  const [portalOpen, setPortalOpen] = React.useState(false);

  return (
    <VStack className="gap-3">
      <DemoLabel>Portal and FAB</DemoLabel>
      <View className="relative h-28 overflow-hidden rounded-xl bg-muted p-3">
        <Text selectable className="text-sm text-muted-foreground">FAB placement preview</Text>
        <Fab placement="bottom right" onPress={() => setPortalOpen(true)}>
          <FabIcon as={SettingsIcon} />
          <FabLabel>Portal</FabLabel>
        </Fab>
      </View>
      {portalOpen && (
        <Portal>
          <View className="absolute inset-x-4 top-16 z-50 flex-row items-center justify-between rounded-xl bg-foreground p-3">
            <Text selectable className="text-sm text-background">Rendered through Portal</Text>
            <Button size="sm" variant="secondary" onPress={() => setPortalOpen(false)}><ButtonText>Close</ButtonText></Button>
          </View>
        </Portal>
      )}
    </VStack>
  );
}
