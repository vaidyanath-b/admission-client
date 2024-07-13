"use client"
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  SortDescriptor,
} from "@nextui-org/react";
import { ChevronDownIcon, Searchicon } from "./icons";
import { useContext } from "react";
import AdminContext, { IAllotmentCount } from "@/context/admin/context";

const INITIAL_VISIBLE_COLUMNS = ["course", "quota", "count", "totalCount"];

const quotaColorMap: Record<string, "success" | "danger" | "primary" | "default" | "secondary" | "warning" | undefined> = {
  General: "success",
  Reserved: "danger",
};

export default function AllotmentCountsTable() {
    const context = useContext(AdminContext);
  const allotmentCounts = context?.allotmentCount || [];
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "course",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredCounts = [...allotmentCounts];

    if (hasSearchFilter) {
      filteredCounts = filteredCounts.filter((count) =>
        count.course.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredCounts;
  }, [allotmentCounts, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof IAllotmentCount];
      const second = b[sortDescriptor.column as keyof IAllotmentCount];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = (count: IAllotmentCount, columnKey: React.Key) => {
    const cellValue = count[columnKey as keyof IAllotmentCount];

    switch (columnKey) {
      case "course":
        return cellValue;
      case "quota":
        return <Chip color={quotaColorMap[cellValue as string]}>{cellValue}</Chip>;
      case "count":
      case "totalCount":
        return cellValue;
      default:
        return cellValue;
    }
  };

  const onNextPage = () => {
    if (page < pages) {
      setPage(page + 1);
    }
  };

  const onPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const onSearchChange = (value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  };

  const onClear = () => {
    setFilterValue("");
    setPage(1);
  };

  return (
    <Table
      aria-label="Allotment counts table"
      isHeaderSticky
      bottomContent={
        <div className="py-2 px-2 flex justify-between items-center">
          <span className="w-[30%] text-small text-default-400">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${filteredItems.length} selected`}
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
          <div className="hidden sm:flex w-[30%] justify-end gap-2">
            <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
              Previous
            </Button>
            <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
              Next
            </Button>
          </div>
        </div>
      }
      topContent={
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-3 items-end">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search by course..."
              startContent={<Searchicon />}
              value={filterValue}
              onClear={onClear}
              onValueChange={onSearchChange}
            />
            <Button color="primary">Add New</Button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">Total {allotmentCounts.length} allotments</span>
            <label className="flex items-center text-default-400 text-small">
              Rows per page:
              <select
                className="bg-transparent outline-none text-default-400 text-small"
                onChange={onRowsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
          </div>
        </div>
      }
      topContentPlacement="outside"
      bottomContentPlacement="outside"
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={INITIAL_VISIBLE_COLUMNS.map((column) => ({ uid: column, name: column }))}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align="start"
            allowsSorting={true}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent="No allotments found" items={sortedItems}>
        {(item) => (
          <TableRow key={item.course + item.quota}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
