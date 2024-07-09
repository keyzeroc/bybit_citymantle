import { ColumnDef } from "@tanstack/react-table";
import { Listing } from "../GetFloor";

export const columns: ColumnDef<Listing>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
];
