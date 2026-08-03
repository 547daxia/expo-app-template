import React, { createContext, useContext, useMemo } from 'react';
import {
  tableBodyStyle,
  tableCaptionStyle,
  tableDataStyle,
  tableFooterStyle,
  tableHeaderStyle,
  tableHeadStyle,
  tableRowStyleStyle,
  tableStyle,
} from './styles';

const TableHeaderContext = createContext<{
  isHeaderRow: boolean;
}>({
  isHeaderRow: false,
});
const TableFooterContext = createContext<{
  isFooterRow: boolean;
}>({
  isFooterRow: false,
});

const Table = React.forwardRef<HTMLTableElement, React.ComponentProps<'table'>>(
  ({ className, ...props }, ref) => {
    return (
      <table
        ref={ref}
        className={tableStyle({ class: className })}
        {...props}
      />
    );
  },
);

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<'thead'>
>(({ className, ...props }, ref) => {
  const contextValue = useMemo(() => {
    return {
      isHeaderRow: true,
    };
  }, []);
  return (
    <TableHeaderContext.Provider value={contextValue}>
      <thead
        ref={ref}
        className={tableHeaderStyle({ class: className })}
        {...props}
      />
    </TableHeaderContext.Provider>
  );
});

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<'tbody'>
>(({ className, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={tableBodyStyle({ class: className })}
      {...props}
    />
  );
});

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<'tfoot'>
>(({ className, ...props }, ref) => {
  const contextValue = useMemo(() => {
    return {
      isFooterRow: true,
    };
  }, []);
  return (
    <TableFooterContext.Provider value={contextValue}>
      <tfoot
        ref={ref}
        className={tableFooterStyle({ class: className })}
        {...props}
      />
    </TableFooterContext.Provider>
  );
});

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<'th'>
>(({ className, ...props }, ref) => {
  return (
    <th ref={ref} className={tableHeadStyle({ class: className })} {...props} />
  );
});

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.ComponentProps<'tr'>
>(({ className, ...props }, ref) => {
  const { isHeaderRow } = useContext(TableHeaderContext);
  const { isFooterRow } = useContext(TableFooterContext);
  return (
    <tr
      ref={ref}
      className={tableRowStyleStyle({
        isHeaderRow,
        isFooterRow,
        class: className,
      })}
      {...props}
    />
  );
});

const TableData = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<'td'>
>(({ className, ...props }, ref) => {
  return (
    <td ref={ref} className={tableDataStyle({ class: className })} {...props} />
  );
});

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.ComponentProps<'caption'>
>(({ className, ...props }, ref) => {
  return (
    <caption
      ref={ref}
      className={tableCaptionStyle({ class: className })}
      {...props}
    />
  );
});

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableFooter.displayName = 'TableFooter';
TableHead.displayName = 'TableHead';
TableRow.displayName = 'TableRow';
TableData.displayName = 'TableData';
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableBody,
  TableCaption,
  TableData,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
